/**
 * app/api/analyze/route.ts
 * POST /api/analyze — Accepts a base64 image, runs the full AI review pipeline,
 * returns structured feedback + Mermaid.js diagram.
 *
 * Stage 2: Returns mock success response.
 * Stage 3: Integrates Gemini Vision.
 * Stage 4: Integrates full review generation.
 */

import { NextRequest, NextResponse } from "next/server";
import type { AnalyzeApiResponse, AnalyzeRequest } from "@/types/review";

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

    // Rough size check (base64 is ~4/3x raw bytes)
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

    // ── TODO Stage 3: Call Gemini Vision + Stage 4: Generate Review ─────────
    // For Stage 2, return a mock success to confirm the upload pipeline works.
    return NextResponse.json<AnalyzeApiResponse>({
      success: true,
      data: {
        architectureTitle: "Upload Confirmed — AI Analysis Coming in Stage 3",
        summary:
          "Image received and validated successfully. Gemini Vision integration will be added in Stage 3.",
        confidenceScore: 0,
        ambiguities: [],
        categories: {
          scalability: [],
          reliability: [],
          bottlenecks: [],
          designTradeoffs: [],
        },
        mermaidDiagram:
          "graph TD\n  A[Image Uploaded] --> B[Gemini Vision Analysis]\n  B --> C[Structured Review]\n  C --> D[Mermaid Diagram]",
      },
    });
  } catch (err) {
    console.error("[/api/analyze] Unhandled error:", err);
    return NextResponse.json<AnalyzeApiResponse>(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
