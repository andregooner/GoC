import { NextRequest, NextResponse } from "next/server";
import {
  transcribeAudioWithGemini,
  analyzeCommunicationWithCoach,
  isGeminiConfigured,
} from "@/lib/gemini";
import { calculateSpeechMetrics, calculateOverallScore } from "@/lib/metrics";
import { DEMO_ASSESSMENTS } from "@/lib/demoData";
import { AssessmentResult, Language } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const language: Language = body.language === "en" ? "en" : "id";
      const isRetry = Boolean(body.isRetry);

      const demoDataset = DEMO_ASSESSMENTS[language];
      const selected = isRetry ? demoDataset.retry : demoDataset.initial;

      const result: AssessmentResult = {
        ...selected,
        id: `assessment-${Date.now()}`,
        timestamp: Date.now(),
        question: body.question || selected.question,
        isDemo: true,
      };

      return NextResponse.json({ success: true, result });
    }

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data with audio file." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;
    const question = (formData.get("question") as string) || "Tell us what you currently do, and why your work matters.";
    const language: Language = (formData.get("language") as string) === "en" ? "en" : "id";
    const durationSeconds = parseFloat((formData.get("duration") as string) || "45");
    const forceDemo = formData.get("demo") === "true";

    if (forceDemo || !isGeminiConfigured()) {
      const isRetry = formData.get("isRetry") === "true";
      const demoData = DEMO_ASSESSMENTS[language];
      const baseResult = isRetry ? demoData.retry : demoData.initial;

      const result: AssessmentResult = {
        ...baseResult,
        id: `assessment-${Date.now()}`,
        timestamp: Date.now(),
        question,
        language,
        isDemo: true,
      };

      return NextResponse.json({
        success: true,
        result,
        notice: !isGeminiConfigured()
          ? "GEMINI_API_KEY is not configured on the server. Displaying high-fidelity demo analysis."
          : undefined,
      });
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required for live analysis." },
        { status: 400 }
      );
    }

    if (durationSeconds < 5) {
      return NextResponse.json(
        { error: "Recording is too short. Please speak for at least 10 seconds." },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = audioFile.type || "audio/webm";

    let transcriptionData: { transcript: string; wordTimings: any[] };
    try {
      transcriptionData = await transcribeAudioWithGemini(buffer, mimeType);
    } catch (transcribeErr: any) {
      console.error("Gemini Transcription Error:", transcribeErr);
      return NextResponse.json(
        {
          error: "Transcription failed. Please check microphone audio or Gemini API key.",
          details: transcribeErr?.message || String(transcribeErr),
        },
        { status: 500 }
      );
    }

    const { transcript, wordTimings } = transcriptionData;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        {
          error: "No clear speech was detected in the recording. Please speak closer to the microphone and try again.",
        },
        { status: 422 }
      );
    }

    const metrics = calculateSpeechMetrics(transcript, durationSeconds, wordTimings);

    let coachEvaluation;
    try {
      coachEvaluation = await analyzeCommunicationWithCoach({
        question,
        language,
        transcript,
        metrics,
      });
    } catch (coachErr: any) {
      console.error("Gemini Coach Error:", coachErr);
      return NextResponse.json(
        {
          error: "AI Coach evaluation failed. Please try again.",
          details: coachErr?.message || String(coachErr),
        },
        { status: 500 }
      );
    }

    const categoryScores = {
      clarity: coachEvaluation.clarity.score,
      conciseness: coachEvaluation.conciseness.score,
      structure: coachEvaluation.structure.score,
      fillerControl: coachEvaluation.fillerControlScore,
      pace: coachEvaluation.paceScore,
      vocabulary: coachEvaluation.vocabulary.score,
    };

    const overallScore = calculateOverallScore(categoryScores);

    const result: AssessmentResult = {
      id: `live-${Date.now()}`,
      timestamp: Date.now(),
      question,
      language,
      transcript,
      metrics,
      categoryScores,
      overallScore,
      coach: coachEvaluation,
      isDemo: false,
    };

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Unexpected error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Internal server error occurred.", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
