/**
 * lib/reviewer.ts
 * AI System Design Reviewer — prompt builder, Gemini vision invocation,
 * and JSON review parser.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ReviewResponse } from "@/types/review";
import { parseBase64Image } from "@/lib/gemini";
import { sanitizeMermaid } from "@/lib/mermaid-sanitizer";

const apiKey = process.env.GEMINI_API_KEY;
export const genAI = new GoogleGenerativeAI(apiKey || "placeholder-key");

/**
 * System Instruction enforcing strict JSON review contract.
 */
export const ARCHITECTURE_REVIEWER_PROMPT = `
You are a Staff Infrastructure Architect conducting a rigorous System Design Review of an uploaded architecture diagram. The diagram may be a clean digital export (draw.io, Lucidchart) OR a hand-drawn whiteboard sketch.

TASKS:
1. Identify all nodes (components, services, databases, queues, clients) and directed edges (data flow, RPCs, HTTP, events).
2. Evaluate the architecture across 4 core engineering categories:
   - SCALABILITY: horizontal scaling limits, database write bottlenecks, missing load balancing/caching/sharding layers.
   - RELIABILITY: single points of failure, missing replicas, lack of dead-letter queues (DLQ), unhandled failovers, circuit breaker gaps.
   - BOTTLENECKS: synchronous call chains, database lock contention, monolithic bottleneck nodes.
   - DESIGN TRADEOFFS: valid design choices with explicit costs and benefits (e.g. monolithic DB simplifies consistency but limits write scaling).
3. Reconstruct a clean, canonical Mermaid.js flowchart (using 'flowchart TD' or 'graph TD') representing the visual topology.

RESPONSE CONTRACT:
You MUST respond with ONLY a valid JSON object matching this schema EXACTLY. No markdown text outside the JSON.

JSON SCHEMA:
{
  "architectureTitle": "Descriptive Title of Identified Architecture",
  "summary": "Concise 2-3 sentence overview summarizing the topology and primary engineering assessment.",
  "confidenceScore": 85,
  "ambiguities": [
    "List of any hand-drawn text or ambiguous connections that were hard to decipher (empty array if clear)"
  ],
  "categories": {
    "scalability": [
      {
        "id": "scale-1",
        "title": "Concise Issue Title",
        "severity": "critical|warning|info",
        "explanation": "Detailed explanation of why this limits scalability.",
        "recommendation": "Concrete engineering recommendation to resolve."
      }
    ],
    "reliability": [
      {
        "id": "rel-1",
        "title": "Concise Issue Title",
        "severity": "critical|warning|info",
        "explanation": "Explanation of failure risk.",
        "recommendation": "Concrete mitigation strategy."
      }
    ],
    "bottlenecks": [
      {
        "id": "bot-1",
        "title": "Concise Issue Title",
        "severity": "critical|warning|info",
        "explanation": "Explanation of throughput or latency bottleneck.",
        "recommendation": "Concrete fix."
      }
    ],
    "designTradeoffs": [
      {
        "id": "trade-1",
        "title": "Concise Trade-off Title",
        "severity": "info",
        "explanation": "Contextual explanation of the design decision.",
        "benefit": "Key architectural upside.",
        "cost": "Key architectural downside or operational risk."
      }
    ]
  },
  "mermaidDiagram": "flowchart TD\\n  Client[Mobile / Web Client] --> Gateway[API Gateway]\\n  Gateway --> Service[Order Service]\\n  Service --> DB[(PostgreSQL Main)]"
}
`.trim();

/**
 * Invokes Gemini 2.5 Flash Vision to interpret diagram & generate structured JSON review.
 */
export async function analyzeArchitectureDiagram(
  base64Image: string
): Promise<ReviewResponse> {
  const imagePart = parseBase64Image(base64Image);

  // Gemini 2.5 Flash Vision
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.2, // Low temperature for factual, deterministic structured JSON
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    ARCHITECTURE_REVIEWER_PROMPT,
    {
      inlineData: {
        mimeType: imagePart.mimeType,
        data: imagePart.data,
      },
    },
  ]);

  const rawText = result.response.text();
  const parsed = parseReviewResponse(rawText);

  // Sanitize generated Mermaid diagram
  if (parsed.mermaidDiagram) {
    parsed.mermaidDiagram = sanitizeMermaid(parsed.mermaidDiagram);
  }

  return parsed;
}

/**
 * Parses raw JSON string from Gemini response.
 */
export function parseReviewResponse(raw: string): ReviewResponse {
  const clean = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  try {
    const data = JSON.parse(clean) as ReviewResponse;

    // Ensure fallback arrays exist if omitted
    if (!data.categories) {
      data.categories = {
        scalability: [],
        reliability: [],
        bottlenecks: [],
        designTradeoffs: [],
      };
    }
    data.categories.scalability = data.categories.scalability || [];
    data.categories.reliability = data.categories.reliability || [];
    data.categories.bottlenecks = data.categories.bottlenecks || [];
    data.categories.designTradeoffs = data.categories.designTradeoffs || [];
    data.ambiguities = data.ambiguities || [];
    data.confidenceScore = data.confidenceScore ?? 80;

    return data;
  } catch (err) {
    console.error("Failed to parse Gemini JSON review response:", clean);
    throw new Error("AI review response could not be parsed as valid JSON.");
  }
}
