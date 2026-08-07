/**
 * lib/gemini.ts
 * Gemini 2.5 Flash client — vision analysis, architecture interpretation,
 * feedback generation, and Mermaid.js diagram synthesis.
 * (Implemented in Stage 3 & 4)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});
