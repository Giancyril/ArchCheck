/**
 * types/copilot.ts
 * TypeScript interfaces for Live AI Architecture Copilot Chatbot & real-time Mermaid refactoring.
 */

export type CopilotRole = "user" | "assistant" | "system";

export interface CopilotMessage {
  id: string;
  role: CopilotRole;
  content: string;
  timestamp: number;
  suggestedMermaidFix?: string; // Optional suggested Mermaid diagram update
}

export interface CopilotChatState {
  isOpen: boolean;
  messages: CopilotMessage[];
  isThinking: boolean;
}
