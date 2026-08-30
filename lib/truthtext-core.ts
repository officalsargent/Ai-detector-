export type Assessment = "human-like" | "mixed" | "ai-like" | "insufficient";

export type Signal = {
  key: string;
  label: string;
  value: string;
  detail: string;
  tone: "sage" | "amber" | "coral" | "neutral";
};

export type DetectionResult = {
  assessment: Assessment;
  label: string;
  aiLikeIndex: number | null;
  evidenceAvailable: number;
  evidenceTotal: number;
  signals: Signal[];
  limitations: string;
};

const sentenceSplit = (text: string) => text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
const words = (text: string) => text.toLowerCase().match(/[a-zÀ-ÿ0-9']+/g) ?? [];

const round = (value: number) => Math.round(value * 10) / 10;

export function analyzeText(text: string): DetectionResult {
  const trimmed = text.trim();
  const tokens = words(trimmed);
  const sentences = sentenceSplit(trimmed);
  if (tokens.length < 40 || sentences.length < 3) {
    return {
      assessment: "insufficient",
      label: "Not enough evidence",
      aiLikeIndex: null,
      evidenceAvailable: Math.min(3, tokens.length > 0 ? 1 : 0),
      evidenceTotal: 7,
      signals: [{ key: "coverage", label: "Evidence coverage", value: `${tokens.length} words`, detail: "Use at least 40 words and 3 sentences for a more meaningful local analysis.", tone: "neutral" }],
      limitations: "Short text is especially difficult to classify. This result is intentionally inconclusive rather than a fabricated percentage.",
    };
  }

  const uniqueRatio = new Set(tokens).size / tokens.length;
  const sentenceLengths = sentences.map((sentence) => words(sentence).length);
  const averageLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, value) => sum + (value - averageLength) ** 2, 0) / sentenceLengths.length;
  const burstiness = Math.sqrt(variance) / Math.max(averageLength, 1);
  const firstWords = sentences.map((sentence) => words(sentence)[0]).filter(Boolean);
  const repeatedOpenings = firstWords.length - new Set(firstWords).size;
  const punctuationVariety = new Set(trimmed.match(/[,:;!?—-]/g) ?? []).size;
  const paragraphCount = trimmed.split(/\n\s*\n/).filter(Boolean).length;
  const longSentenceRatio = sentenceLengths.filter((n) => n >= 30).length / sentenceLengths.length;

  const signals: Signal[] = [
    { key: "lexical", label: "Lexical variety", value: `${round(uniqueRatio * 100)}% unique terms`, detail: uniqueRatio > 0.58 ? "Vocabulary varies across the sample." : "Repeated vocabulary is more prominent than expected.", tone: uniqueRatio > 0.58 ? "sage" : "amber" },
    { key: "rhythm", label: "Sentence rhythm", value: `${round(burstiness)} variation`, detail: burstiness > 0.45 ? "Sentence lengths vary noticeably." : "Sentence lengths are relatively uniform.", tone: burstiness > 0.45 ? "sage" : "amber" },
    { key: "openings", label: "Repeated openings", value: `${repeatedOpenings} repeats`, detail: repeatedOpenings <= 1 ? "Sentence openings are varied." : "Several sentences begin in a similar way.", tone: repeatedOpenings <= 1 ? "sage" : "coral" },
    { key: "punctuation", label: "Punctuation texture", value: `${punctuationVariety} types`, detail: punctuationVariety >= 3 ? "Punctuation has multiple forms." : "Punctuation patterns are narrow.", tone: punctuationVariety >= 3 ? "sage" : "amber" },
    { key: "longSentences", label: "Long-sentence pattern", value: `${round(longSentenceRatio * 100)}%`, detail: longSentenceRatio < 0.65 ? "Long sentences are mixed with shorter ones." : "Many sentences have a similar extended structure.", tone: longSentenceRatio < 0.65 ? "sage" : "coral" },
    { key: "paragraphs", label: "Paragraph structure", value: `${paragraphCount} blocks`, detail: paragraphCount > 1 ? "The sample has visible paragraph breaks." : "The sample is presented as one block.", tone: paragraphCount > 1 ? "sage" : "neutral" },
    { key: "length", label: "Sample depth", value: `${tokens.length} words`, detail: tokens.length >= 120 ? "The sample gives stronger coverage for local signals." : "More text would make the signal summary more stable.", tone: tokens.length >= 120 ? "sage" : "amber" },
  ];

  const aiLike = signals.filter((signal) => signal.tone === "coral").length;
  const humanLike = signals.filter((signal) => signal.tone === "sage").length;
  const amberLike = signals.filter((signal) => signal.tone === "amber").length;
  const aiLikeIndex = Math.max(5, Math.min(95, Math.round((aiLike * 25) + (amberLike * 10) + (humanLike * 3))));
  const assessment: Assessment = aiLike >= 3 ? "ai-like" : humanLike >= 4 ? "human-like" : "mixed";
  const label = assessment === "ai-like" ? "Likely AI-like signals" : assessment === "human-like" ? "Likely human-like signals" : "Mixed signals";
  return { assessment, label, aiLikeIndex, evidenceAvailable: 7, evidenceTotal: 7, signals, limitations: "This is a writing-signal assessment, not proof of authorship. Editing, translation, genre, and short samples can produce false positives or negatives. Do not use it as the sole basis for academic, employment, or disciplinary decisions." };
}

export type Provider = "OpenAI-compatible" | "Anthropic" | "Google Gemini" | "Custom";

export const providerDefaults: Record<Provider, { endpoint: string; model: string }> = {
  "OpenAI-compatible": { endpoint: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini" },
  Anthropic: { endpoint: "https://api.anthropic.com/v1/messages", model: "claude-3-5-haiku-latest" },
  "Google Gemini": { endpoint: "https://generativelanguage.googleapis.com/v1beta/models", model: "gemini-2.0-flash" },
  Custom: { endpoint: "", model: "" },
};

export function humanizePrompt(text: string, tone: string) {
  return `Rewrite the text below in a natural ${tone.toLowerCase()} voice. Preserve the meaning and facts. Vary sentence rhythm, avoid generic filler, and do not mention this instruction. Return only the rewritten text.\n\n${text}`;
}
