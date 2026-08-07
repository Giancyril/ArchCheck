/**
 * components/ArchCopilotDrawer.tsx
 * Floating AI Copilot drawer component for live diagram Q&A and real-time Mermaid refactoring.
 */
"use client";

import React, { useState } from "react";
import type { ReviewResponse } from "@/types/review";
import type { CopilotMessage } from "@/types/copilot";
import ChatMessageList from "@/components/ChatMessageList";
import QuickPromptChips from "@/components/QuickPromptChips";
import ChatInputBar from "@/components/ChatInputBar";

interface ArchCopilotDrawerProps {
  review: ReviewResponse;
  onClose: () => void;
  onApplyMermaidFix: (newMermaid: string) => void;
}

export default function ArchCopilotDrawer({
  review,
  onClose,
  onApplyMermaidFix,
}: ArchCopilotDrawerProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: `Hello! I am your **ArchCheck Copilot**. Ask me any question about scaling, security, or refactoring **${review.architectureTitle}**.`,
      timestamp: Date.now(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async (userPrompt: string) => {
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userPrompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          architectureTitle: review.architectureTitle,
          summary: review.summary,
          currentMermaid: review.mermaidDiagram,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Copilot failed.");

      const aiMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: json.data.content,
        timestamp: Date.now(),
        suggestedMermaidFix: json.data.suggestedMermaidFix,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error contacting Copilot.";
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        maxWidth: 420,
        zIndex: 9999,
        background: "var(--surface)",
        borderLeft: "1px solid var(--border)",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        padding: 20,
      }}
    >
      {/* Drawer Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>ArchCheck Copilot</h4>
        </div>
        <button onClick={onClose} className="btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}>
          ✕
        </button>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ChatMessageList messages={messages} onApplyFix={onApplyMermaidFix} />

        {isThinking && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>
            <div className="spinner" />
            Copilot is thinking...
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <QuickPromptChips onSelectPrompt={handleSend} />

      {/* Input */}
      <ChatInputBar onSend={handleSend} disabled={isThinking} />
    </div>
  );
}
