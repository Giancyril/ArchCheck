/**
 * tests/mermaid-sanitizer.test.ts
 * Unit tests for Mermaid.js syntax sanitizer and validator.
 */

import {
  stripMermaidFences,
  isValidMermaid,
  sanitizeMermaid,
} from "../lib/mermaid-sanitizer";

describe("Mermaid Sanitizer Utility", () => {
  it("should strip markdown code fences from raw LLM output", () => {
    const raw = "```mermaid\ngraph TD\n  A --> B\n```";
    expect(stripMermaidFences(raw)).toBe("graph TD\n  A --> B");
  });

  it("should validate valid flowchart TD diagram starters", () => {
    expect(isValidMermaid("flowchart TD\n  Client --> Gateway")).toBe(true);
    expect(isValidMermaid("graph LR\n  A --> B")).toBe(true);
    expect(isValidMermaid("sequenceDiagram\n  Alice->>Bob: Hello")).toBe(true);
  });

  it("should reject invalid diagram starters", () => {
    expect(isValidMermaid("This is plain text without mermaid syntax")).toBe(false);
    expect(isValidMermaid("random JSON output")).toBe(false);
  });

  it("should return fallback diagram when syntax is invalid", () => {
    const invalid = "Invalid diagram content";
    const result = sanitizeMermaid(invalid);
    expect(result).toContain("graph TD");
    expect(result).toContain("Architecture diagram could not be parsed");
  });
});
