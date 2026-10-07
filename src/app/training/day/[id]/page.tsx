"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { TRAINING_DAYS } from "@/lib/trainingData";
import AudioRecorder from "@/components/AudioRecorder";
import StagedLoading from "@/components/StagedLoading";
import ScoreDonut from "@/components/ScoreDonut";
import CategoryBar from "@/components/CategoryBar";
import { markDayCompleted } from "@/lib/storage";
import { AssessmentResult } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  Mic,
  Dumbbell,
  CheckCircle2,
  RotateCcw,
  Layers,
  XCircle,
  ArrowRight,
} from "lucide-react";

export default function DayWorkoutPage() {
  const params = useParams();
  const { language, t } = useLanguage();

  const dayNumber = parseInt(params.id as string, 10) || 1;
  const dayData = TRAINING_DAYS.find((d) => d.day === dayNumber) || TRAINING_DAYS[0];

  const [activeTab, setActiveTab] = useState<"learn" | "example" | "challenge">("learn");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [workoutResult, setWorkoutResult] = useState<AssessmentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title = language === "id" ? dayData.titleId : dayData.titleEn;
  const subtitle = language === "id" ? dayData.subtitleId : dayData.subtitleEn;
  const learnPoints = language === "id" ? dayData.learnContentId : dayData.learnContentEn;
  const badExample = language === "id" ? dayData.exampleBadId : dayData.exampleBadEn;
  const goodExample = language === "id" ? dayData.exampleGoodId : dayData.exampleGoodEn;
  const question = language === "id" ? dayData.challengeQuestionId : dayData.challengeQuestionEn;

  const handleAnalyzeAudio = async (audioBlob: Blob, durationSeconds: number) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, `day_${dayData.day}_workout.webm`);
      formData.append("question", question);
      formData.append("language", language);
      formData.append("duration", durationSeconds.toString());

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menganalisis repetisi latihan.");
      }

      setWorkoutResult(data.result);
      markDayCompleted(dayData.day);
      trackEvent("exercise_completed", { day: dayData.day, score: data.result.overallScore });

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#EA580C", "#141311", "#16A34A"],
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses audio latihan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseDemo = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          question,
          isRetry: true,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Gagal memuat evaluasi demo.");

      setWorkoutResult(data.result);
      markDayCompleted(dayData.day);
      trackEvent("exercise_completed", { day: dayData.day, score: data.result.overallScore, isDemo: true });
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memuat demo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRepeatWorkout = () => {
    setWorkoutResult(null);
    setActiveTab("challenge");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/training"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gym-muted hover:text-gym-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Gym Dashboard</span>
        </Link>
        <span className="font-mono text-xs font-bold text-gym-muted">
          DAY {dayData.day} OF 7
        </span>
      </div>

      <div className="mb-8 rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gym-accentLight px-3 py-1 text-xs font-bold text-gym-accent mb-2">
              <Dumbbell className="h-3.5 w-3.5" />
              <span>{dayData.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-gym-dark tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-gym-muted mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          <div className="rounded-2xl bg-gym-surface p-3 text-center sm:text-right border border-gym-border/80">
            <span className="text-[10px] uppercase font-bold text-gym-muted block">
              Framework
            </span>
            <span className="text-xs font-extrabold text-gym-dark">
              {dayData.framework}
            </span>
          </div>
        </div>
      </div>

      {!workoutResult && (
        <div className="mb-8 flex rounded-2xl border border-gym-border bg-white p-1 text-xs font-bold shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("learn")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
              activeTab === "learn"
                ? "bg-gym-dark text-white shadow"
                : "text-gym-muted hover:text-gym-dark"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>1. {t.training.dayDetail.learnTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("example")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
              activeTab === "example"
                ? "bg-gym-dark text-white shadow"
                : "text-gym-muted hover:text-gym-dark"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>2. {t.training.dayDetail.exampleTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("challenge")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
              activeTab === "challenge"
                ? "bg-gym-accent text-white shadow"
                : "text-gym-muted hover:text-gym-dark"
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>3. {t.training.dayDetail.challengeTab}</span>
          </button>
        </div>
      )}

      {workoutResult ? (
        <div className="space-y-8">
          <div className="rounded-3xl border border-gym-border bg-white p-8 sm:p-10 text-center shadow-sm">
            <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              Sesi Day {dayData.day} Selesai & Tercatat
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gym-dark mb-6">
              Hasil Repetisi Anda
            </h2>

            <div className="mb-6">
              <ScoreDonut score={workoutResult.overallScore} />
            </div>

            <p className="text-sm sm:text-base font-bold text-gym-dark max-w-lg mx-auto mb-2">
              “{workoutResult.coach.summarySentence}”
            </p>
          </div>

          <div className="rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-black text-gym-dark mb-2">
              Koreksi Pelatih Komunikasi:
            </h3>
            <blockquote className="rounded-2xl border-l-4 border-gym-accent bg-gym-surface/60 p-4 text-sm font-semibold text-gym-dark italic leading-relaxed mb-4">
              “{workoutResult.coach.coachFeedback}”
            </blockquote>

            <div className="rounded-2xl bg-gym-surface p-4 border border-gym-border/70 text-xs">
              <strong className="text-gym-dark block mb-1">Penerapan Jawaban Sempurna:</strong>
              <p className="text-gym-muted italic">
                “{workoutResult.coach.exampleImprovedAnswer}”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CategoryBar
              label="Conciseness"
              weight={20}
              score={workoutResult.categoryScores.conciseness}
              feedback={workoutResult.coach.conciseness.feedback}
            />
            <CategoryBar
              label="Structure"
              weight={20}
              score={workoutResult.categoryScores.structure}
              feedback={workoutResult.coach.structure.feedback}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleRepeatWorkout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gym-border bg-white px-7 py-3.5 text-xs font-bold text-gym-dark hover:bg-gym-surface transition-all active:scale-98"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Ulangi Repetisi Ini</span>
            </button>

            {dayData.day < 7 ? (
              <Link
                href={`/training/day/${dayData.day + 1}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gym-accent px-8 py-3.5 text-xs font-extrabold text-white shadow hover:bg-gym-accentHover transition-all active:scale-98"
              >
                <span>Lanjut ke Day {dayData.day + 1}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/training"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gym-dark px-8 py-3.5 text-xs font-extrabold text-white shadow hover:bg-black transition-all active:scale-98"
              >
                <span>Selesai Seluruh Program 7 Hari</span>
              </Link>
            )}
          </div>
        </div>
      ) : isAnalyzing ? (
        <StagedLoading />
      ) : activeTab === "learn" ? (
        <div className="rounded-3xl border border-gym-border bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gym-accent">
            <BookOpen className="h-4 w-4" />
            <span>Pelajaran Inti</span>
          </div>

          <div className="space-y-4">
            {learnPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-2xl bg-gym-surface/80 p-4 border border-gym-border/60">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gym-dark text-white font-mono text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm font-semibold text-gym-dark leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab("example")}
              className="inline-flex items-center gap-2 rounded-full bg-gym-dark px-6 py-3 text-xs font-bold text-white hover:bg-black transition-all active:scale-98"
            >
              <span>Lanjut ke Contoh Nyata</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : activeTab === "example" ? (
        <div className="rounded-3xl border border-gym-border bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gym-accent">
            <Layers className="h-4 w-4" />
            <span>Perbandingan Nyata</span>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 mb-2">
              <XCircle className="h-4 w-4" />
              <span>{t.training.dayDetail.badExample}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
              {badExample}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.training.dayDetail.goodExample}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed italic">
              {goodExample}
            </p>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab("learn")}
              className="text-xs font-bold text-gym-muted hover:text-gym-dark"
            >
              ← Kembali ke Pelajaran
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("challenge")}
              className="inline-flex items-center gap-2 rounded-full bg-gym-accent px-6 py-3 text-xs font-extrabold text-white hover:bg-gym-accentHover transition-all active:scale-98 shadow"
            >
              <span>Mulai Latihan Suara</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gym-accent">
                {t.training.dayDetail.challengeTab}
              </span>
              <span className="text-xs font-semibold text-gym-muted">
                Target: {dayData.targetSeconds.min}–{dayData.targetSeconds.max} detik
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gym-dark leading-snug mb-3">
              {question}
            </h2>
            <p className="text-xs text-gym-muted">
              {t.training.dayDetail.readyToRecord}
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800">
              {errorMessage}
            </div>
          )}

          <AudioRecorder
            onAnalyzeAudio={handleAnalyzeAudio}
            onUseDemo={handleUseDemo}
            maxSeconds={dayData.targetSeconds.max}
          />
        </div>
      )}
    </div>
  );
}
