/**
 * components/SideBySideViewer.tsx
 * Renders side-by-side Mermaid diagrams and overview cards for Architecture A vs Architecture B.
 */
"use client";

import React from "react";
import type { ReviewResponse } from "@/types/review";
import MermaidViewer from "@/components/MermaidViewer";

interface SideBySideViewerProps {
  reviewA: ReviewResponse;
  reviewB: ReviewResponse;
}

export default function SideBySideViewer({ reviewA, reviewB }: SideBySideViewerProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
      {/* Version A */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 16, background: "var(--surface-2)" }}>
          <div className="badge badge-warning" style={{ marginBottom: 6 }}>Version A (Baseline)</div>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>{reviewA.architectureTitle}</h4>
          <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>{reviewA.summary}</p>
        </div>

        <MermaidViewer chart={reviewA.mermaidDiagram} title="Version A Topology" />
      </div>

      {/* Version B */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 16, background: "var(--surface-2)" }}>
          <div className="badge badge-accent" style={{ marginBottom: 6 }}>Version B (Proposed Fixes)</div>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>{reviewB.architectureTitle}</h4>
          <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>{reviewB.summary}</p>
        </div>

        <MermaidViewer chart={reviewB.mermaidDiagram} title="Version B Topology" />
      </div>
    </div>
  );
}
