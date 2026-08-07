/**
 * components/SecurityAuditPanel.tsx
 * Comprehensive Security & Compliance Audit Panel.
 */
"use client";

import React from "react";
import type { ReviewResponse } from "@/types/review";
import { auditArchitectureSecurity } from "@/lib/security-auditor";
import SecurityThreatList from "@/components/SecurityThreatList";
import ComplianceChecklist from "@/components/ComplianceChecklist";

interface SecurityAuditPanelProps {
  review: ReviewResponse;
}

export default function SecurityAuditPanel({ review }: SecurityAuditPanelProps) {
  const audit = auditArchitectureSecurity(review);

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>
            🛡️ Security Threat Modeling &amp; Compliance Audit
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>Security Score:</span>
          <span className="badge badge-accent" style={{ fontSize: 14, padding: "4px 10px" }}>
            {audit.overallSecurityScore}/100
          </span>
        </div>
      </div>

      {/* Compliance Frameworks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="section-label">
          <span>📜</span>
          <span>Compliance Framework Readiness (SOC2 / HIPAA / GDPR)</span>
        </div>
        <ComplianceChecklist frameworks={audit.compliance} />
      </div>

      {/* Threat List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <div className="section-label">
          <span>⚠️</span>
          <span>Identified Threat Vectors &amp; Security Risks</span>
        </div>
        <SecurityThreatList threats={audit.threats} />
      </div>
    </div>
  );
}
