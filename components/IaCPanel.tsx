/**
 * components/IaCPanel.tsx
 * Infrastructure-as-Code panel with provider toggle, IaCViewer, and deployment notes.
 */
"use client";

import React, { useState } from "react";
import type { ReviewResponse } from "@/types/review";
import { generateIaC } from "@/lib/iac-generator";
import { downloadFile } from "@/lib/export-serializer";
import IaCViewer from "@/components/IaCViewer";

interface IaCPanelProps {
  review: ReviewResponse;
}

const PROVIDERS = [
  { key: "aws" as const, label: "AWS", icon: "☁️" },
  { key: "gcp" as const, label: "GCP", icon: "🌐" },
  { key: "azure" as const, label: "Azure", icon: "🔷" },
];

export default function IaCPanel({ review }: IaCPanelProps) {
  const [provider, setProvider] = useState<"aws" | "gcp" | "azure">("aws");

  const iac = generateIaC(review, provider);

  const handleDownloadAll = () => {
    iac.files.forEach((f) => {
      const mimeMap: Record<string, string> = {
        hcl: "text/plain",
        yaml: "text/yaml",
        json: "application/json",
      };
      downloadFile(f.content, f.filename, mimeMap[f.language] ?? "text/plain");
    });
  };

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
            🏗️ Infrastructure-as-Code Generator
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>
            Ready-to-deploy Terraform, Docker Compose &amp; CloudFormation scripts for your architecture.
          </p>
        </div>

        <button onClick={handleDownloadAll} className="btn-primary" style={{ fontSize: 13, padding: "8px 18px" }}>
          ⬇ Download All Files
        </button>
      </div>

      {/* Provider Toggle */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600, marginRight: 4 }}>Target Provider:</span>
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            onClick={() => setProvider(p.key)}
            style={{
              padding: "6px 16px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${provider === p.key ? "var(--accent)" : "var(--border)"}`,
              background: provider === p.key ? "var(--accent-dim)" : "var(--surface-2)",
              color: provider === p.key ? "var(--accent-hi)" : "var(--text-2)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* IaC Viewer */}
      <IaCViewer files={iac.files} />

      {/* Deployment Notes */}
      <div
        style={{
          padding: 14,
          borderRadius: "var(--radius-md)",
          background: "var(--info-bg)",
          border: "1px solid rgba(59,130,246,0.25)",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--info)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
          <span>📋</span> Deployment Notes
        </div>
        <ul style={{ listStyle: "disc", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {iac.deploymentNotes.map((note, idx) => (
            <li key={idx} style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
