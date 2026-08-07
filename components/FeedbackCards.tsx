/**
 * components/FeedbackCards.tsx
 * Structured AI Architecture Review feedback grouped by category with severity badges.
 */
"use client";

import React, { useState } from "react";
import type { ReviewCategories, Severity, FeedbackItem, TradeoffItem } from "@/types/review";

interface FeedbackCardsProps {
  categories: ReviewCategories;
}

export default function FeedbackCards({ categories }: FeedbackCardsProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "scalability" | "reliability" | "bottlenecks" | "tradeoffs"
  >("all");

  const totalCritical =
    categories.scalability.filter((i) => i.severity === "critical").length +
    categories.reliability.filter((i) => i.severity === "critical").length +
    categories.bottlenecks.filter((i) => i.severity === "critical").length;

  const totalWarning =
    categories.scalability.filter((i) => i.severity === "warning").length +
    categories.reliability.filter((i) => i.severity === "warning").length +
    categories.bottlenecks.filter((i) => i.severity === "warning").length;

  const totalInfo =
    categories.scalability.filter((i) => i.severity === "info").length +
    categories.reliability.filter((i) => i.severity === "info").length +
    categories.bottlenecks.filter((i) => i.severity === "info").length +
    categories.designTradeoffs.length;

  const totalFindings =
    categories.scalability.length +
    categories.reliability.length +
    categories.bottlenecks.length +
    categories.designTradeoffs.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <MetricCard label="Critical Risks" count={totalCritical} badgeClass="badge-critical" subtext="Requires Fix" />
        <MetricCard label="Warnings" count={totalWarning} badgeClass="badge-warning" subtext="Potential Issues" />
        <MetricCard label="Trade-offs / Info" count={totalInfo} badgeClass="badge-info" subtext="Design Notes" />
        <MetricCard label="Total Findings" count={totalFindings} badgeClass="badge-accent" subtext="Evaluated" />
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", overflowX: "auto", paddingBottom: 2 }}>
        {[
          { key: "all", label: `All Findings (${totalFindings})` },
          { key: "scalability", label: `🚀 Scalability (${categories.scalability.length})` },
          { key: "reliability", label: `🛡️ Reliability (${categories.reliability.length})` },
          { key: "bottlenecks", label: `⏳ Bottlenecks (${categories.bottlenecks.length})` },
          { key: "tradeoffs", label: `⚖️ Trade-offs (${categories.designTradeoffs.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={{
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: "8px 8px 0 0",
                background: isActive ? "var(--surface)" : "transparent",
                color: isActive ? "var(--accent-hi)" : "var(--text-2)",
                border: "none",
                borderBottom: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Findings List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {(activeTab === "all" || activeTab === "scalability") && categories.scalability.length > 0 && (
          <SectionBlock title="Scalability Analysis" icon="🚀" items={categories.scalability} />
        )}
        {(activeTab === "all" || activeTab === "reliability") && categories.reliability.length > 0 && (
          <SectionBlock title="Reliability & Redundancy" icon="🛡️" items={categories.reliability} />
        )}
        {(activeTab === "all" || activeTab === "bottlenecks") && categories.bottlenecks.length > 0 && (
          <SectionBlock title="Performance Bottlenecks" icon="⏳" items={categories.bottlenecks} />
        )}
        {(activeTab === "all" || activeTab === "tradeoffs") && categories.designTradeoffs.length > 0 && (
          <TradeoffSectionBlock items={categories.designTradeoffs} />
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, count, badgeClass, subtext }: { label: string; count: number; badgeClass: string; subtext: string }) {
  return (
    <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div className={`badge ${badgeClass}`} style={{ width: 36, height: 36, borderRadius: 8, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {count}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-1)", marginTop: 1 }}>{subtext}</div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const badgeMap: Record<Severity, string> = {
    critical: "badge-critical",
    warning: "badge-warning",
    info: "badge-info",
  };
  return <span className={`badge ${badgeMap[severity]}`}>{severity}</span>;
}

function SectionBlock({ title, icon, items }: { title: string; icon: string; items: FeedbackItem[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="section-label">
        <span>{icon}</span>
        <span>{title}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} className={`finding-card finding-card-${item.severity}`}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{item.title}</h5>
              <SeverityBadge severity={item.severity} />
            </div>

            <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 10 }}>{item.explanation}</p>

            {item.recommendation && (
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12, display: "flex", gap: 8 }}>
                <span style={{ color: "var(--emerald)", fontWeight: 700 }}>✓ Fix:</span>
                <span style={{ color: "var(--text-1)", flex: 1 }}>{item.recommendation}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TradeoffSectionBlock({ items }: { items: TradeoffItem[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="section-label">
        <span>⚖️</span>
        <span>Design Trade-offs &amp; Decisions</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} className="finding-card finding-card-info">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{item.title}</h5>
              <SeverityBadge severity={item.severity} />
            </div>

            <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 12 }}>{item.explanation}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid rgba(16,185,129,0.25)", fontSize: 12 }}>
                <span style={{ color: "var(--emerald)", fontWeight: 700, fontSize: 11, display: "block", marginBottom: 3 }}>
                  ▲ Upside / Benefit
                </span>
                <span style={{ color: "var(--text-1)" }}>{item.benefit}</span>
              </div>

              <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid rgba(244,63,94,0.25)", fontSize: 12 }}>
                <span style={{ color: "var(--critical)", fontWeight: 700, fontSize: 11, display: "block", marginBottom: 3 }}>
                  ▼ Downside / Cost
                </span>
                <span style={{ color: "var(--text-1)" }}>{item.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
