/**
 * types/chaos.ts
 * TypeScript interfaces for Disaster Recovery (DR) & Chaos Engineering Simulations.
 */

export type ChaosScenarioType =
  | "primary-db-down"
  | "cache-flush"
  | "traffic-spike-10x"
  | "queue-backpressure"
  | "network-partition";

export interface ChaosScenario {
  id: ChaosScenarioType;
  name: string;
  category: "database" | "cache" | "compute" | "queue" | "network";
  description: string;
  simulatedImpact: string;
}

export interface AffectedNode {
  nodeName: string;
  status: "failed" | "degraded" | "healthy";
  latencyIncreaseMs: number;
  errorRatePercentage: number;
  message: string;
}

export interface ResiliencyMetrics {
  rtoEstimateMinutes: number; // Recovery Time Objective
  rpoEstimateMinutes: number; // Recovery Point Objective
  cascadeRiskLevel: "low" | "medium" | "high" | "critical";
  slaBreachRisk: boolean;
}

export interface ChaosSimulationResult {
  scenario: ChaosScenario;
  affectedNodes: AffectedNode[];
  resiliency: ResiliencyMetrics;
  runbookPlaybook: string[];
}
