/**
 * app/api/analyze/route.ts
 * POST /api/analyze — Accepts base64 image, runs Gemini Vision diagram structure
 * extraction, and returns preliminary analysis.
 */

import { NextRequest, NextResponse } from "next/server";
import type { AnalyzeApiResponse, AnalyzeRequest } from "@/types/review";
import { extractDiagramStructure } from "@/lib/gemini";

const MAX_SIZE_BYTES = parseInt(
  process.env.NEXT_PUBLIC_MAX_UPLOAD_BYTES ?? "10485760"
);
const ALLOWED_PREFIXES = [
  "data:image/png;base64,",
  "data:image/jpeg;base64,",
  "data:image/webp;base64,",
  "data:image/gif;base64,",
];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequest;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!body?.image) {
      return NextResponse.json<AnalyzeApiResponse>(
        { success: false, error: "No image provided." },
        { status: 400 }
      );
    }

    const isAllowedType = ALLOWED_PREFIXES.some((p) =>
      body.image.startsWith(p)
    );
    if (!isAllowedType) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error:
            "Unsupported image format. Please upload PNG, JPG, WebP, or GIF.",
        },
        { status: 415 }
      );
    }

    const estimatedBytes = (body.image.length * 3) / 4;
    if (estimatedBytes > MAX_SIZE_BYTES) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error: `Image too large. Maximum size is ${MAX_SIZE_BYTES / 1048576}MB.`,
        },
        { status: 413 }
      );
    }

    // ── Stage 3: Vision Extraction via Gemini Vision ────────────────────────
    let rawVisionExtraction = "";
    if (process.env.GEMINI_API_KEY) {
      rawVisionExtraction = await extractDiagramStructure(body.image);
    } else {
      // Fallback for dev mode when key is missing
      rawVisionExtraction =
        "Simulated Vision Extraction: Detected Client -> API Gateway -> Service -> Database.";
    }

    // Return structured response with raw Vision output summary
    return NextResponse.json<AnalyzeApiResponse>({
      success: true,
      data: {
        architectureTitle: "Diagram Vision Analysis",
        summary: rawVisionExtraction,
        confidenceScore: 85,
        ambiguities: [],
        categories: {
          scalability: [],
          reliability: [],
          bottlenecks: [],
          designTradeoffs: [],
        },
        mermaidDiagram:
          "graph TD\n  Client[Client] --> Gateway[API Gateway]\n  Gateway --> Service[Microservice]\n  Service --> DB[(Database)]",
      },
    });
  } catch (err: unknown) {
    console.error("[/api/analyze] Vision extraction error:", err);
    const msg = err instanceof Error ? err.message : "Failed to analyze diagram.";
    return NextResponse.json<AnalyzeApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
