/**
 * components/FeedbackCards.tsx
 * Renders structured AI Architecture Review feedback organized by category
 * (Scalability, Reliability, Bottlenecks, Design Trade-offs) with color-coded
 * severity badges, recommendations, and benefit/cost trade-off cards.
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

  return (
    <div className="space-y-6">
      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--critical-bg)] text-[var(--critical)] border border-[var(--critical)]/30 flex items-center justify-center font-bold text-sm">
            {totalCritical}
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-2)] font-medium">Critical Risks</div>
            <div className="text-xs font-semibold text-[var(--critical)]">Requires Fix</div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/30 flex items-center justify-center font-bold text-sm">
            {totalWarning}
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-2)] font-medium">Warnings</div>
            <div className="text-xs font-semibold text-[var(--warning)]">Potential Issues</div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info)]/30 flex items-center justify-center font-bold text-sm">
            {totalInfo}
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-2)] font-medium">Trade-offs / Info</div>
            <div className="text-xs font-semibold text-[var(--info)]">Design Notes</div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] text-[var(--accent-hi)] border border-[var(--accent)]/30 flex items-center justify-center font-bold text-sm">
            {categories.scalability.length +
              categories.reliability.length +
              categories.bottlenecks.length +
              categories.designTradeoffs.length}
          </div>
          <div>
            <div className="text-[11px] text-[var(--text-2)] font-medium">Total Findings</div>
            <div className="text-xs font-semibold text-[var(--accent-hi)] font-mono">Evaluated</div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex border-b border-[var(--border)] gap-1 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === "all"
              ? "border-[var(--accent)] text-[var(--accent-hi)] bg-[var(--surface)]"
              : "border-transparent text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          All Findings
        </button>

        <button
          onClick={() => setActiveTab("scalability")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === "scalability"
              ? "border-[var(--accent)] text-[var(--accent-hi)] bg-[var(--surface)]"
              : "border-transparent text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          🚀 Scalability ({categories.scalability.length})
        </button>

        <button
          onClick={() => setActiveTab("reliability")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === "reliability"
              ? "border-[var(--accent)] text-[var(--accent-hi)] bg-[var(--surface)]"
              : "border-transparent text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          🛡️ Reliability ({categories.reliability.length})
        </button>

        <button
          onClick={() => setActiveTab("bottlenecks")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === "bottlenecks"
              ? "border-[var(--accent)] text-[var(--accent-hi)] bg-[var(--surface)]"
              : "border-transparent text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          ⏳ Bottlenecks ({categories.bottlenecks.length})
        </button>

        <button
          onClick={() => setActiveTab("tradeoffs")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === "tradeoffs"
              ? "border-[var(--accent)] text-[var(--accent-hi)] bg-[var(--surface)]"
              : "border-transparent text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          ⚖️ Trade-offs ({categories.designTradeoffs.length})
        </button>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {/* Scalability Section */}
        {(activeTab === "all" || activeTab === "scalability") &&
          categories.scalability.length > 0 && (
            <SectionBlock
              title="Scalability Analysis"
              icon="🚀"
              items={categories.scalability}
            />
          )}

        {/* Reliability Section */}
        {(activeTab === "all" || activeTab === "reliability") &&
          categories.reliability.length > 0 && (
            <SectionBlock
              title="Reliability & Redundancy"
              icon="🛡️"
              items={categories.reliability}
            />
          )}

        {/* Bottlenecks Section */}
        {(activeTab === "all" || activeTab === "bottlenecks") &&
          categories.bottlenecks.length > 0 && (
            <SectionBlock
              title="Performance Bottlenecks"
              icon="⏳"
              items={categories.bottlenecks}
            />
          )}

        {/* Design Trade-offs Section */}
        {(activeTab === "all" || activeTab === "tradeoffs") &&
          categories.designTradeoffs.length > 0 && (
            <TradeoffSectionBlock items={categories.designTradeoffs} />
          )}
      </div>
    </div>
  );
}

// ── Sub-components for Findings Cards ─────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    critical: "bg-[var(--critical-bg)] text-[var(--critical)] border-[var(--critical)]/40",
    warning: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/40",
    info: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/40",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function SectionBlock({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: FeedbackItem[];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider flex items-center gap-1.5 px-1">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2.5 shadow-card hover:border-[var(--border-hi)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h5 className="text-sm font-bold text-[var(--text-1)]">{item.title}</h5>
              <SeverityBadge severity={item.severity} />
            </div>

            <p className="text-xs text-[var(--text-2)] leading-relaxed">{item.explanation}</p>

            {item.recommendation && (
              <div className="rounded-lg bg-[var(--surface-2)] p-2.5 border border-[var(--border)] flex items-start gap-2 text-xs">
                <span className="text-[var(--emerald)] font-bold">✓ Fix:</span>
                <span className="text-[var(--text-1)] flex-1">{item.recommendation}</span>
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
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider flex items-center gap-1.5 px-1">
        <span>⚖️</span>
        <span>Design Trade-offs & Decisions</span>
      </h4>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <h5 className="text-sm font-bold text-[var(--text-1)]">{item.title}</h5>
              <SeverityBadge severity={item.severity} />
            </div>

            <p className="text-xs text-[var(--text-2)] leading-relaxed">{item.explanation}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg bg-[var(--surface-2)] p-2.5 border border-[var(--emerald)]/30 text-xs space-y-1">
                <span className="text-[var(--emerald)] font-bold text-[11px] block">
                  ▲ Upside / Benefit
                </span>
                <span className="text-[var(--text-1)] block">{item.benefit}</span>
              </div>

              <div className="rounded-lg bg-[var(--surface-2)] p-2.5 border border-[var(--critical)]/30 text-xs space-y-1">
                <span className="text-[var(--critical)] font-bold text-[11px] block">
                  ▼ Downside / Cost
                </span>
                <span className="text-[var(--text-1)] block">{item.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
