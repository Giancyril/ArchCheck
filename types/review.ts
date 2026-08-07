/**
 * types/review.ts
 * Shared TypeScript interfaces for the AI System Design Reviewer pipeline.
 * Designed to be persistence-ready (V2 can add `id`, `createdAt`, `userId`).
 */

// ─── Severity ────────────────────────────────────────────────────────────────

export type Severity = "critical" | "warning" | "info";

// ─── Feedback Items ───────────────────────────────────────────────────────────

export interface FeedbackItem {
  id: string;
  title: string;
  severity: Severity;
  explanation: string;
  recommendation: string;
}

export interface TradeoffItem {
  id: string;
  title: string;
  severity: Severity;
  explanation: string;
  benefit: string;
  cost: string;
}

// ─── Review Categories ────────────────────────────────────────────────────────

export interface ReviewCategories {
  scalability: FeedbackItem[];
  reliability: FeedbackItem[];
  bottlenecks: FeedbackItem[];
  designTradeoffs: TradeoffItem[];
}

// ─── Full Review Response ─────────────────────────────────────────────────────

export interface ReviewResponse {
  architectureTitle: string;
  summary: string;
  confidenceScore: number; // 0–100
  ambiguities: string[];
  categories: ReviewCategories;
  mermaidDiagram: string;
}

// ─── API Request/Response ─────────────────────────────────────────────────────

export interface AnalyzeRequest {
  image: string; // base64 data URL, e.g. "data:image/png;base64,..."
}

export interface AnalyzeApiResponse {
  success: boolean;
  data?: ReviewResponse;
  error?: string;
}

// ─── Pipeline Stage (for progress UI) ────────────────────────────────────────

export type PipelineStage =
  | "idle"
  | "uploading"
  | "extracting"
  | "analyzing"
  | "generating"
  | "complete"
  | "error";

export interface PipelineState {
  stage: PipelineStage;
  message: string;
  progress: number; // 0–100
}
