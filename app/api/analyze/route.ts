/**
 * app/api/analyze/route.ts
 * POST /api/analyze — Accepts base64 diagram image, runs full Gemini 2.5 Flash
 * Architecture Review pipeline, returns structured JSON review + Mermaid diagram.
 */

import { NextRequest, NextResponse } from "next/server";
import type { AnalyzeApiResponse, AnalyzeRequest, ReviewResponse } from "@/types/review";
import { analyzeArchitectureDiagram } from "@/lib/reviewer";

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

    // ── AI Architecture Review Pipeline ─────────────────────────────────────
    let review: ReviewResponse;

    if (process.env.GEMINI_API_KEY) {
      review = await analyzeArchitectureDiagram(body.image);
    } else {
      // Mock review fallback for local development without API key
      review = {
        architectureTitle: "3-Tier Web Application Architecture",
        summary:
          "Identified a standard 3-tier web topology consisting of a React client, API Gateway, Order Processing Microservice, and primary PostgreSQL instance.",
        confidenceScore: 90,
        ambiguities: ["Connection protocol between Gateway and Order Service is unlabelled"],
        categories: {
          scalability: [
            {
              id: "scale-1",
              title: "Single Relational Database Write Bottleneck",
              severity: "critical",
              explanation: "All transactional writes flow directly into a single primary PostgreSQL instance without read/write splitting or caching.",
              recommendation: "Introduce Redis cache for read-heavy operations and configure PostgreSQL read replicas.",
            },
          ],
          reliability: [
            {
              id: "rel-1",
              title: "Missing Dead Letter Queue (DLQ)",
              severity: "warning",
              explanation: "Asynchronous processing queue lacks a failure retry fallback.",
              recommendation: "Configure a Dead Letter Queue (DLQ) with exponential backoff and alert routing.",
            },
          ],
          bottlenecks: [
            {
              id: "bot-1",
              title: "Synchronous Payment Gateway Integration",
              severity: "warning",
              explanation: "Payment API call blocks the HTTP handler thread, increasing latency.",
              recommendation: "Use async webhook callbacks for payment confirmation.",
            },
          ],
          designTradeoffs: [
            {
              id: "trade-1",
              title: "Centralized Monolithic API Gateway",
              severity: "info",
              explanation: "Simplifies routing and authentication but creates a single point of failure.",
              benefit: "Unified security policies and client routing.",
              cost: "Gateway outage impacts all downstream services.",
            },
          ],
        },
        mermaidDiagram:
          "flowchart TD\n  Client[Web Client] --> Gateway[API Gateway]\n  Gateway --> Service[Order Service]\n  Service --> DB[(PostgreSQL Main)]\n  Service --> Cache[(Redis Cache)]",
      };
    }

    return NextResponse.json<AnalyzeApiResponse>({
      success: true,
      data: review,
    });
  } catch (err: unknown) {
    console.error("[/api/analyze] Review pipeline error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to generate system design review.";
    return NextResponse.json<AnalyzeApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
