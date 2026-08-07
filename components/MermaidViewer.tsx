/**
 * components/MermaidViewer.tsx
 * Client-side dynamic Mermaid.js renderer with syntax sanitization, zoom/pan controls,
 * raw code toggling, copy button, and full-screen modal view.
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
        // Dynamic import of mermaid to prevent SSR window issues
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          darkMode: true,
          fontFamily: "var(--font-sans)",
          securityLevel: "loose",
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            padding: 15,
          },
        });

        const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, sanitizedChart);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: unknown) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Failed to render diagram syntax.";
          setRenderError(msg);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [sanitizedChart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sanitizedChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-card">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-1)]">
            📊 {title}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--accent-dim)] text-[var(--accent-hi)] font-mono">
            Mermaid.js
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="px-2 py-1 hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] rounded transition-colors"
              title="Zoom out"
            >
              -
            </button>
            <span className="px-2 font-mono text-[var(--text-3)] text-[11px]">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 15))}
              className="px-2 py-1 hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] rounded transition-colors"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoom(100)}
              className="px-2 py-1 hover:bg-[var(--surface-2)] text-[var(--text-3)] hover:text-[var(--text-1)] rounded font-mono text-[10px]"
              title="Reset zoom"
            >
              100%
            </button>
          </div>

          {/* Code toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
              showCode
                ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent-hi)]"
                : "border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)]"
            }`}
          >
            {showCode ? "Hide Code" : "</> Code"}
          </button>

          {/* Copy code */}
          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-xs text-[var(--text-2)] hover:text-[var(--accent-hi)] transition-colors"
            title="Copy Mermaid code"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>

          {/* Fullscreen Modal trigger */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-xs text-[var(--text-2)] hover:text-[var(--accent-hi)] transition-colors"
            title="Expand to Fullscreen"
          >
            ⛶ Expand
          </button>
        </div>
      </div>

      {/* Raw Code View */}
      {showCode && (
        <div className="p-4 border-b border-[var(--border)] bg-black/60 font-mono text-xs text-[var(--accent-text)] overflow-x-auto">
          <pre>{sanitizedChart}</pre>
        </div>
      )}

      {/* Render Canvas */}
      <div className="p-6 overflow-auto min-h-[300px] flex items-center justify-center bg-[var(--bg)]/40 relative">
        {renderError ? (
          <div className="text-center p-8 max-w-md space-y-2">
            <p className="text-sm font-semibold text-[var(--warning)]">
              ⚠️ Diagram Syntax Warning
            </p>
            <p className="text-xs text-[var(--text-2)] font-mono bg-[var(--surface-2)] p-3 rounded-lg border border-[var(--border)] text-left overflow-x-auto">
              {sanitizedChart}
            </p>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            className="mermaid-container transition-transform duration-200 ease-out origin-center"
            style={{ transform: `scale(${zoom / 100})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
            <div className="w-3.5 h-3.5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            Rendering Mermaid diagram...
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-6 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
            <h4 className="text-base font-bold text-[var(--text-1)]">{title}</h4>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border-hi)] text-xs text-[var(--text-1)] transition-colors"
            >
              ✕ Close (Esc)
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            <div
              className="mermaid-container"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
