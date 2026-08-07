/**
 * components/ExportModal.tsx
 * Modal interface for downloading architecture reports in Markdown, JSON, Mermaid code, or copying share URL.
 */
"use client";

import React, { useState } from "react";
import type { ReviewResponse } from "@/types/review";
import { generateMarkdownReport, downloadFile } from "@/lib/export-serializer";
import { encodeReviewToHash } from "@/lib/share-url";

interface ExportModalProps {
  review: ReviewResponse;
  onClose: () => void;
}

export default function ExportModal({ review, onClose }: ExportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(review);
    const filename = `${review.architectureTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-review.md`;
    downloadFile(md, filename, "text/markdown");
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(review, null, 2);
    const filename = `${review.architectureTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-review.json`;
    downloadFile(jsonStr, filename, "application/json");
  };

  const handleDownloadMermaid = () => {
    const filename = `${review.architectureTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-diagram.mmd`;
    downloadFile(review.mermaidDiagram, filename, "text/plain");
  };

  const handleCopyShareLink = () => {
    const hash = encodeReviewToHash(review);
    const fullUrl = `${window.location.origin}${window.location.pathname}${hash}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(9,9,11,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="card animate-slide-up"
        style={{ width: "100%", maxWidth: 480, padding: 24, background: "var(--surface)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>
            Export Architecture Review
          </h3>
          <button onClick={onClose} className="btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}>
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Markdown Download */}
          <div
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Markdown Report (.md)</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Full evaluation summary + findings</div>
            </div>
            <button onClick={handleDownloadMarkdown} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>
              Download
            </button>
          </div>

          {/* JSON Download */}
          <div
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>JSON Payload (.json)</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Raw structured review data</div>
            </div>
            <button onClick={handleDownloadJSON} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>
              Download
            </button>
          </div>

          {/* Mermaid Download */}
          <div
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Mermaid Code (.mmd)</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Canonical flowchart definition</div>
            </div>
            <button onClick={handleDownloadMermaid} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>
              Download
            </button>
          </div>

          {/* Share Link */}
          <div
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-dim)",
              border: "1px solid rgba(6,182,212,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-hi)" }}>Shareable URL Link</div>
              <div style={{ fontSize: 11, color: "var(--text-2)" }}>Encoded review payload link</div>
            </div>
            <button onClick={handleCopyShareLink} className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>
              {copiedLink ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
