/**
 * components/CategoryDiffTable.tsx
 * Highlights added, removed, and modified structural components between Architecture A and B.
 */
"use client";

import React from "react";
import type { ArchitectureDiffResult } from "@/types/diff";

interface CategoryDiffTableProps {
  diff: ArchitectureDiffResult;
}

export default function CategoryDiffTable({ diff }: CategoryDiffTableProps) {
  const getChangeBadge = (type: string) => {
    switch (type) {
      case "added": return <span className="badge badge-accent">+ Added</span>;
      case "removed": return <span className="badge badge-critical">- Removed</span>;
      case "modified": return <span className="badge badge-warning">~ Modified</span>;
      default: return <span className="badge badge-info">Unchanged</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="section-label">
        <span>🔄</span>
        <span>Component Delta &amp; Structural Shift</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {diff.componentDeltas.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{item.details}</div>
            </div>

            {getChangeBadge(item.changeType)}
          </div>
        ))}
      </div>
    </div>
  );
}
