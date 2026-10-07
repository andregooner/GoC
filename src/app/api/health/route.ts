import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini";

export async function GET() {
  const configured = isGeminiConfigured();
  return NextResponse.json({
    configured,
    models: {
      transcription: "gemini-3.5-transcribe",
      coach: "gemini-3.8-flash",
    },
    demoAvailable: true,
  });
}