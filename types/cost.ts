/**
 * types/cost.ts
 * TypeScript interfaces for cloud infrastructure cost & capacity estimation.
 */

export type CloudProvider = "aws" | "gcp" | "azure";

export interface ComponentCostItem {
  componentName: string;
  category: "compute" | "database" | "cache" | "queue" | "gateway" | "storage";
  awsEstimate: number;
  gcpEstimate: number;
  azureEstimate: number;
  rationale: string;
}

export interface CostEstimationResult {
  monthlyTotalAws: number;
  monthlyTotalGcp: number;
  monthlyTotalAzure: number;
  trafficScaleDau: number;
  components: ComponentCostItem[];
  costOptimizationTips: string[];
}
