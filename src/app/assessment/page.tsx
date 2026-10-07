"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import AudioRecorder from "@/components/AudioRecorder";
import StagedLoading from "@/components/StagedLoading";
import DemoBanner from "@/components/DemoBanner";
import { saveAssessmentResult, isRetryMode } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { Sparkles, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssessmentPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRetry, setIsRetry] = useState(false);

  useEffect(() => {
    trackEvent("assessment_started", { language });
    setIsRetry(isRetryMode());
  }, [language]);

  const activeQuestion =
    language === "id"
      ? "Ceritakan apa yang Anda kerjakan saat ini, dan mengapa pekerjaan tersebut penting."
      : "Tell us what you currently do, and why your work matters.";

  const handleAnalyzeAudio = async (audioBlob: Blob, durationSeconds: number) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("question", activeQuestion);
      formData.append("language", language);
      formData.append("duration", durationSeconds.toString());
      if (isRetry) {
        formData.append("isRetry", "true");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      saveAssessmentResult(data.result);
      trackEvent("assessment_completed", { score: data.result.overallScore, isRetry });

      router.push("/results");
    } catch (err: any) {
      console.error("Analysis request error:", err);
      setErrorMessage(err.message || "Failed to analyze audio. Please check connection.");
      setIsLoading(false);
    }
  };

  const handleUseDemo = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          isRetry,
          question: activeQuestion,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error("Could not load demo assessment.");
      }

      saveAssessmentResult(data.result);
      trackEvent("assessment_completed", { score: data.result.overallScore, isDemo: true, isRetry });

      router.push("/results");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load demo assessment.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gym-muted hover:text-gym-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <DemoBanner />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-gym-border bg-white px-3.5 py-1 text-xs font-bold text-gym-muted mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-gym-accent" />
          <span>{isRetry ? "Repetisi Ke-2 (Uji Progres)" : "Free Articulation Test"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gym-dark mb-3">
          {t.assessment.title}
        </h1>
        <p className="text-sm sm:text-base text-gym-muted leading-relaxed">
          {t.assessment.subtitle}
        </p>

        <div className="mt-6 inline-flex items-center rounded-full border border-gym-border bg-white p-1 text-xs font-bold shadow-sm">
          <button
            type="button"
            onClick={() => setLanguage("id")}
            className={`rounded-full px-4 py-1.5 transition-all ${
              language === "id"
                ? "bg-gym-dark text-white shadow"
                : "text-gym-muted hover:text-gym-dark"
            }`}
          >
            🇮🇩 Bahasa Indonesia
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-full px-4 py-1.5 transition-all ${
              language === "en"
                ? "bg-gym-dark text-white shadow"
                : "text-gym-muted hover:text-gym-dark"
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gym-accent">
            {t.assessment.questionBadge}
          </span>
          <span className="text-xs font-semibold text-gym-muted">
            Target: 30–90 detik
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gym-dark leading-snug mb-3">
          {activeQuestion}
        </h2>
        <div className="flex items-start gap-2 rounded-xl bg-gym-surface/80 p-3 text-xs text-gym-muted">
          <HelpCircle className="h-4 w-4 shrink-0 text-gym-accent mt-0.5" />
          <p>{t.assessment.tip}</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <StagedLoading />
      ) : (
        <AudioRecorder
          onAnalyzeAudio={handleAnalyzeAudio}
          onUseDemo={handleUseDemo}
          maxSeconds={90}
        />
      )}
    </div>
  );
}
