/**
 * components/ResiliencyMetricsCard.tsx
 * Renders Recovery Time Objective (RTO), Recovery Point Objective (RPO), and SLA breach risk.
 */
"use client";

import React from "react";
import type { ResiliencyMetrics } from "@/types/chaos";

interface ResiliencyMetricsCardProps {
  resiliency: ResiliencyMetrics;
}

export default function ResiliencyMetricsCard({ resiliency }: ResiliencyMetricsCardProps) {
  const getRiskBadge = (level: ResiliencyMetrics["cascadeRiskLevel"]) => {
    switch (level) {
      case "critical": return "badge-critical";
      case "high": return "badge-critical";
      case "medium": return "badge-warning";
      default: return "badge-accent";
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {/* RTO Card */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
          Estimated RTO (Recovery Time)
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-hi)", fontFamily: "var(--font-mono)" }}>
          {resiliency.rtoEstimateMinutes} <span style={{ fontSize: 12, color: "var(--text-3)" }}>min</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>Target time to restore service availability</div>
      </div>

      {/* RPO Card */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
          Estimated RPO (Data Loss Window)
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--emerald)", fontFamily: "var(--font-mono)" }}>
          {resiliency.rpoEstimateMinutes} <span style={{ fontSize: 12, color: "var(--text-3)" }}>min</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>Maximum acceptable data loss threshold</div>
      </div>

      {/* Risk Level */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
          Cascading Risk Level
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span className={`badge ${getRiskBadge(resiliency.cascadeRiskLevel)}`} style={{ fontSize: 12, padding: "4px 10px" }}>
            {resiliency.cascadeRiskLevel.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 8 }}>
          SLA Breach Risk: <span style={{ fontWeight: 700, color: resiliency.slaBreachRisk ? "var(--critical)" : "var(--emerald)" }}>
            {resiliency.slaBreachRisk ? "YES (SLA At Risk)" : "NO (Within SLA)"}
          </span>
        </div>
      </div>
    </div>
  );
}
