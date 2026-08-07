/**
 * components/MermaidViewer.tsx
 * Dynamic Mermaid.js renderer with zoom controls, code view, and modal support.
 */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { sanitizeMermaid } from "@/lib/mermaid-sanitizer";

interface MermaidViewerProps {
  chart: string;
  title?: string;
}

export default function MermaidViewer({
  chart,
  title = "Reconstructed Architecture Diagram",
}: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const sanitizedChart = sanitizeMermaid(chart);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!sanitizedChart) return;
      setRenderError(null);

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          darkMode: true,
          fontFamily: "var(--font-sans)",
          securityLevel: "loose",
          flowchart: { htmlLabels: true, curve: "basis", padding: 15 },
        });

        const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, sanitizedChart);

        if (isMounted) setSvgContent(svg);
      } catch (err: unknown) {
        console.error("Mermaid error:", err);
        if (isMounted) {
          setRenderError(err instanceof Error ? err.message : "Failed to render diagram.");
        }
      }
    }

    renderChart();
    return () => { isMounted = false; };
  }, [sanitizedChart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sanitizedChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Header bar */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>
            📊 {title}
          </span>
          <span className="badge badge-accent">Mermaid.js</span>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Zoom controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              padding: 2,
              fontSize: 12,
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="btn-ghost"
              style={{ padding: "2px 8px", border: "none" }}
              title="Zoom out"
            >
              -
            </button>
            <span style={{ padding: "0 6px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 15))}
              className="btn-ghost"
              style={{ padding: "2px 8px", border: "none" }}
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoom(100)}
              className="btn-ghost"
              style={{ padding: "2px 6px", border: "none", fontSize: 10, fontFamily: "var(--font-mono)" }}
              title="Reset zoom"
            >
              100%
            </button>
          </div>

          <button
            onClick={() => setShowCode(!showCode)}
            className="btn-ghost"
            style={{
              padding: "4px 10px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              background: showCode ? "var(--accent-dim)" : "transparent",
              color: showCode ? "var(--accent-hi)" : "var(--text-2)",
              borderColor: showCode ? "var(--accent)" : "var(--border)",
            }}
          >
            {showCode ? "Hide Code" : "</> Code"}
          </button>

          <button
            onClick={handleCopyCode}
            className="btn-ghost"
            style={{ padding: "4px 10px", fontSize: 12 }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="btn-ghost"
            style={{ padding: "4px 10px", fontSize: 12 }}
          >
            ⛶ Expand
          </button>
        </div>
      </div>

      {/* Raw Code */}
      {showCode && (
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid var(--border)",
            background: "#050508",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--accent-hi)",
            overflowX: "auto",
          }}
        >
          <pre>{sanitizedChart}</pre>
        </div>
      )}

      {/* Render Canvas */}
      <div
        style={{
          padding: 24,
          overflow: "auto",
          minHeight: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        {renderError ? (
          <div style={{ textAlign: "center", padding: 32, maxWidth: 440 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)", marginBottom: 8 }}>
              ⚠️ Diagram Syntax Warning
            </p>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-2)",
                fontFamily: "var(--font-mono)",
                background: "var(--surface-2)",
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--border)",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {sanitizedChart}
            </p>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            className="mermaid-container"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", transition: "transform 0.2s ease" }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-3)" }}>
            <div className="spinner" />
            Rendering Mermaid diagram...
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="animate-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(9,9,11,0.95)",
            backdropFilter: "blur(12px)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>{title}</h4>
            <button
              onClick={() => setIsFullscreen(false)}
              className="btn-ghost"
              style={{ padding: "6px 14px", fontSize: 12 }}
            >
              ✕ Close (Esc)
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div className="mermaid-container" dangerouslySetInnerHTML={{ __html: svgContent }} />
          </div>
        </div>
      )}
    </div>
  );
}
