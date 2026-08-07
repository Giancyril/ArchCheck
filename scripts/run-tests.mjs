/**
 * scripts/run-tests.mjs
 * Zero-dependency unit test runner using Node.js test module.
 */
import assert from "node:assert/strict";
import { stripMermaidFences, isValidMermaid, sanitizeMermaid } from "../lib/mermaid-sanitizer.ts";
import { parseReviewResponse } from "../lib/reviewer.ts";

console.log("🧪 Running AI System Design Reviewer Unit Tests...\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ── Mermaid Sanitizer Tests ──────────────────────────────────────────────────
console.log("1. Mermaid Sanitizer Tests:");

test("stripMermaidFences removes markdown code fences", () => {
  const input = "```mermaid\ngraph TD\n  A --> B\n```";
  assert.equal(stripMermaidFences(input), "graph TD\n  A --> B");
});

test("isValidMermaid validates valid starters", () => {
  assert.equal(isValidMermaid("flowchart TD\n  A --> B"), true);
  assert.equal(isValidMermaid("graph LR\n  A --> B"), true);
  assert.equal(isValidMermaid("invalid text"), false);
});

test("sanitizeMermaid provides fallback on invalid syntax", () => {
  const result = sanitizeMermaid("invalid content");
  assert.match(result, /graph TD/);
  assert.match(result, /could not be parsed/);
});

// ── Review Parser Tests ──────────────────────────────────────────────────────
console.log("\n2. Review Parser Tests:");

test("parseReviewResponse parses valid JSON", () => {
  const json = JSON.stringify({
    architectureTitle: "Test System",
    summary: "Overview",
    confidenceScore: 90,
    categories: { scalability: [], reliability: [], bottlenecks: [], designTradeoffs: [] },
  });
  const parsed = parseReviewResponse(json);
  assert.equal(parsed.architectureTitle, "Test System");
  assert.equal(parsed.confidenceScore, 90);
});

test("parseReviewResponse strips markdown fences", () => {
  const fenced = '```json\n{"architectureTitle":"Fenced"}\n```';
  const parsed = parseReviewResponse(fenced);
  assert.equal(parsed.architectureTitle, "Fenced");
});

test("parseReviewResponse throws on malformed JSON", () => {
  assert.throws(() => parseReviewResponse("not json"), /could not be parsed/);
});

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed.`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
