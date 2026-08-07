/**
 * lib/copilot.ts
 * Architecture-aware AI Copilot helper using Gemini 2.5 Flash.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

interface CopilotInput {
  prompt: string;
  architectureTitle: string;
  summary: string;
  currentMermaid: string;
}

interface CopilotReply {
  content: string;
  suggestedMermaidFix?: string;
}

export async function generateCopilotResponse(input: CopilotInput): Promise<CopilotReply> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Fallback answer when API key is unconfigured
    return {
      content: `I am analyzing your **${input.architectureTitle}**. To scale this system for higher traffic:\n\n1. **Read Scaling**: Add a Redis cache cluster in front of the PostgreSQL database to absorb read bursts.\n2. **Async Processing**: Offload heavy webhook deliveries to an SQS queue with Dead Letter Queue (DLQ) retry handlers.\n3. **Multi-Region**: Configure AWS Route 53 latency-based routing with read replicas across regions.`,
      suggestedMermaidFix: input.currentMermaid
        ? `${input.currentMermaid}\n  Service --> Cache[(Redis Cache Cluster)]\n  Service --> Queue[(SQS Queue)]`
        : undefined,
    };
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `You are a Senior Principal Cloud Architect serving as an AI Architecture Copilot.
You are assisting an engineer reviewing the architecture diagram titled: "${input.architectureTitle}".
Summary: "${input.summary}".
Current Mermaid.js Diagram:
\`\`\`mermaid
${input.currentMermaid}
\`\`\`

User Request: "${input.prompt}"

Provide a concise, expert answer with actionable technical recommendations.
If your recommendation suggests modifying the diagram, include a JSON block formatted like:
\`\`\`json
{
  "content": "Your markdown explanation...",
  "suggestedMermaidFix": "flowchart TD\\n..."
}
\`\`\``;

  const result = await model.generateContent(systemPrompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        content: parsed.content || text,
        suggestedMermaidFix: parsed.suggestedMermaidFix,
      };
    }
  } catch (err) {
    // Return raw text if JSON extraction fails
  }

  return { content: text };
}
