"use client";

import React from "react";

interface HeaderProps {
  onLoadSample?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  onCompare?: () => void;
  hasReview?: boolean;
}

export default function Header({ onLoadSample, onReset, onExport, onCompare, hasReview }: HeaderProps) {
  return (
    <header className="app-header">
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="app-logo">📐</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-1)", lineHeight: 1 }} className="tracking-widest">
              ArchCheck
            </span>


          </div>
          <p style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>
            AI System Design Reviewer
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {onLoadSample && !hasReview && (
          <button
            onClick={onLoadSample}
            className="btn-ghost"
            style={{ fontSize: "12px", padding: "6px 12px" }}
          >
            <span>Try Sample</span>
          </button>
        )}



        {hasReview && onCompare && (
          <button onClick={onCompare} className="btn-ghost" style={{ padding: "7px 14px", fontSize: "13px" }}>
            🔀 Compare
          </button>
        )}

        {hasReview && onExport && (
          <button onClick={onExport} className="btn-ghost" style={{ padding: "7px 14px", fontSize: "13px" }}>
            📥 Export
          </button>
        )}

        {hasReview && onReset && (
          <button onClick={onReset} className="btn-primary" style={{ padding: "7px 16px", fontSize: "13px" }}>
            + New Analysis
          </button>
        )}
      </div>
    </header>
  );
}
