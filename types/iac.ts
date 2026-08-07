/**
 * types/iac.ts
 * TypeScript interfaces for Infrastructure-as-Code (IaC) generation.
 */

export type IaCFormat = "terraform" | "docker-compose" | "cloudformation";

export interface IaCFile {
  filename: string;
  format: IaCFormat;
  language: "hcl" | "yaml" | "json";
  content: string;
  description: string;
}

export interface IaCGenerationResult {
  architectureTitle: string;
  provider: "aws" | "gcp" | "azure";
  files: IaCFile[];
  deploymentNotes: string[];
}
