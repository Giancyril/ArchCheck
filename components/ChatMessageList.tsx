/**
 * components/ChatMessageList.tsx
 * Renders chat message history thread with user/assistant bubbles and apply fix buttons.
 */
"use client";

import React from "react";
import type { CopilotMessage } from "@/types/copilot";

interface ChatMessageListProps {
  messages: CopilotMessage[];
  onApplyFix?: (mermaidFix: string) => void;
}

export default function ChatMessageList({ messages, onApplyFix }: ChatMessageListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", paddingRight: 4 }}>
      {messages.map((m) => {
        const isUser = m.role === "user";

        return (
          <div
            key={m.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isUser ? "flex-end" : "flex-start",
              gap: 4,
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                background: isUser ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-low) 100%)" : "var(--surface-2)",
                border: isUser ? "none" : "1px solid var(--border)",
                color: "var(--text-1)",
                fontSize: 13,
                lineHeight: 1.5,
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              {m.content}

              {/* Suggested Mermaid Fix Button */}
              {m.suggestedMermaidFix && onApplyFix && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <button
                    onClick={() => onApplyFix(m.suggestedMermaidFix!)}
                    className="btn-primary"
                    style={{ fontSize: 11, padding: "5px 12px" }}
                  >
                    ✨ Apply Fix to Mermaid Diagram
                  </button>
                </div>
              )}
            </div>

            <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)", padding: "0 4px" }}>
              {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
