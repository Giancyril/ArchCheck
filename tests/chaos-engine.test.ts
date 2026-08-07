/**
 * tests/chaos-engine.test.ts
 * Unit tests for chaos failure engine calculations.
 */

import { simulateChaosFailure, PREDEFINED_SCENARIOS } from "../lib/chaos-engine";
import type { ReviewResponse } from "../types/review";

const mockReview: ReviewResponse = {
  architectureTitle: "Test System Architecture",
  summary: "Test summary",
  confidenceScore: 90,
  ambiguities: [],
  categories: {
    scalability: [],
    reliability: [],
    bottlenecks: [],
    designTradeoffs: [],
  },
  mermaidDiagram: "flowchart TD\n  Client --> Server",
};

export function testChaosEngine() {
  console.log("Running chaos engine unit tests...");

  const result = simulateChaosFailure(mockReview, "primary-db-down");

  if (!result.scenario) throw new Error("Chaos simulation failed: Missing scenario.");
  if (result.affectedNodes.length === 0) throw new Error("Chaos simulation failed: Expected affected nodes.");
  if (result.resiliency.rtoEstimateMinutes <= 0) throw new Error("Chaos simulation failed: Invalid RTO estimate.");

  console.log("✓ Chaos engine tests passed.");
}

testChaosEngine();
