import { SpeechMetrics } from "./types";

interface WordTiming {
  word: string;
  startOffset?: string | number;
  endOffset?: string | number;
}

function isContextualFiller(
  target: string,
  index: number,
  tokens: string[],
  rawTranscript: string
): boolean {
  const prev = index > 0 ? tokens[index - 1].toLowerCase() : "";
  const next = index < tokens.length - 1 ? tokens[index + 1].toLowerCase() : "";

  if (target === "jadi") {
    if (prev === "bisa" || prev === "harus" || prev === "akan" || prev === "mau") return false;
    if (next === "dokter" || next === "guru" || next === "alasan" || next === "korban" || next === "tahu") return false;
    if (prev === "jadi" || next === "jadi" || next === "eee" || next === "eh" || next === "anu" || next === "apa") return true;
    if (index === 0 && (next === "gimana" || next === "ya" || next === "gini")) return true;
    return true;
  }

  if (target === "like") {
    if (["i", "you", "we", "they", "he", "she", "would", "to", "really", "don't", "dont"].includes(prev)) return false;
    if (["looks", "feels", "sounds", "smells", "acted", "just"].includes(prev)) return false;
    return true;
  }

  if (target === "actually") {
    if (["it", "he", "she", "this", "that", "really"].includes(prev)) return false;
    return true;
  }

  if (target === "kayak") {
    if (index > 0 && !["eee", "emm", "uh", "um"].includes(prev) && next && next.length > 4) {
      return false;
    }
    return true;
  }

  return true;
}

export function calculateSpeechMetrics(
  transcript: string,
  durationSeconds: number,
  wordTimings?: WordTiming[]
): SpeechMetrics {
  const cleanDuration = Math.max(durationSeconds, 1);
  const normalizedText = transcript.trim();

  if (!normalizedText) {
    return {
      durationSeconds: Math.round(durationSeconds),
      wordCount: 0,
      wordsPerMinute: 0,
      fillerTotal: 0,
      fillerBreakdown: {},
      fillerRate: 0,
      repetitions: [],
      longPausesCount: 0,
      responseLengthClass: "Too short",
    };
  }

  const rawWords = normalizedText
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const wordCount = rawWords.length;
  const wordsPerMinute = Math.round((wordCount / (cleanDuration / 60)) * 10) / 10;

  const lowerText = normalizedText.toLowerCase();
  const fillerBreakdown: Record<string, number> = {};

  const multiWordPhrases = ["apa ya", "you know", "i mean", "sort of", "kind of"];
  for (const phrase of multiWordPhrases) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerBreakdown[phrase] = matches.length;
    }
  }

  const singleFillers = new Set([
    "eee", "ee", "eh", "emm", "em", "hmm", "hm", "anu",
    "maksudnya", "kayak", "jadi",
    "um", "uh", "uhm", "er", "ah", "like", "basically", "actually"
  ]);

  for (let i = 0; i < rawWords.length; i++) {
    const wordLower = rawWords[i].toLowerCase();
    if (singleFillers.has(wordLower)) {
      if (isContextualFiller(wordLower, i, rawWords, normalizedText)) {
        fillerBreakdown[wordLower] = (fillerBreakdown[wordLower] || 0) + 1;
      }
    }
  }

  const fillerTotal = Object.values(fillerBreakdown).reduce((sum, c) => sum + c, 0);
  const fillerRate = wordCount > 0 ? Math.round((fillerTotal / wordCount) * 1000) / 10 : 0;

  const repetitions: string[] = [];
  for (let i = 0; i < rawWords.length - 1; i++) {
    const current = rawWords[i].toLowerCase();
    const next = rawWords[i + 1].toLowerCase();
    if (current.length > 1 && current === next) {
      const repPhrase = `“${rawWords[i]} ${rawWords[i + 1]}”`;
      if (!repetitions.includes(repPhrase)) {
        repetitions.push(repPhrase);
      }
    }
  }

  for (let i = 0; i < rawWords.length - 3; i++) {
    const p1 = `${rawWords[i]} ${rawWords[i + 1]}`.toLowerCase();
    const p2 = `${rawWords[i + 2]} ${rawWords[i + 3]}`.toLowerCase();
    if (p1 === p2 && p1.length > 4) {
      const repPhrase = `“${rawWords[i]} ${rawWords[i + 1]} ${rawWords[i + 2]} ${rawWords[i + 3]}”`;
      if (!repetitions.includes(repPhrase)) {
        repetitions.push(repPhrase);
      }
    }
  }

  let longPausesCount = 0;
  if (wordTimings && wordTimings.length > 1) {
    for (let i = 0; i < wordTimings.length - 1; i++) {
      const currentEnd = parseSeconds(wordTimings[i].endOffset);
      const nextStart = parseSeconds(wordTimings[i + 1].startOffset);
      if (currentEnd !== null && nextStart !== null) {
        const gap = nextStart - currentEnd;
        if (gap >= 1.5) {
          longPausesCount++;
        }
      }
    }
  } else {
    const ellipsisMatches = normalizedText.match(/\.\.\.|\(pause\)|\[pause\]/gi);
    if (ellipsisMatches) {
      longPausesCount = ellipsisMatches.length;
    } else if (cleanDuration > 35 && wordsPerMinute < 100) {
      longPausesCount = Math.max(1, Math.floor((cleanDuration - (wordCount / 2.3)) / 2.5));
    }
  }

  let responseLengthClass: "Too short" | "Good" | "Too long" = "Good";
  if (cleanDuration < 25) {
    responseLengthClass = "Too short";
  } else if (cleanDuration > 90) {
    responseLengthClass = "Too long";
  }

  return {
    durationSeconds: Math.round(cleanDuration),
    wordCount,
    wordsPerMinute,
    fillerTotal,
    fillerBreakdown,
    fillerRate,
    repetitions,
    longPausesCount,
    responseLengthClass,
  };
}

function parseSeconds(val?: string | number): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "number") return val;
  const match = val.toString().match(/([\d.]+)s?/);
  return match ? parseFloat(match[1]) : null;
}

export function calculateOverallScore(scores: {
  clarity: number;
  conciseness: number;
  structure: number;
  fillerControl: number;
  pace: number;
  vocabulary: number;
}): number {
  const weighted =
    scores.clarity * 0.25 +
    scores.conciseness * 0.20 +
    scores.structure * 0.20 +
    scores.fillerControl * 0.15 +
    scores.pace * 0.10 +
    scores.vocabulary * 0.10;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}

export function calculateFillerControlScore(fillerRate: number): number {
  if (fillerRate <= 0.5) return 96;
  if (fillerRate <= 2.0) return 88;
  if (fillerRate <= 4.0) return 76;
  if (fillerRate <= 6.5) return 64;
  if (fillerRate <= 9.0) return 52;
  return Math.max(25, Math.round(100 - fillerRate * 7.5));
}

export function calculatePaceScore(wpm: number): number {
  if (wpm >= 125 && wpm <= 150) return 92;
  if (wpm >= 110 && wpm <= 165) return 84;
  if (wpm >= 95 && wpm <= 180) return 72;
  if (wpm >= 80 && wpm <= 195) return 60;
  return Math.max(30, Math.round(100 - Math.abs(135 - wpm) * 0.9));
}