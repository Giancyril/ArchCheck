/**
 * types/diff.ts
 * TypeScript interfaces for Architecture Diff & Side-by-Side Comparison.
 */

import type { ReviewResponse } from "@/types/review";

export interface ComponentDelta {
  name: string;
  changeType: "added" | "removed" | "modified" | "unchanged";
  details: string;
}

export interface ArchitectureDiffResult {
  titleA: string;
  titleB: string;
  confidenceDelta: number;
  criticalRiskDelta: number;
  warningRiskDelta: number;
  componentDeltas: ComponentDelta[];
  summaryComparison: string;
  recommendationWinner: "version-a" | "version-b" | "tie";
}
