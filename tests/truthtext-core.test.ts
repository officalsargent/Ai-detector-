import { describe, expect, it } from "vitest";
import { analyzeText, humanizePrompt } from "../lib/truthtext-core";

describe("TruthText local signal engine", () => {
  it("returns an inconclusive result for short text instead of inventing a score", () => {
    const result = analyzeText("This is short text.");
    expect(result.assessment).toBe("insufficient");
    expect(result.label).toBe("Not enough evidence");
    expect(result.limitations).toContain("fabricated percentage");
  });

  it("returns signal coverage for a sufficiently long sample", () => {
    const sample = Array.from({ length: 70 }, (_, index) => index % 4 === 0 ? "However" : "A thoughtful writer varies sentence rhythm and chooses details that connect the idea to a concrete example.").join(" ");
    const result = analyzeText(sample);
    expect(result.evidenceTotal).toBe(7);
    expect(result.signals.length).toBe(7);
    expect(["human-like", "mixed", "ai-like"]).toContain(result.assessment);
  });

  it("keeps humanization instructions separate from provider transport", () => {
    const prompt = humanizePrompt("Keep this meaning.", "Friendly");
    expect(prompt).toContain("natural friendly voice");
    expect(prompt).toContain("Keep this meaning.");
    expect(prompt).not.toContain("percentage");
  });
});
