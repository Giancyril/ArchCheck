/**
 * app/api/copilot/route.ts
 * POST API handler for AI Copilot diagram context Q&A and Mermaid refactoring requests.
 */

import { NextResponse } from "next/server";
import { generateCopilotResponse } from "@/lib/copilot";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, architectureTitle, summary, currentMermaid } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required." }, { status: 400 });
    }

    const reply = await generateCopilotResponse({
      prompt,
      architectureTitle: architectureTitle ?? "System Architecture",
      summary: summary ?? "",
      currentMermaid: currentMermaid ?? "",
    });

    return NextResponse.json({ success: true, data: reply });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Copilot failed to respond.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
