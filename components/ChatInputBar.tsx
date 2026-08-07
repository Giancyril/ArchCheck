/**
 * components/ChatInputBar.tsx
 * Input bar for submitting architectural questions to the AI Copilot.
 */
"use client";

import React, { useState } from "react";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInputBar({ onSend, disabled = false }: ChatInputBarProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input
        type="text"
        placeholder="Ask ArchCheck Copilot..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-1)",
          fontSize: 13,
          outline: "none",
        }}
      />

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="btn-primary"
        style={{ padding: "10px 16px", fontSize: 13 }}
      >
        Send
      </button>
    </form>
  );
}
