/**
 * types/security.ts
 * TypeScript interfaces for Security Threat Modeling & Compliance Audits (SOC2, HIPAA, GDPR).
 */

export type ThreatSeverity = "critical" | "high" | "medium" | "low";

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: ThreatSeverity;
  category: "data-in-transit" | "data-at-rest" | "auth" | "network-ingress" | "compliance";
  description: string;
  attackVector: string;
  mitigation: string;
}

export interface ComplianceFrameworkScore {
  name: "SOC 2 Type II" | "HIPAA" | "GDPR" | "CIS Benchmarks";
  score: number; // 0-100
  status: "compliant" | "needs-remediation" | "non-compliant";
  passedChecks: number;
  totalChecks: number;
}

export interface SecurityAuditResult {
  overallSecurityScore: number; // 0-100
  threats: SecurityVulnerability[];
  compliance: ComplianceFrameworkScore[];
}
