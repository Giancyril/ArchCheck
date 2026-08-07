/**
 * components/TrafficSlider.tsx
 * Interactive traffic scale slider (10k to 10M DAU) adjusting capacity and cloud cost calculations dynamically.
 */
"use client";

import React from "react";

interface TrafficSliderProps {
  dau: number;
  onChange: (newDau: number) => void;
}

export default function TrafficSlider({ dau, onChange }: TrafficSliderProps) {
  const formatDau = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M DAU`;
    return `${(num / 1000).toFixed(0)}k DAU`;
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>
          Simulated User Traffic Volume
        </span>
        <span
          className="badge badge-accent"
          style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6 }}
        >
          {formatDau(dau)}
        </span>
      </div>

      <input
        type="range"
        min={10000}
        max={5000000}
        step={10000}
        value={dau}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
        <span>10k DAU (Startup)</span>
        <span>500k DAU (Scaleup)</span>
        <span>5M DAU (Enterprise)</span>
      </div>
    </div>
  );
}
