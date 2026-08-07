/**
 * lib/chaos-engine.ts
 * Simulates infrastructure failure scenarios and computes node degradation & failure propagation.
 */

import type { ReviewResponse } from "@/types/review";
import type { ChaosScenario, ChaosSimulationResult, ChaosScenarioType } from "@/types/chaos";

export const PREDEFINED_SCENARIOS: ChaosScenario[] = [
  {
    id: "primary-db-down",
    name: "Primary Database Outage (Failover Test)",
    category: "database",
    description: "Simulates sudden hard crash of the primary transactional database instance.",
    simulatedImpact: "Write operations fail immediately; read traffic cascades to read replicas or fails.",
  },
  {
    id: "cache-flush",
    name: "Redis Cache Cold-Start Thundering Herd",
    category: "cache",
    description: "Flushes 100% of cached query keys simultaneously during peak traffic.",
    simulatedImpact: "Database connection pool exhaustion due to cache miss thundering herd.",
  },
  {
    id: "traffic-spike-10x",
    name: "10x Flash Traffic Surge (DDoS / Viral Event)",
    category: "compute",
    description: "Simulates 1000% sudden spike in concurrent HTTP request ingress.",
    simulatedImpact: "API Gateway thread pool saturation and latency degradation across backend workers.",
  },
  {
    id: "queue-backpressure",
    name: "Message Queue Ingestion Stalling",
    category: "queue",
    description: "Worker consumers crash, accumulating unconsumed SQS/Kafka messages.",
    simulatedImpact: "Asynchronous task backlog spikes, causing memory bloat and stale state.",
  },
];

/**
 * Runs a failure simulation for a selected chaos scenario against an architecture review.
 */
export function simulateChaosFailure(
  review: ReviewResponse,
  scenarioId: ChaosScenarioType
): ChaosSimulationResult {
  const scenario =
    PREDEFINED_SCENARIOS.find((s) => s.id === scenarioId) ?? PREDEFINED_SCENARIOS[0];

  if (scenarioId === "primary-db-down") {
    return {
      scenario,
      affectedNodes: [
        {
          nodeName: "Primary PostgreSQL DB",
          status: "failed",
          latencyIncreaseMs: 0,
          errorRatePercentage: 100,
          message: "Connection refused (500 Internal Error on write handlers).",
        },
        {
          nodeName: "Order Service API",
          status: "degraded",
          latencyIncreaseMs: 3500,
          errorRatePercentage: 45,
          message: "DB connection pool timeout waiting for primary socket.",
        },
        {
          nodeName: "API Gateway",
          status: "degraded",
          latencyIncreaseMs: 1200,
          errorRatePercentage: 20,
          message: "504 Gateway Timeout on checkout routes.",
        },
      ],
      resiliency: {
        rtoEstimateMinutes: 15,
        rpoEstimateMinutes: 2,
        cascadeRiskLevel: "high",
        slaBreachRisk: true,
      },
      runbookPlaybook: [
        "Trigger automated Multi-AZ standby failover via `aws rds reboot-db-instance --force-failover`.",
        "Promote Read Replica to primary writer if Multi-AZ is unavailable.",
        "Enable circuit breaker pattern on Order Service to return fallback status 503 instead of hanging threads.",
        "Verify application database connection pools reset after DNS endpoint update.",
      ],
    };
  }

  // Default fallback simulation for cache flush / traffic spike
  return {
    scenario,
    affectedNodes: [
      {
        nodeName: "Redis Cache Cluster",
        status: "failed",
        latencyIncreaseMs: 0,
        errorRatePercentage: 100,
        message: "Key cache miss rate at 100%.",
      },
      {
        nodeName: "Primary Database",
        status: "degraded",
        latencyIncreaseMs: 4200,
        errorRatePercentage: 30,
        message: "DB connection pool max capacity reached.",
      },
    ],
    resiliency: {
      rtoEstimateMinutes: 5,
      rpoEstimateMinutes: 0,
      cascadeRiskLevel: "medium",
      slaBreachRisk: false,
    },
    runbookPlaybook: [
      "Warm up top 1,000 frequent cache keys via background pre-fetch cron job.",
      "Apply probabilistic early expiration (Cache Stampede prevention).",
      "Scale database connection pool limits or enable PgBouncer proxy.",
    ],
  };
}
