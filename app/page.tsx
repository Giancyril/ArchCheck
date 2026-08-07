/**
 * app/page.tsx — Main Dashboard
 * Orchestrates: Header → Dropzone → Pipeline Progress → Feedback Cards + Mermaid Viewer
 */
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Dropzone from "@/components/Dropzone";
import PipelineProgress from "@/components/PipelineProgress";
import FeedbackCards from "@/components/FeedbackCards";
import MermaidViewer from "@/components/MermaidViewer";
import type { ReviewResponse, PipelineState } from "@/types/review";
import { SAMPLE_DIAGRAM_BASE64 } from "@/lib/sample-diagram";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [pipeline, setPipeline] = useState<PipelineState>({
    stage: "idle",
    message: "",
    progress: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (imgOverride?: string) => {
    const targetImg = imgOverride || selectedImage;
    if (!targetImg) return;

    setError(null);
    setReview(null);

    // Simulate step-by-step pipeline progress for smooth UX
    setPipeline({
      stage: "uploading",
      message: "1/4 Validating image payload and format...",
      progress: 20,
    });

    try {
      setTimeout(() => {
        setPipeline({
          stage: "extracting",
          message: "2/4 Running Gemini 2.5 Flash Vision diagram topology OCR...",
          progress: 45,
        });
      }, 400);

      setTimeout(() => {
        setPipeline({
          stage: "analyzing",
          message: "3/4 Evaluating Scalability, Reliability, Bottlenecks & Trade-offs...",
          progress: 70,
        });
      }, 800);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: targetImg }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze system architecture.");
      }

      setPipeline({
        stage: "generating",
        message: "4/4 Synthesizing Mermaid.js diagram and formatting feedback...",
        progress: 90,
      });

      setTimeout(() => {
        setPipeline({
          stage: "complete",
          message: "Analysis complete!",
          progress: 100,
        });
        setReview(json.data);
      }, 300);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setPipeline({ stage: "error", message: msg, progress: 0 });
    }
  };

  const handleLoadSample = () => {
    setSelectedImage(SAMPLE_DIAGRAM_BASE64);
    handleAnalyze(SAMPLE_DIAGRAM_BASE64);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setReview(null);
    setError(null);
    setPipeline({ stage: "idle", message: "", progress: 0 });
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      {/* Navbar */}
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        hasReview={!!review}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Intro Hero (Shown when no review) */}
        {!review && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[var(--text-1)] tracking-tight sm:text-3xl">
              AI System Architecture Reviewer
            </h2>
            <p className="text-sm text-[var(--text-2)] max-w-xl mx-auto">
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
              disabled={
                pipeline.stage !== "idle" &&
                pipeline.stage !== "complete" &&
                pipeline.stage !== "error"
              }
            />

            {selectedImage && pipeline.stage === "idle" && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleAnalyze()}
                  className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg)] font-semibold text-sm shadow-glow transition-all duration-200 flex items-center gap-2"
                >
                  <span>⚡ Analyze Architecture</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pipeline Progress Indicator */}
        {pipeline.stage !== "idle" &&
          pipeline.stage !== "complete" &&
          pipeline.stage !== "error" && <PipelineProgress state={pipeline} />}

        {/* Error Display */}
        {error && (
          <div className="rounded-xl border border-[var(--critical)]/40 bg-[var(--critical-bg)] p-4 text-sm text-[var(--critical)] flex items-center gap-3 animate-fade-in">
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

        {/* Review Results Dashboard */}
        {review && (
          <div className="space-y-8 animate-fade-in">
            {/* Title & Overview Card */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-1)]">
                    {review.architectureTitle}
                  </h3>
                  <p className="text-xs text-[var(--text-2)] mt-1 max-w-3xl leading-relaxed">
                    {review.summary}
                  </p>
                </div>

                {/* Confidence Badge */}
                <div className="flex items-center gap-2 border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 rounded-lg text-xs font-mono">
                  <span className="text-[var(--text-2)]">Vision Score:</span>
                  <span className="text-[var(--accent-hi)] font-bold">
                    {review.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Ambiguities Note (if present) */}
              {review.ambiguities && review.ambiguities.length > 0 && (
                <div className="rounded-lg bg-[var(--warning-bg)] border border-[var(--warning)]/30 p-3 text-xs text-[var(--warning)] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Ambiguous Diagram Elements:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[var(--text-2)] pl-1">
                    {review.ambiguities.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Mermaid.js Interactive Diagram Renderer */}
            <MermaidViewer
              chart={review.mermaidDiagram}
              title={`Reconstructed: ${review.architectureTitle}`}
            />

            {/* Category-Grouped AI Feedback Cards */}
            <FeedbackCards categories={review.categories} />
          </div>
        )}
      </div>
    </main>
  );
}
