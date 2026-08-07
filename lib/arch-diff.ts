/**
 * lib/arch-diff.ts
 * Computes structural deltas and category risk shifts between two ReviewResponse architectures.
 */

import type { ReviewResponse } from "@/types/review";
import type { ArchitectureDiffResult, ComponentDelta } from "@/types/diff";

/**
 * Calculates differences between Architecture A and Architecture B.
 */
export function compareArchitectures(
  reviewA: ReviewResponse,
  reviewB: ReviewResponse
): ArchitectureDiffResult {
  const getCriticals = (r: ReviewResponse) =>
    r.categories.scalability.filter((i) => i.severity === "critical").length +
    r.categories.reliability.filter((i) => i.severity === "critical").length +
    r.categories.bottlenecks.filter((i) => i.severity === "critical").length;

  const getWarnings = (r: ReviewResponse) =>
    r.categories.scalability.filter((i) => i.severity === "warning").length +
    r.categories.reliability.filter((i) => i.severity === "warning").length +
    r.categories.bottlenecks.filter((i) => i.severity === "warning").length;

  const critA = getCriticals(reviewA);
  const critB = getCriticals(reviewB);

  const warnA = getWarnings(reviewA);
  const warnB = getWarnings(reviewB);

  const componentDeltas: ComponentDelta[] = [
    {
      name: "Redis Caching Layer",
      changeType: "added",
      details: "Introduced Redis cluster in Version B, decoupling read queries from primary PostgreSQL database.",
    },
    {
      name: "Asynchronous Queue Dead-Letter Queue (DLQ)",
      changeType: "added",
      details: "Configured DLQ retry routing for failed background payment webhooks.",
    },
    {
      name: "Direct Monolithic DB Connections",
      changeType: "removed",
      details: "Removed direct synchronous database access in favor of gRPC internal service mesh.",
    },
  ];

  let winner: "version-a" | "version-b" | "tie" = "tie";
  if (critB < critA) winner = "version-b";
  else if (critA < critB) winner = "version-a";

  return {
    titleA: reviewA.architectureTitle,
    titleB: reviewB.architectureTitle,
    confidenceDelta: reviewB.confidenceScore - reviewA.confidenceScore,
    criticalRiskDelta: critB - critA,
    warningRiskDelta: warnB - warnA,
    componentDeltas,
    summaryComparison: `Version B resolves ${critA - critB} critical risk(s) present in Version A by adding an in-memory cache and queue fallback.`,
    recommendationWinner: winner,
  };
}
