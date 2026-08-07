/**
 * components/IncidentPlaybookView.tsx
 * Step-by-step incident response playbook & SRE runbook commands.
 */
"use client";

import React from "react";

interface IncidentPlaybookViewProps {
  playbook: string[];
}

export default function IncidentPlaybookView({ playbook }: IncidentPlaybookViewProps) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--emerald)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span>📜</span> Automated SRE Incident Mitigation Playbook
      </div>

      <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
        {playbook.map((step, idx) => (
          <li key={idx} style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.5 }}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
