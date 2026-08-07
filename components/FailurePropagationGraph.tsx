/**
 * components/FailurePropagationGraph.tsx
 * Visualizes cascading failure propagation across affected service nodes.
 */
"use client";

import React from "react";
import type { AffectedNode } from "@/types/chaos";

interface FailurePropagationGraphProps {
  nodes: AffectedNode[];
}

export default function FailurePropagationGraph({ nodes }: FailurePropagationGraphProps) {
  const getStatusBadge = (status: AffectedNode["status"]) => {
    switch (status) {
      case "failed": return <span className="badge badge-critical">Failed</span>;
      case "degraded": return <span className="badge badge-warning">Degraded</span>;
      default: return <span className="badge badge-accent">Healthy</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {nodes.map((node, idx) => (
        <div
          key={idx}
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-2)",
            border: `1px solid ${node.status === "failed" ? "rgba(244,63,94,0.3)" : "var(--border)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{node.nodeName}</span>
              {getStatusBadge(node.status)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{node.message}</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--critical)", fontFamily: "var(--font-mono)" }}>
              +{node.latencyIncreaseMs}ms latency
            </div>
            <div style={{ fontSize: 10, color: "var(--text-3)" }}>
              {node.errorRatePercentage}% error rate
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
