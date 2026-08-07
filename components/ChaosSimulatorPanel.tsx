/**
 * components/ChaosSimulatorPanel.tsx
 * Container panel assembling ChaosScenarioSelector, ResiliencyMetricsCard, FailurePropagationGraph, and IncidentPlaybookView.
 */
"use client";

import React, { useState } from "react";
import type { ReviewResponse } from "@/types/review";
import type { ChaosScenarioType } from "@/types/chaos";
import { simulateChaosFailure } from "@/lib/chaos-engine";
import ChaosScenarioSelector from "@/components/ChaosScenarioSelector";
import ResiliencyMetricsCard from "@/components/ResiliencyMetricsCard";
import FailurePropagationGraph from "@/components/FailurePropagationGraph";
import IncidentPlaybookView from "@/components/IncidentPlaybookView";

interface ChaosSimulatorPanelProps {
  review: ReviewResponse;
}

export default function ChaosSimulatorPanel({ review }: ChaosSimulatorPanelProps) {
  const [scenarioId, setScenarioId] = useState<ChaosScenarioType>("primary-db-down");

  const result = simulateChaosFailure(review, scenarioId);

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>
            💥 Disaster Recovery (DR) &amp; Chaos Engineering Simulator
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>
            Simulate real-world infrastructure outages and evaluate failure propagation across your topology.
          </p>
        </div>
        <span className="badge badge-critical">Chaos Mode</span>
      </div>

      {/* Selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="section-label">
          <span>🎯</span>
          <span>Select Failure Scenario to Inject</span>
        </div>
        <ChaosScenarioSelector selectedScenario={scenarioId} onSelect={setScenarioId} />
      </div>

      {/* Metrics */}
      <ResiliencyMetricsCard resiliency={result.resiliency} />

      {/* Affected Nodes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="section-label">
          <span>⚡</span>
          <span>Cascading Failure Propagation Path</span>
        </div>
        <FailurePropagationGraph nodes={result.affectedNodes} />
      </div>

      {/* Incident Playbook */}
      <IncidentPlaybookView playbook={result.runbookPlaybook} />
    </div>
  );
}
