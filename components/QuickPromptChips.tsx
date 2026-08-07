/**
 * components/QuickPromptChips.tsx
 * Preset action chips for quick architectural questions.
 */
"use client";

import React from "react";

interface QuickPromptChipsProps {
  onSelectPrompt: (promptText: string) => void;
}

const PRESET_PROMPTS = [
  "💡 Suggest Caching Strategy",
  "🛡️ Add Multi-Region Redundancy",
  "⚡ Optimize Database Queries",
  "⏳ Evaluate Cold-Start Latency",
];

export default function QuickPromptChips({ onSelectPrompt }: QuickPromptChipsProps) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "4px 0" }}>
      {PRESET_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelectPrompt(prompt.replace(/^.\s*/, ""))}
          className="btn-ghost"
          style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99 }}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
