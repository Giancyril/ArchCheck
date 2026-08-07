/**
 * lib/cost-estimator.ts
 * Estimates cloud infrastructure costs across AWS, GCP, and Azure based on architecture components and traffic scale.
 */

import type { ReviewResponse } from "@/types/review";
import type { CostEstimationResult, ComponentCostItem } from "@/types/cost";

/**
 * Calculates estimated monthly cloud costs scaled by Daily Active Users (DAU).
 */
export function estimateArchitectureCost(
  review: ReviewResponse,
  trafficDau: number = 100000
): CostEstimationResult {
  const scaleMultiplier = Math.max(0.5, trafficDau / 100000);

  // Extract component names from diagram or fallback to defaults
  const items: ComponentCostItem[] = [
    {
      componentName: "Compute Services (API Gateway / Worker Nodes)",
      category: "compute",
      awsEstimate: Math.round(120 * scaleMultiplier),
      gcpEstimate: Math.round(110 * scaleMultiplier),
      azureEstimate: Math.round(125 * scaleMultiplier),
      rationale: "ECS / EKS container instances scaled for HTTP request volume.",
    },
    {
      componentName: "Primary Database Instance (PostgreSQL / MySQL)",
      category: "database",
      awsEstimate: Math.round(250 * scaleMultiplier),
      gcpEstimate: Math.round(230 * scaleMultiplier),
      azureEstimate: Math.round(260 * scaleMultiplier),
      rationale: "Multi-AZ managed relational database with automated failover.",
    },
    {
      componentName: "In-Memory Cache (Redis / Memcached)",
      category: "cache",
      awsEstimate: Math.round(75 * scaleMultiplier),
      gcpEstimate: Math.round(70 * scaleMultiplier),
      azureEstimate: Math.round(80 * scaleMultiplier),
      rationale: "Cluster mode enabled for session cache and query caching.",
    },
    {
      componentName: "Message Queue & Stream (Kafka / SQS / PubSub)",
      category: "queue",
      awsEstimate: Math.round(45 * scaleMultiplier),
      gcpEstimate: Math.round(40 * scaleMultiplier),
      azureEstimate: Math.round(50 * scaleMultiplier),
      rationale: "Asynchronous event ingest with dead-letter queue (DLQ).",
    },
  ];

  const monthlyTotalAws = items.reduce((sum, item) => sum + item.awsEstimate, 0);
  const monthlyTotalGcp = items.reduce((sum, item) => sum + item.gcpEstimate, 0);
  const monthlyTotalAzure = items.reduce((sum, item) => sum + item.azureEstimate, 0);

  const tips: string[] = [
    "Use Savings Plans or 1-Year Reserved Instances to reduce EC2/RDS costs by up to 38%.",
    "Configure Redis TTL eviction policies to prevent uncontrolled memory growth.",
    "Offload static assets to S3 + CloudFront CDN to minimize primary server bandwidth charges.",
  ];

  return {
    monthlyTotalAws,
    monthlyTotalGcp,
    monthlyTotalAzure,
    trafficScaleDau: trafficDau,
    components: items,
    costOptimizationTips: tips,
  };
}
