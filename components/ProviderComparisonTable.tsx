/**
 * components/ProviderComparisonTable.tsx
 * Side-by-side cloud provider cost comparison table across AWS, GCP, and Azure.
 */
"use client";

import React from "react";
import type { CostEstimationResult, CloudProvider } from "@/types/cost";

interface ProviderComparisonProps {
  estimation: CostEstimationResult;
  selectedProvider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
}

export default function ProviderComparisonTable({
  estimation,
  selectedProvider,
  onSelectProvider,
}: ProviderComparisonProps) {
  const providers: { key: CloudProvider; label: string; total: number; color: string }[] = [
    { key: "aws", label: "Amazon Web Services (AWS)", total: estimation.monthlyTotalAws, color: "var(--accent)" },
    { key: "gcp", label: "Google Cloud (GCP)", total: estimation.monthlyTotalGcp, color: "var(--emerald)" },
    { key: "azure", label: "Microsoft Azure", total: estimation.monthlyTotalAzure, color: "var(--info)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
      {providers.map((p) => {
        const isSelected = selectedProvider === p.key;
        return (
          <div
            key={p.key}
            onClick={() => onSelectProvider(p.key)}
            className="card"
            style={{
              padding: 16,
              cursor: "pointer",
              border: `1px solid ${isSelected ? p.color : "var(--border)"}`,
              background: isSelected ? "var(--surface-2)" : "var(--surface)",
              boxShadow: isSelected ? "var(--shadow-glow-sm)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {p.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: p.color, fontFamily: "var(--font-mono)" }}>
              ${p.total.toLocaleString()}
              <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500, marginLeft: 4 }}>/mo</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
