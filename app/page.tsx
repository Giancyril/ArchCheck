/**
 * app/page.tsx — Main Dashboard
 * Stage 2: Drag & Drop upload UI + POST /api/analyze integration
 */
"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import type { ReviewResponse, PipelineState } from "@/types/review";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [pipeline, setPipeline] = useState<PipelineState>({
    stage: "idle",
    message: "",
    progress: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setError(null);
    setPipeline({
      stage: "uploading",
      message: "Sending diagram image to analysis pipeline...",
      progress: 25,
    });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze diagram.");
      }

      setPipeline({
        stage: "complete",
        message: "Analysis complete!",
        progress: 100,
      });
      setReview(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setPipeline({ stage: "error", message: msg, progress: 0 });
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setReview(null);
    setError(null);
    setPipeline({ stage: "idle", message: "", progress: 0 });
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center text-base font-bold shadow-glow">
            📐
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight text-[var(--text-1)]">
              AI System Design Reviewer
            </h1>
            <p className="text-[11px] text-[var(--text-2)]">
              Architecture Analysis & Mermaid Diagram Generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)] font-mono">
            Gemini 2.5 Flash
          </span>
          {review && (
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-2)] hover:text-[var(--accent-hi)] transition-colors"
            >
              + New Analysis
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Intro Hero */}
        {!review && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[var(--text-1)]">
              Review Architecture Diagrams in Seconds
            </h2>
            <p className="text-sm text-[var(--text-2)] max-w-lg mx-auto">
              Upload a digital diagram (draw.io, Lucidchart) or hand-drawn sketch to receive instant AI evaluation on scalability, reliability, bottlenecks, and design trade-offs.
            </p>
          </div>
        )}

        {/* Upload Dropzone */}
        {!review && (
          <div className="space-y-4">
            <Dropzone
              onImageSelected={(img) => setSelectedImage(img)}
              onClear={() => setSelectedImage(null)}
              disabled={pipeline.stage === "uploading"}
            />

            {selectedImage && pipeline.stage !== "uploading" && (
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg)] font-semibold text-sm shadow-glow transition-all duration-200 flex items-center gap-2"
                >
                  <span>⚡ Analyze Architecture</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pipeline Status Banner */}
        {pipeline.stage !== "idle" && pipeline.stage !== "complete" && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-[var(--text-1)]">
                {pipeline.message}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${pipeline.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-xl border border-[var(--critical)]/40 bg-[var(--critical-bg)] p-4 text-sm text-[var(--critical)] flex items-center gap-3">
            <span>🚨</span>
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Review Results Output (Stage 2 Placeholder) */}
        {review && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[var(--text-1)]">
                  {review.architectureTitle}
                </h3>
                <span className="text-xs px-2.5 py-1 rounded bg-[var(--accent-dim)] text-[var(--accent-hi)] font-mono font-semibold">
                  Stage 2 API Verified ✓
                </span>
              </div>
              <p className="text-sm text-[var(--text-2)]">{review.summary}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
