/**
 * components/CompareModal.tsx
 * Modal overlay providing side-by-side architecture comparison.
 */
"use client";

import React from "react";
import type { ReviewResponse } from "@/types/review";
import { compareArchitectures } from "@/lib/arch-diff";
import SideBySideViewer from "@/components/SideBySideViewer";
import CategoryDiffTable from "@/components/CategoryDiffTable";

interface CompareModalProps {
  reviewA: ReviewResponse;
  onClose: () => void;
}

export default function CompareModal({ reviewA, onClose }: CompareModalProps) {
  // Generate a mock Version B representing optimized architecture fixes
  const reviewB: ReviewResponse = {
    architectureTitle: `${reviewA.architectureTitle} (Optimized V2)`,
    summary: "Refactored topology introducing Redis cluster for read scaling and SQS Dead Letter Queue (DLQ) for failed payment retry routing.",
    confidenceScore: 95,
    ambiguities: [],
    categories: {
      scalability: [],
      reliability: [],
      bottlenecks: [],
      designTradeoffs: reviewA.categories.designTradeoffs,
    },
    mermaidDiagram: reviewA.mermaidDiagram
      ? `${reviewA.mermaidDiagram}\n  Service --> Cache[(Redis Cache Cluster)]\n  Service --> DLQ[(SQS Dead-Letter Queue)]`
      : "flowchart TD\n  Client --> Gateway\n  Gateway --> Service\n  Service --> DB[(PostgreSQL)]\n  Service --> Cache[(Redis Cluster)]",
  };

  const diff = compareArchitectures(reviewA, reviewB);

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(9,9,11,0.92)",
        backdropFilter: "blur(12px)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
              🔀 Side-by-Side Architecture Diff Comparison
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{diff.summaryComparison}</p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12 }}>
            ✕ Close
          </button>
        </div>

        {/* Side-by-Side Diagrams */}
        <SideBySideViewer reviewA={reviewA} reviewB={reviewB} />

        {/* Category Delta Table */}
        <CategoryDiffTable diff={diff} />
      </div>
    </div>
  );
}
