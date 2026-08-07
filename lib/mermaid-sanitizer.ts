/**
 * lib/mermaid-sanitizer.ts
 * Validates and sanitizes Mermaid.js diagram definitions before client rendering.
 * (Implemented in Stage 5)
 */

/**
 * Strip markdown code fences if the LLM wraps the diagram in ```mermaid ... ```
 */
export function stripMermaidFences(raw: string): string {
  return raw
    .replace(/^```mermaid\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

/**
 * Basic structural validation — checks for a valid diagram type declaration.
 */
export function isValidMermaid(diagram: string): boolean {
  const clean = stripMermaidFences(diagram).trim();
  const validStarters = [
    /^graph\s+(TD|LR|RL|BT|TB)/i,
    /^flowchart\s+(TD|LR|RL|BT|TB)/i,
    /^sequenceDiagram/i,
    /^classDiagram/i,
  ];
  return validStarters.some((re) => re.test(clean));
}

/**
 * Returns a cleaned, safe diagram string — or a fallback minimal diagram.
 */
export function sanitizeMermaid(raw: string): string {
  const clean = stripMermaidFences(raw);
  if (isValidMermaid(clean)) return clean;
  // Fallback: minimal valid diagram indicating parse failure
  return `graph TD\n  A[Architecture diagram could not be parsed] --> B[Please try re-analyzing]`;
}
