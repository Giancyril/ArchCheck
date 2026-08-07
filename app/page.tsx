"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Dropzone from "@/components/Dropzone";
import PipelineProgress from "@/components/PipelineProgress";
import FeedbackCards from "@/components/FeedbackCards";
import MermaidViewer from "@/components/MermaidViewer";
import ExportModal from "@/components/ExportModal";
import CostEstimator from "@/components/CostEstimator";
import SecurityAuditPanel from "@/components/SecurityAuditPanel";
import CompareModal from "@/components/CompareModal";
import IaCPanel from "@/components/IaCPanel";
import ChaosSimulatorPanel from "@/components/ChaosSimulatorPanel";
import type { ReviewResponse, PipelineState } from "@/types/review";
import { SAMPLE_DIAGRAM_BASE64 } from "@/lib/sample-diagram";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [pipeline, setPipeline] = useState<PipelineState>({
    stage: "idle", message: "", progress: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (imgOverride?: string) => {
    const targetImg = imgOverride || selectedImage;
    if (!targetImg) return;

    setError(null);
    setReview(null);
    setPipeline({ stage: "uploading", message: "1/4 Validating image payload and format...", progress: 20 });

    try {
      setTimeout(() => setPipeline({ stage: "extracting", message: "2/4 Gemini Vision topology OCR running...", progress: 45 }), 400);
      setTimeout(() => setPipeline({ stage: "analyzing", message: "3/4 Evaluating Scalability, Reliability, Bottlenecks & Trade-offs...", progress: 70 }), 800);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: targetImg }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to analyze architecture.");

      setPipeline({ stage: "generating", message: "4/4 Synthesizing Mermaid.js diagram...", progress: 90 });
      setTimeout(() => {
        setPipeline({ stage: "complete", message: "Analysis complete!", progress: 100 });
        setReview(json.data);
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
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

  const isAnalyzing = pipeline.stage !== "idle" && pipeline.stage !== "complete" && pipeline.stage !== "error";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onExport={() => setShowExportModal(true)}
        onCompare={() => setShowCompareModal(true)}
        hasReview={!!review}
      />

      {showExportModal && review && (
        <ExportModal review={review} onClose={() => setShowExportModal(false)} />
      )}

      {showCompareModal && review && (
        <CompareModal reviewA={review} onClose={() => setShowCompareModal(false)} />
      )}

      <main style={{ flex: 1, maxWidth: 900, width: "100%", margin: "0 auto", padding: "48px 24px 64px" }}>

        {/* ── Hero section ── */}
        {!review && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>


            <h2
              className="text-gradient"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 14 }}
            >
              AI System Architecture Reviewer
            </h2>

            <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
              Upload any architecture diagram digital export or hand-drawn sketch and receive instant AI evaluation on scalability, reliability, bottlenecks, and design trade-offs.
            </p>

            {/* Feature pills */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
              {[
                { label: "Scalability" },
                { label: "Reliability" },
                { label: "Bottlenecks" },
                { label: "Trade-offs" },
                { label: "Mermaid.js" },
              ].map(({ label }) => (
                <span
                  key={label}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 99,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    color: "var(--text-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Upload section ── */}
        {!review && (
          <div style={{ marginBottom: 24 }}>
            <Dropzone
              onImageSelected={(img) => setSelectedImage(img)}
              onClear={() => setSelectedImage(null)}
              disabled={isAnalyzing}
            />

            {selectedImage && !isAnalyzing && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button className="btn-primary" onClick={() => handleAnalyze()}>
                  <span>⚡</span>
                  <span>Analyze Architecture</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Pipeline progress ── */}
        {isAnalyzing && (
          <div style={{ marginBottom: 24 }}>
            <PipelineProgress state={pipeline} />
          </div>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "var(--critical-bg)",
              border: "1px solid rgba(244,63,94,0.3)",
              fontSize: 13,
              color: "var(--critical)",
              marginBottom: 24,
            }}
          >
            <span>🚨</span>
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{ fontSize: 11, color: "var(--critical)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Review results ── */}
        {review && (
          <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Overview card */}
            <div className="card" style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
                    {review.architectureTitle}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65, maxWidth: 680 }}>
                    {review.summary}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    padding: "10px 16px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-hi)", fontFamily: "var(--font-mono)" }}>
                    {review.confidenceScore}%
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Vision Score
                  </span>
                </div>
              </div>

              {/* Ambiguities */}
              {review.ambiguities && review.ambiguities.length > 0 && (
                <div
                  style={{
                    borderRadius: "var(--radius-sm)",
                    background: "var(--warning-bg)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    padding: "10px 14px",
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--warning)", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
                    <span>⚠️</span> Ambiguous Diagram Elements
                  </p>
                  <ul style={{ listStyle: "disc", paddingLeft: 18 }}>
                    {review.ambiguities.map((n, i) => (
                      <li key={i} style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{n}</li>
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

            {/* Cloud Infrastructure Cost Estimator */}
            <CostEstimator review={review} />

            {/* Security Threat Modeling & Compliance Audit */}
            <SecurityAuditPanel review={review} />

            {/* Infrastructure-as-Code Generator */}
            <IaCPanel review={review} />

            {/* Disaster Recovery (DR) & Chaos Simulator */}
            <ChaosSimulatorPanel review={review} />

            {/* Category-Grouped AI Feedback Cards */}
            <FeedbackCards categories={review.categories} />
          </div>
        )}
      </main>
    </div>
  );
}
