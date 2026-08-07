/**
 * components/PipelineProgress.tsx
 * Multi-stage progress loader showing real-time pipeline status:
 * 1. Validating Image → 2. Extracting Diagram Topology → 3. Evaluating System Risks → 4. Reconstructing Mermaid Diagram
 */
"use client";

import React from "react";
import type { PipelineState } from "@/types/review";

interface PipelineProgressProps {
  state: PipelineState;
}

const STAGES = [
  { key: "uploading", label: "Validating Image Payload", icon: "📷" },
  { key: "extracting", label: "Gemini Vision Topology OCR", icon: "🔍" },
  { key: "analyzing", label: "Evaluating System Architecture Risks", icon: "📐" },
  { key: "generating", label: "Synthesizing Mermaid.js Diagram", icon: "📊" },
];

export default function PipelineProgress({ state }: PipelineProgressProps) {
  const currentIdx = STAGES.findIndex((s) => s.key === state.stage);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-card animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--accent)]/30 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-1)]">
              System Architecture AI Pipeline Active
            </h4>
            <p className="text-xs text-[var(--text-2)]">{state.message}</p>
          </div>
        </div>

        <span className="text-xs font-mono text-[var(--accent-hi)] bg-[var(--accent-dim)] px-2.5 py-1 rounded font-semibold">
          {state.progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hi)] transition-all duration-300 ease-out"
          style={{ width: `${state.progress}%` }}
        />
      </div>

      {/* Pipeline Stage Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {STAGES.map((s, idx) => {
          const isDone = currentIdx > idx || state.stage === "complete";
          const isCurrent = currentIdx === idx;

          return (
            <div
              key={s.key}
              className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                isDone
                  ? "border-[var(--emerald)]/40 bg-[var(--surface-2)] text-[var(--emerald)]"
                  : isCurrent
                  ? "border-[var(--accent)] bg-[var(--accent-dim)]/40 text-[var(--accent-hi)] shadow-glow"
                  : "border-[var(--border)] bg-[var(--surface-2)]/40 text-[var(--text-3)]"
              }`}
            >
              <span>{isDone ? "✓" : s.icon}</span>
              <span className="font-medium truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
