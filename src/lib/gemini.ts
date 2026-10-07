import { GoogleGenAI, Type, AudioTranscriptionConfigMode } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { SpeechMetrics, CoachEvaluation, Language } from "./types";
import { calculateFillerControlScore, calculatePaceScore } from "./metrics";

function getApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
}

export function isGeminiConfigured(): boolean {
  const key = getApiKey();
  return Boolean(key && key.trim().length > 0 && !key.includes("your_gemini_api_key"));
}

export async function transcribeAudioWithGemini(
  audioBuffer: Buffer,
  mimeType: string = "audio/webm"
): Promise<{ transcript: string; wordTimings: { word: string; startOffset?: string; endOffset?: string }[] }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const tempDir = os.tmpdir();
  const ext = mimeType.includes("wav") ? ".wav" : mimeType.includes("mp4") ? ".mp4" : mimeType.includes("mp3") ? ".mp3" : ".webm";
  const tempFilePath = path.join(tempDir, `goc_audio_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);
  
  await fs.promises.writeFile(tempFilePath, audioBuffer);

  let uploadedFile: any = null;
  try {
    uploadedFile = await ai.files.upload({
      file: tempFilePath,
      config: { mimeType: mimeType || "audio/webm" },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: [
        {
          fileData: {
            fileUri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          },
        },
      ],
      config: {
        audioTranscriptionConfig: {
          mode: AudioTranscriptionConfigMode.VERBATIM,
          wordTimestamp: true,
        },
      },
    });

    let transcriptText = response.text || "";
    const wordTimings: { word: string; startOffset?: string; endOffset?: string }[] = [];

    const candidates = response.candidates || [];
    for (const cand of candidates) {
      const parts = cand.content?.parts || [];
      for (const part of parts as any[]) {
        if (part.audioTranscription?.words) {
          for (const w of part.audioTranscription.words) {
            wordTimings.push({
              word: w.word || "",
              startOffset: w.startOffset,
              endOffset: w.endOffset,
            });
          }
        }
      }
    }

    if (!transcriptText.trim() && wordTimings.length > 0) {
      transcriptText = wordTimings.map((w) => w.word).join(" ");
    }

    return {
      transcript: transcriptText.trim(),
      wordTimings,
    };
  } finally {
    try {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    } catch (cleanupErr) {
      console.warn("Failed to delete temp audio file:", cleanupErr);
    }

    if (uploadedFile?.name) {
      try {
        await ai.files.delete({ name: uploadedFile.name });
      } catch (delErr) {
        console.warn("Failed to delete Files API audio:", delErr);
      }
    }
  }
}

export async function analyzeCommunicationWithCoach(params: {
  question: string;
  language: Language;
  transcript: string;
  metrics: SpeechMetrics;
}): Promise<CoachEvaluation> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const deterministicFillerScore = calculateFillerControlScore(params.metrics.fillerRate);
  const deterministicPaceScore = calculatePaceScore(params.metrics.wordsPerMinute);

  const prompt = `
You are the master communication coach at "Gym of Communication" (The Gym for Communication).
Your philosophy: "Train the human skills AI can't replace."
You coach ambitious professionals, founders, managers, consultants, and students in Indonesia who know what they want to say, but struggle to articulate clearly, concisely, and spontaneously.

Context:
- Language context: ${params.language === "id" ? "Bahasa Indonesia (with potential English code-switching)" : "English (with potential Indonesian code-switching)"}
- Response Target: 30-90 seconds.
- Exercise prompt: "${params.question}"

Deterministic Speech Data Measured in Application:
- Duration: ${params.metrics.durationSeconds} seconds
- Spoken words: ${params.metrics.wordCount}
- Speaking Pace: ${params.metrics.wordsPerMinute} Words Per Minute (Optimal range: 120-150 WPM)
- Total Fillers Detected: ${params.metrics.fillerTotal} (Rate: ${params.metrics.fillerRate}%)
- Filler Breakdown: ${JSON.stringify(params.metrics.fillerBreakdown)}
- Detected Repetitions: ${JSON.stringify(params.metrics.repetitions)}
- Long Pauses (>1.5s): ${params.metrics.longPausesCount}
- Length category: ${params.metrics.responseLengthClass}

Verbatim Spoken Transcript:
"""
${params.transcript}
"""

Important Coaching Guidelines:
1. Provide constructive, concise, highly actionable coaching.
2. DO NOT be overly complimentary or use empty praise like "Great job! Keep practicing!".
3. DO NOT judge intelligence, personality, accent, ethnicity, or socioeconomic background.
4. DO NOT punish Indonesian accents when speaking English.
5. Emphasize communication effectiveness: Getting to the point fast, structuring thoughts (e.g. PREP: Point, Reason, Example, Point), and eliminating clutter.
6. Provide scores from 0-100 for Clarity (25%), Conciseness (20%), Structure (20%), and Vocabulary (10%).
7. In coachFeedback: Provide 2-4 sentences maximum. Make it punchy, concrete, and directly referencing what they spoke.
8. In summarySentence: Provide 1 crisp sentence explaining their overall foundation.
9. In exampleImprovedAnswer: Provide a model 3-4 sentence answer applying the PREP framework to their exact topic.
10. Language of output: Write all feedback, assessments, and examples in ${params.language === "id" ? "natural modern Bahasa Indonesia (avoid stiff bureaucratic terms like 'Saudara/Pernyataan pokok', use natural professional Indonesian like 'Anda/poin utama')" : "English"}.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clarity: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Score from 0 to 100" },
              feedback: { type: Type.STRING, description: "Actionable feedback on clarity" },
            },
            required: ["score", "feedback"],
          },
          conciseness: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Score from 0 to 100" },
              feedback: { type: Type.STRING, description: "Actionable feedback on conciseness" },
            },
            required: ["score", "feedback"],
          },
          structure: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Score from 0 to 100" },
              feedback: { type: Type.STRING, description: "Actionable feedback on structure" },
            },
            required: ["score", "feedback"],
          },
          vocabulary: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Score from 0 to 100" },
              feedback: { type: Type.STRING, description: "Actionable feedback on vocabulary" },
            },
            required: ["score", "feedback"],
          },
          fillerControlAssessment: {
            type: Type.STRING,
            description: "1-2 sentences assessing filler control based on measured metrics",
          },
          paceAssessment: {
            type: Type.STRING,
            description: "1-2 sentences assessing speaking pace and pauses based on measured WPM",
          },
          mainStrength: {
            type: Type.STRING,
            description: "Single punchy headline of their #1 strength",
          },
          biggestOpportunity: {
            type: Type.STRING,
            description: "Single punchy headline of their #1 growth area",
          },
          coachFeedback: {
            type: Type.STRING,
            description: "2-4 sentences of direct, specific coaching.",
          },
          betterApproach: {
            type: Type.STRING,
            description: "Tactical instruction on applying PREP or another framework.",
          },
          exampleImprovedAnswer: {
            type: Type.STRING,
            description: "A concrete, improved 3-4 sentence version of their answer.",
          },
          nextExercise: {
            type: Type.STRING,
            description: "Next recommended gym workout exercise.",
          },
          summarySentence: {
            type: Type.STRING,
            description: "1 crisp sentence summarizing communication foundation.",
          },
        },
        required: [
          "clarity",
          "conciseness",
          "structure",
          "vocabulary",
          "fillerControlAssessment",
          "paceAssessment",
          "mainStrength",
          "biggestOpportunity",
          "coachFeedback",
          "betterApproach",
          "exampleImprovedAnswer",
          "nextExercise",
          "summarySentence",
        ],
      },
    },
  });

  const rawJson = response.text || "{}";
  try {
    const parsed = JSON.parse(rawJson);
    return {
      clarity: {
        score: Math.min(100, Math.max(0, parsed.clarity?.score ?? 70)),
        feedback: parsed.clarity?.feedback || "Fokus pada kejelasan pesan inti.",
      },
      conciseness: {
        score: Math.min(100, Math.max(0, parsed.conciseness?.score ?? 65)),
        feedback: parsed.conciseness?.feedback || "Kurangi elaborasi latar belakang yang terlalu panjang.",
      },
      structure: {
        score: Math.min(100, Math.max(0, parsed.structure?.score ?? 68)),
        feedback: parsed.structure?.feedback || "Gunakan format PREP agar alur lebih mudah diikuti.",
      },
      vocabulary: {
        score: Math.min(100, Math.max(0, parsed.vocabulary?.score ?? 72)),
        feedback: parsed.vocabulary?.feedback || "Pilihan kata sudah cukup baik dan komunikatif.",
      },
      fillerControlAssessment: parsed.fillerControlAssessment || `Total ${params.metrics.fillerTotal} filler terdeteksi (${params.metrics.fillerRate}% dari ucapan).`,
      fillerControlScore: deterministicFillerScore,
      paceAssessment: parsed.paceAssessment || `Kecepatan bicara Anda ${params.metrics.wordsPerMinute} kata per menit.`,
      paceScore: deterministicPaceScore,
      mainStrength: parsed.mainStrength || "Anda menjelaskan ide menggunakan bahasa yang mudah dipahami.",
      biggestOpportunity: parsed.biggestOpportunity || "Sampaikan poin utama Anda lebih awal.",
      coachFeedback: parsed.coachFeedback || "Pernyataan Anda cukup jelas, namun poin utama baru muncul di paruh kedua. Letakkan kesimpulan di kalimat pembuka.",
      betterApproach: parsed.betterApproach || "Gunakan PREP: Point langsung di detik pertama, Reason kenapa penting, Example nyata, lalu tegaskan kembali.",
      exampleImprovedAnswer: parsed.exampleImprovedAnswer || "Pekerjaan saya penting karena menghubungkan kebutuhan bisnis dengan solusi teknologi yang efisien. Contohnya, kami memangkas waktu proses hingga 40%. Itulah mengapa peran ini berdampak langsung bagi perusahaan.",
      nextExercise: parsed.nextExercise || "Day 1: Stop Rambling (Point first, explanation second).",
      summarySentence: parsed.summarySentence || "Anda berkomunikasi dengan cukup jelas secara umum, namun Anda sering menjelaskan latar belakang sebelum menyampaikan poin utama.",
    };
  } catch (parseErr) {
    console.error("Failed to parse coach JSON output:", rawJson, parseErr);
    throw new Error("Coach response could not be parsed into structured format.");
  }
}
