/**
 * tests/reviewer-parser.test.ts
 * Unit tests for Gemini review response JSON parser.
 */

import { parseReviewResponse } from "../lib/reviewer";

describe("Review Response Parser", () => {
  it("should correctly parse valid JSON review output", () => {
    const rawJson = JSON.stringify({
      architectureTitle: "Test System Architecture",
      summary: "Valid test summary.",
      confidenceScore: 95,
      ambiguities: [],
      categories: {
        scalability: [
          {
            id: "s1",
            title: "Database Bottleneck",
            severity: "critical",
            explanation: "No read replicas.",
            recommendation: "Add read replicas.",
          },
        ],
        reliability: [],
        bottlenecks: [],
        designTradeoffs: [],
      },
      mermaidDiagram: "flowchart TD\n  A --> B",
    });

    const parsed = parseReviewResponse(rawJson);
    expect(parsed.architectureTitle).toBe("Test System Architecture");
    expect(parsed.confidenceScore).toBe(95);
    expect(parsed.categories.scalability.length).toBe(1);
    expect(parsed.categories.scalability[0].severity).toBe("critical");
  });

  it("should strip markdown json fences before parsing", () => {
    const rawFenced = "```json\n{\n  \"architectureTitle\": \"Fenced Title\",\n  \"summary\": \"Summary\",\n  \"confidenceScore\": 90,\n  \"categories\": {\n    \"scalability\": [],\n    \"reliability\": [],\n    \"bottlenecks\": [],\n    \"designTradeoffs\": []\n  }\n}\n```";

    const parsed = parseReviewResponse(rawFenced);
    expect(parsed.architectureTitle).toBe("Fenced Title");
  });

  it("should throw a clear error on malformed non-JSON input", () => {
    expect(() => parseReviewResponse("Invalid non-JSON string")).toThrow(
      "AI review response could not be parsed as valid JSON."
    );
  });
});
