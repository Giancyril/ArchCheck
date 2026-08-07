/**
 * lib/share-url.ts
 * Generates and parses compressed shareable URL hashes for instant architecture review sharing.
 */

import type { ReviewResponse } from "@/types/review";
import type { ShareablePayload } from "@/types/export";

/**
 * Encodes a ReviewResponse into a URL hash string.
 */
export function encodeReviewToHash(review: ReviewResponse): string {
  const payload: ShareablePayload = {
    version: "1.0",
    title: review.architectureTitle,
    summary: review.summary,
    score: review.confidenceScore,
    mermaid: review.mermaidDiagram,
    timestamp: Date.now(),
  };

  const jsonStr = JSON.stringify(payload);
  const base64 = btoa(encodeURIComponent(jsonStr));
  return `#review=${base64}`;
}

/**
 * Decodes a URL hash string back into a ShareablePayload.
 */
export function decodeHashToReview(hash: string): ShareablePayload | null {
  if (!hash || !hash.includes("#review=")) return null;

  try {
    const base64 = hash.replace(/^.*#review=/, "");
    const jsonStr = decodeURIComponent(atob(base64));
    return JSON.parse(jsonStr) as ShareablePayload;
  } catch (err) {
    console.error("Failed to decode share URL hash:", err);
    return null;
  }
}
