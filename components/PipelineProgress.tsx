/**
 * components/PipelineProgress.tsx
 * Multi-stage progress loader showing real-time pipeline status.
 */
"use client";

import React from "react";
import type { PipelineState } from "@/types/review";

interface PipelineProgressProps {
  state: PipelineState;
}

const STAGES = [
  { key: "uploading", label: "Validating Image", icon: "📷" },
  { key: "extracting", label: "Gemini Vision OCR", icon: "🔍" },
  { key: "analyzing", label: "Evaluating Risks", icon: "📐" },
  { key: "generating", label: "Synthesizing Mermaid", icon: "📊" },
];

export default function PipelineProgress({ state }: PipelineProgressProps) {
  const currentIdx = STAGES.findIndex((s) => s.key === state.stage);

  return (
    <div className="card animate-fade-in" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--accent-dim)",
              border: "1px solid rgba(6,182,212,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div className="spinner" />
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>
              System Architecture AI Pipeline Active
            </h4>
            <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{state.message}</p>
          </div>
        </div>

        <span
          className="badge badge-accent"
          style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6 }}
        >
          {state.progress}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="progress-track" style={{ marginBottom: 16 }}>
        <div className="progress-fill" style={{ width: `${state.progress}%` }} />
      </div>

      {/* Stage Chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
        {STAGES.map((s, idx) => {
          const isDone = currentIdx > idx || state.stage === "complete";
          const isCurrent = currentIdx === idx;

          return (
            <div
              key={s.key}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: isDone ? "var(--emerald-bg)" : isCurrent ? "var(--accent-dim)" : "var(--surface-2)",
                border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : isCurrent ? "var(--accent)" : "var(--border)"}`,
                color: isDone ? "var(--emerald)" : isCurrent ? "var(--accent-hi)" : "var(--text-3)",
                fontWeight: isCurrent || isDone ? 600 : 400,
                boxShadow: isCurrent ? "var(--shadow-glow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>{isDone ? "✓" : s.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
