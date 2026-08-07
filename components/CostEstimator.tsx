/**
 * components/CostEstimator.tsx
 * Infrastructure cost estimator panel with traffic slider, provider cards, and component cost breakdown.
 */
"use client";

import React, { useState } from "react";
import type { ReviewResponse } from "@/types/review";
import type { CloudProvider } from "@/types/cost";
import { estimateArchitectureCost } from "@/lib/cost-estimator";
import TrafficSlider from "@/components/TrafficSlider";
import ProviderComparisonTable from "@/components/ProviderComparisonTable";

interface CostEstimatorProps {
  review: ReviewResponse;
}

export default function CostEstimator({ review }: CostEstimatorProps) {
  const [dau, setDau] = useState<number>(100000);
  const [provider, setProvider] = useState<CloudProvider>("aws");

  const estimation = estimateArchitectureCost(review, dau);

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>
          💰 Cloud Infrastructure Cost &amp; Capacity Estimator
        </h3>
        <span className="badge badge-accent">Interactive</span>
      </div>

      <TrafficSlider dau={dau} onChange={setDau} />

      <ProviderComparisonTable
        estimation={estimation}
        selectedProvider={provider}
        onSelectProvider={setProvider}
      />

      {/* Component Breakdown Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        <div className="section-label">
          <span>📋</span>
          <span>Monthly Component Breakdown ({provider.toUpperCase()})</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {estimation.components.map((c, idx) => {
            const cost =
              provider === "aws" ? c.awsEstimate : provider === "gcp" ? c.gcpEstimate : c.azureEstimate;

            return (
              <div
                key={idx}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{c.componentName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{c.rationale}</div>
                </div>

                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-hi)", fontFamily: "var(--font-mono)" }}>
                  ${cost.toLocaleString()}
                  <span style={{ fontSize: 10, color: "var(--text-3)" }}>/mo</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Tips */}
      <div
        style={{
          padding: 14,
          borderRadius: "var(--radius-md)",
          background: "var(--emerald-bg)",
          border: "1px solid rgba(16,185,129,0.3)",
          fontSize: 12,
        }}
      >
        <div style={{ color: "var(--emerald)", fontWeight: 700, marginBottom: 6 }}>
          💡 Cost Optimization Recommendations:
        </div>
        <ul style={{ listStyle: "disc", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {estimation.costOptimizationTips.map((tip, idx) => (
            <li key={idx} style={{ color: "var(--text-2)", lineHeight: 1.5 }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
