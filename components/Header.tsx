/**
 * components/Header.tsx
 * App header with brand logo, title, sample diagram loader, and Gemini status.
 */
"use client";

import React from "react";

interface HeaderProps {
  onLoadSample?: () => void;
  onReset?: () => void;
  hasReview?: boolean;
}

export default function Header({ onLoadSample, onReset, hasReview }: HeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center text-base font-bold shadow-glow">
          📐
        </div>
        <div>
          <h1 className="font-semibold text-sm leading-tight text-[var(--text-1)] flex items-center gap-2">
            <span>AI System Design Reviewer</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)] font-mono">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-[var(--text-2)]">
            Instant System Architecture Evaluation & Mermaid.js Synthesis
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onLoadSample && !hasReview && (
          <button
            onClick={onLoadSample}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-2)] hover:text-[var(--accent-hi)] transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <span>💡 Try Sample Diagram</span>
          </button>
        )}

        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)] font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--emerald)] animate-pulse" />
          Gemini 2.5 Flash
        </span>

        {hasReview && onReset && (
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg)] font-semibold shadow-glow transition-colors"
          >
            + New Analysis
          </button>
        )}
      </div>
    </header>
  );
}
