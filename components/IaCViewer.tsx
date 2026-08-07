/**
 * components/IaCViewer.tsx
 * Tabbed code viewer for Terraform, Docker Compose, and CloudFormation IaC files
 * with syntax highlighting, copy, and individual file download.
 */
"use client";

import React, { useState } from "react";
import type { IaCFile } from "@/types/iac";
import { downloadFile } from "@/lib/export-serializer";

interface IaCViewerProps {
  files: IaCFile[];
}

export default function IaCViewer({ files }: IaCViewerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = files[activeIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const mimeMap: Record<string, string> = {
      hcl: "text/plain",
      yaml: "text/yaml",
      json: "application/json",
    };
    downloadFile(active.content, active.filename, mimeMap[active.language] ?? "text/plain");
  };

  const languageBadge = (lang: string) => {
    const map: Record<string, string> = { hcl: "Terraform HCL", yaml: "YAML", json: "JSON" };
    return map[lang] ?? lang.toUpperCase();
  };

  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
          padding: "6px 6px 0",
          overflowX: "auto",
        }}
      >
        {files.map((f, idx) => (
          <button
            key={f.filename}
            onClick={() => setActiveIdx(idx)}
            style={{
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              borderRadius: "6px 6px 0 0",
              background: idx === activeIdx ? "#050508" : "transparent",
              color: idx === activeIdx ? "var(--accent-hi)" : "var(--text-3)",
              border: "none",
              borderBottom: idx === activeIdx ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {f.filename}
          </button>
        ))}

        {/* Actions right-aligned */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", padding: "0 4px 4px" }}>
          <button onClick={handleCopy} className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button onClick={handleDownload} className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}>
            ⬇ Download
          </button>
        </div>
      </div>

      {/* File description bar */}
      <div
        style={{
          padding: "8px 16px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span className="badge badge-accent" style={{ fontSize: 10 }}>{languageBadge(active.language)}</span>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>{active.description}</span>
      </div>

      {/* Code block */}
      <div
        style={{
          background: "#050508",
          padding: "20px 20px",
          overflowX: "auto",
          maxHeight: 460,
          overflowY: "auto",
        }}
      >
        <pre
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            lineHeight: 1.7,
            color: "#e2e8f0",
            margin: 0,
            whiteSpace: "pre",
          }}
        >
          {active.content}
        </pre>
      </div>
    </div>
  );
}
