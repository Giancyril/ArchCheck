/**
 * components/ComplianceChecklist.tsx
 * Compliance framework checklist component for SOC2, HIPAA, GDPR, and CIS Benchmarks.
 */
"use client";

import React from "react";
import type { ComplianceFrameworkScore } from "@/types/security";

interface ComplianceChecklistProps {
  frameworks: ComplianceFrameworkScore[];
}

export default function ComplianceChecklist({ frameworks }: ComplianceChecklistProps) {
  const getStatusBadge = (status: ComplianceFrameworkScore["status"]) => {
    switch (status) {
      case "compliant": return <span className="badge badge-accent">Compliant</span>;
      case "needs-remediation": return <span className="badge badge-warning">Remediation Needed</span>;
      default: return <span className="badge badge-critical">Non-Compliant</span>;
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
      {frameworks.map((f, idx) => (
        <div key={idx} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{f.name}</span>
            {getStatusBadge(f.status)}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: f.score >= 80 ? "var(--emerald)" : "var(--warning)", fontFamily: "var(--font-mono)" }}>
              {f.score}%
            </span>
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>
              ({f.passedChecks}/{f.totalChecks} checks passed)
            </span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${f.score}%`,
                background: f.score >= 80 ? "var(--emerald)" : "var(--warning)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
