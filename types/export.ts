/**
 * types/export.ts
 * TypeScript interfaces for Architecture Review report exporting & URL sharing.
 */

export type ExportFormat = "json" | "markdown" | "mermaid-svg" | "mermaid-code" | "pdf-summary";

export interface ExportOptions {
  format: ExportFormat;
  includeMermaid: boolean;
  includeTradeoffs: boolean;
  includeRecommendations: boolean;
}

export interface ShareablePayload {
  version: string;
  title: string;
  summary: string;
  score: number;
  mermaid: string;
  timestamp: number;
}
