/**
 * lib/gemini.ts
 * Google Gemini 2.5 Flash Vision client for multimodal diagram structure extraction
 * and architecture interpretation.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "placeholder-key");

/**
 * Parses a base64 Data URL into inline data format for Gemini API.
 * e.g., "data:image/png;base64,iVBORw0KGgo..." -> { mimeType: "image/png", data: "iVBORw0KGgo..." }
 */
export function parseBase64Image(dataUrl: string): {
  mimeType: string;
  data: string;
} {
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image data URL format.");
  }
  return {
    mimeType: matches[1],
    data: matches[2],
  };
}

/**
 * Raw diagram vision extraction prompt.
 * Asks Gemini Vision to identify all nodes, text labels, directional arrows, and bounding locations.
 */
export const VISION_EXTRACTION_PROMPT = `
Analyze this system architecture diagram image in detail.
Identify and list:
1. All components/nodes (e.g. Clients, Load Balancers, API Gateways, Microservices, Databases, Caches, Queues, Third-party APIs).
2. All directional connections/arrows between components and any protocol/data labels (e.g. HTTP, gRPC, SQL, Kafka, REST).
3. Any hand-drawn notes, annotations, or text blocks.
4. Note whether the diagram is a clean digital export or a hand-drawn sketch, and comment on readability.

Provide a detailed structural summary of the diagram topology.
`.trim();

/**
 * Extracts raw architectural structure from an image using Gemini 2.5 Flash Vision.
 */
export async function extractDiagramStructure(base64Image: string): Promise<string> {
  const imagePart = parseBase64Image(base64Image);

  // Use gemini-2.5-flash (or gemini-2.0-flash-exp) for high-speed multimodal vision
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent([
    VISION_EXTRACTION_PROMPT,
    {
      inlineData: {
        mimeType: imagePart.mimeType,
        data: imagePart.data,
      },
    },
  ]);

  const response = await result.response;
  return response.text();
}
