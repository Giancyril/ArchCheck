/**
 * components/SecurityThreatList.tsx
 * Security vulnerability cards displaying severity badges, attack vector highlights, and fix mitigations.
 */
"use client";

import React from "react";
import type { SecurityVulnerability } from "@/types/security";

interface SecurityThreatListProps {
  threats: SecurityVulnerability[];
}

export default function SecurityThreatList({ threats }: SecurityThreatListProps) {
  const getBadgeClass = (severity: SecurityVulnerability["severity"]) => {
    switch (severity) {
      case "critical": return "badge-critical";
      case "high": return "badge-critical";
      case "medium": return "badge-warning";
      default: return "badge-info";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {threats.map((t) => (
        <div key={t.id} className="finding-card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{t.title}</h5>
            <span className={`badge ${getBadgeClass(t.severity)}`}>{t.severity}</span>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 10 }}>
            {t.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid rgba(244,63,94,0.2)", fontSize: 11 }}>
              <span style={{ color: "var(--critical)", fontWeight: 700, display: "block", marginBottom: 2 }}>
                ⚠️ Attack Vector:
              </span>
              <span style={{ color: "var(--text-1)" }}>{t.attackVector}</span>
            </div>

            <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 11 }}>
              <span style={{ color: "var(--emerald)", fontWeight: 700, display: "block", marginBottom: 2 }}>
                🛡️ Recommended Mitigation:
              </span>
              <span style={{ color: "var(--text-1)" }}>{t.mitigation}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
