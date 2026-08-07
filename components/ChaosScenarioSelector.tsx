/**
 * components/ChaosScenarioSelector.tsx
 * Selector grid for choosing predefined disaster scenarios (DB Outage, Cache Flush, Traffic Spike, Queue Stalling).
 */
"use client";

import React from "react";
import type { ChaosScenario, ChaosScenarioType } from "@/types/chaos";
import { PREDEFINED_SCENARIOS } from "@/lib/chaos-engine";

interface ChaosScenarioSelectorProps {
  selectedScenario: ChaosScenarioType;
  onSelect: (scenarioId: ChaosScenarioType) => void;
}

export default function ChaosScenarioSelector({
  selectedScenario,
  onSelect,
}: ChaosScenarioSelectorProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {PREDEFINED_SCENARIOS.map((s) => {
        const isSelected = selectedScenario === s.id;
        return (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              border: `1px solid ${isSelected ? "var(--critical)" : "var(--border)"}`,
              background: isSelected ? "var(--critical-bg)" : "var(--surface-2)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "var(--critical)" : "var(--text-1)", marginBottom: 4 }}>
              {s.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.4 }}>
              {s.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
