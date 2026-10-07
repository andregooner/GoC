"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import ScoreDonut from "@/components/ScoreDonut";
import CategoryBar from "@/components/CategoryBar";
import DemoBanner from "@/components/DemoBanner";
import {
  getLatestAssessment,
  getPreviousAssessment,
  setRetryMode,
} from "@/lib/storage";
import { DEMO_ASSESSMENTS } from "@/lib/demoData";
import { AssessmentResult } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  FileText,
  Gauge,
  VolumeX,
  PauseCircle,
  ThumbsUp,
  Target,
  Dumbbell,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ResultsPage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [previousAssessment, setPreviousAssessment] = useState<AssessmentResult | null>(null);
  const [showVerbatim, setShowVerbatim] = useState(false);

  useEffect(() => {
    const latest = getLatestAssessment();
    const prev = getPreviousAssessment();

    if (latest) {
      setAssessment(latest);
      if (prev && prev.id !== latest.id) {
        setPreviousAssessment(prev);
        if (latest.overallScore > prev.overallScore) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ["#EA580C", "#141311", "#16A34A"],
            });
          } catch {}
        }
      }
    } else {
      const fallback = DEMO_ASSESSMENTS[language].initial;
      setAssessment(fallback);
    }
  }, [language]);

  if (!assessment) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-gym-muted">Memuat hasil artikulasi...</p>
      </div>
    );
  }

  const delta =
    previousAssessment !== undefined && previousAssessment !== null
      ? assessment.overallScore - previousAssessment.overallScore
      : undefined;

  const handleTryAgain = () => {
    setRetryMode(true);
    trackEvent("retry_started", { previousScore: assessment.overallScore });
    router.push("/assessment");
  };

  const handleStartTraining = () => {
    trackEvent("training_started");
    router.push("/training");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <DemoBanner isDemo={assessment.isDemo} />

      {previousAssessment && delta !== undefined && (
        <div className="mb-10 overflow-hidden rounded-3xl border-2 border-gym-accent bg-gym-accentLight/60 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block rounded-full bg-gym-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                {t.results.comparisonTitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gym-dark">
                {delta > 0
                  ? `+${delta} Poin Peningkatan Artikulasi!`
                  : delta < 0
                  ? `${delta} Poin Penyesuaian Skor`
                  : "Skor Konsisten dan Stabil"}
              </h3>
              <p className="text-xs text-gym-muted mt-1 max-w-md">
                {delta > 0
                  ? "Repetisi Anda membuahkan hasil nyata. Pengurangan durasi latar belakang dan penguatan poin pembuka langsung tercermin dalam metrik."
                  : "Ulangi latihan dengan fokus pada satu elemen spesifik di bawah ini."}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gym-border shadow-sm">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-gym-muted block">
                  {t.results.prevScore}
                </span>
                <span className="font-mono text-2xl font-bold text-gym-muted">
                  {previousAssessment.overallScore}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-gym-accent" />
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-gym-accent block">
                  {t.results.newScore}
                </span>
                <span className="font-mono text-3xl font-black text-gym-dark">
                  {assessment.overallScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP SECTION: ARTICULATION SCORE */}
      <div className="rounded-3xl border border-gym-border bg-white p-8 sm:p-12 text-center shadow-sm mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-gym-accent mb-2 block">
          Your Articulation Score
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gym-dark mb-8">
          {t.results.title}
        </h1>

        <div className="mb-6">
          <ScoreDonut score={assessment.overallScore} delta={delta} />
        </div>

        <p className="text-base sm:text-lg font-bold text-gym-dark max-w-xl mx-auto mb-4 leading-relaxed">
          “{assessment.coach.summarySentence}”
        </p>

        <p className="text-xs text-gym-muted max-w-md mx-auto leading-relaxed border-t border-gym-border/60 pt-4">
          {t.results.disclaimer}
        </p>
      </div>

      {/* CATEGORY SCORES BREAKDOWN */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-gym-dark">
            {t.results.scoreBreakdown}
          </h2>
          <span className="text-xs font-medium text-gym-muted">
            Formula Obyektif Terbobot
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CategoryBar
            label="Clarity"
            weight={25}
            score={assessment.categoryScores.clarity}
            prevScore={previousAssessment?.categoryScores.clarity}
            feedback={assessment.coach.clarity.feedback}
          />
          <CategoryBar
            label="Conciseness"
            weight={20}
            score={assessment.categoryScores.conciseness}
            prevScore={previousAssessment?.categoryScores.conciseness}
            feedback={assessment.coach.conciseness.feedback}
          />
          <CategoryBar
            label="Structure"
            weight={20}
            score={assessment.categoryScores.structure}
            prevScore={previousAssessment?.categoryScores.structure}
            feedback={assessment.coach.structure.feedback}
          />
          <CategoryBar
            label="Filler Control"
            weight={15}
            score={assessment.categoryScores.fillerControl}
            prevScore={previousAssessment?.categoryScores.fillerControl}
            feedback={assessment.coach.fillerControlAssessment}
          />
          <CategoryBar
            label="Pace"
            weight={10}
            score={assessment.categoryScores.pace}
            prevScore={previousAssessment?.categoryScores.pace}
            feedback={assessment.coach.paceAssessment}
          />
          <CategoryBar
            label="Vocabulary"
            weight={10}
            score={assessment.categoryScores.vocabulary}
            prevScore={previousAssessment?.categoryScores.vocabulary}
            feedback={assessment.coach.vocabulary.feedback}
          />
        </div>
      </div>

      {/* YOUR SPEAKING DATA */}
      <div className="mb-10 rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-gym-dark">
              {t.results.speakingDataTitle}
            </h2>
            <p className="text-xs text-gym-muted">
              Data terukur secara deterministik dari ucapan verbatim Anda
            </p>
          </div>
          <span className="rounded-full bg-gym-surface px-3 py-1 text-xs font-bold text-gym-dark">
            {assessment.metrics.responseLengthClass} Length
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="rounded-2xl bg-gym-surface/80 p-4 border border-gym-border/60">
            <Clock className="h-4 w-4 text-gym-accent mx-auto mb-1.5" />
            <span className="font-mono text-2xl font-black text-gym-dark block">
              {assessment.metrics.durationSeconds}s
            </span>
            <span className="text-[11px] font-bold text-gym-muted uppercase">
              {t.results.duration}
            </span>
          </div>

          <div className="rounded-2xl bg-gym-surface/80 p-4 border border-gym-border/60">
            <FileText className="h-4 w-4 text-gym-accent mx-auto mb-1.5" />
            <span className="font-mono text-2xl font-black text-gym-dark block">
              {assessment.metrics.wordCount}
            </span>
            <span className="text-[11px] font-bold text-gym-muted uppercase">
              {t.results.words}
            </span>
          </div>

          <div className="rounded-2xl bg-gym-surface/80 p-4 border border-gym-border/60">
            <Gauge className="h-4 w-4 text-gym-accent mx-auto mb-1.5" />
            <span className="font-mono text-2xl font-black text-gym-dark block">
              {assessment.metrics.wordsPerMinute}
            </span>
            <span className="text-[11px] font-bold text-gym-muted uppercase">
              {t.results.wpm}
            </span>
          </div>

          <div className="rounded-2xl bg-gym-surface/80 p-4 border border-gym-border/60">
            <VolumeX className="h-4 w-4 text-gym-accent mx-auto mb-1.5" />
            <span className="font-mono text-2xl font-black text-gym-dark block">
              {assessment.metrics.fillerTotal}
            </span>
            <span className="text-[11px] font-bold text-gym-muted uppercase">
              {t.results.fillers} ({assessment.metrics.fillerRate}%)
            </span>
          </div>

          <div className="rounded-2xl bg-gym-surface/80 p-4 border border-gym-border/60 col-span-2 sm:col-span-1">
            <PauseCircle className="h-4 w-4 text-gym-accent mx-auto mb-1.5" />
            <span className="font-mono text-2xl font-black text-gym-dark block">
              {assessment.metrics.longPausesCount}
            </span>
            <span className="text-[11px] font-bold text-gym-muted uppercase">
              {t.results.pauses}
            </span>
          </div>
        </div>

        {assessment.metrics.fillerTotal > 0 && (
          <div className="mt-6 border-t border-gym-border/60 pt-4">
            <span className="text-xs font-bold text-gym-dark block mb-2">
              {t.results.fillersBreakdownTitle}:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(assessment.metrics.fillerBreakdown).map(([w, cnt]) => (
                <span
                  key={w}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gym-surface px-3 py-1 text-xs font-medium text-gym-dark border border-gym-border"
                >
                  <span className="font-mono font-bold text-gym-accent">“{w}”</span>
                  <span className="text-gym-muted text-[11px] font-semibold">({cnt}x)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {assessment.metrics.repetitions && assessment.metrics.repetitions.length > 0 && (
          <div className="mt-4 border-t border-gym-border/60 pt-4">
            <span className="text-xs font-bold text-gym-dark block mb-2">
              Pengulangan Kata Terdeteksi (False Starts):
            </span>
            <div className="flex flex-wrap gap-2">
              {assessment.metrics.repetitions.map((rep, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-red-50 text-red-700 px-2.5 py-1 text-xs font-mono font-semibold border border-red-200"
                >
                  {rep}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-gym-border/60 pt-4">
          <button
            type="button"
            onClick={() => setShowVerbatim(!showVerbatim)}
            className="flex items-center justify-between w-full text-xs font-bold text-gym-muted hover:text-gym-dark transition-colors"
          >
            <span>{t.results.verbatimTitle}</span>
            {showVerbatim ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showVerbatim && (
            <div className="mt-3 rounded-2xl bg-gym-surface p-4 text-xs font-mono text-gym-dark leading-relaxed border border-gym-border/80">
              {assessment.transcript}
            </div>
          )}
        </div>
      </div>

      {/* MAIN STRENGTH & BIGGEST OPPORTUNITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ThumbsUp className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              {t.results.mainStrengthTitle}
            </span>
          </div>
          <h3 className="text-lg font-black text-gym-dark mb-2">
            {assessment.coach.mainStrength}
          </h3>
          <p className="text-xs text-gym-muted leading-relaxed">
            {assessment.coach.clarity.feedback}
          </p>
        </div>

        <div className="rounded-3xl border border-gym-accent/30 bg-gym-accentLight/40 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gym-accent text-white">
              <Target className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-gym-accent">
              {t.results.biggestOpportunityTitle}
            </span>
          </div>
          <h3 className="text-lg font-black text-gym-dark mb-2">
            {assessment.coach.biggestOpportunity}
          </h3>
          <p className="text-xs text-gym-muted leading-relaxed">
            {assessment.coach.conciseness.feedback}
          </p>
        </div>
      </div>

      {/* AI COACH FEEDBACK */}
      <div className="rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gym-dark text-white">
            <Dumbbell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gym-dark leading-tight">
              {t.results.coachSaysTitle}
            </h3>
            <span className="text-[11px] font-semibold text-gym-muted">
              Umpan Balik Taktikal & Konstruktif
            </span>
          </div>
        </div>

        <blockquote className="rounded-2xl border-l-4 border-gym-accent bg-gym-surface/60 p-4 text-sm sm:text-base font-semibold text-gym-dark italic leading-relaxed mb-4">
          “{assessment.coach.coachFeedback}”
        </blockquote>

        <p className="text-xs text-gym-muted">
          Rekomendasi repetisi berikutnya: <strong className="text-gym-dark">{assessment.coach.nextExercise}</strong>
        </p>
      </div>

      {/* BETTER FRAMEWORK: PREP */}
      <div className="rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-gym-accent" />
          <h3 className="text-lg font-black text-gym-dark">
            {t.results.frameworkTitle}
          </h3>
        </div>
        <p className="text-xs text-gym-muted mb-6">
          {t.results.frameworkDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {t.results.prep.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gym-border/80 bg-gym-surface/60 p-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gym-dark text-white font-mono font-black text-sm mb-2">
                {step.letter}
              </div>
              <h4 className="text-xs font-extrabold text-gym-dark mb-1">
                {step.name}
              </h4>
              <p className="text-[11px] text-gym-muted leading-snug">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {assessment.coach.exampleImprovedAnswer && (
          <div className="rounded-2xl bg-gym-surface p-4 border border-gym-border/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gym-accent block mb-1">
              Contoh Jawaban Lebih Tajam (Format PREP):
            </span>
            <p className="text-xs sm:text-sm text-gym-dark font-medium leading-relaxed italic">
              “{assessment.coach.exampleImprovedAnswer}”
            </p>
          </div>
        )}
      </div>

      {/* FINAL ACTION SECTION */}
      <div className="rounded-3xl border border-gym-dark bg-gym-dark p-8 sm:p-10 text-white text-center shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          {t.results.tryAgainPrompt}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mb-8">
          Kekuatan otot artikulasi terbentuk melalui repetisi langsung. Coba rekam kembali jawaban Anda dan ukur peningkatannya.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleTryAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gym-accent px-8 py-4 text-base font-extrabold text-white shadow-md hover:bg-gym-accentHover active:scale-98 transition-all"
          >
            <RotateCcw className="h-5 w-5" />
            <span>{t.results.tryAgainBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleStartTraining}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 active:scale-98 transition-all"
          >
            <Sparkles className="h-5 w-5 text-gym-accent" />
            <span>{t.results.startTrainingBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
