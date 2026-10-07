"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { TRAINING_DAYS } from "@/lib/trainingData";
import {
  getCompletedDays,
  getMinutesTrained,
  getStreak,
  getLatestAssessment,
} from "@/lib/storage";
import { AssessmentResult } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import {
  Dumbbell,
  CheckCircle2,
  Flame,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function TrainingDashboardPage() {
  const { language, t } = useLanguage();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [minutesTrained, setMinutesTrained] = useState<number>(12);
  const [streak, setStreak] = useState<number>(3);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompletedDays(getCompletedDays());
    setMinutesTrained(getMinutesTrained());
    setStreak(getStreak());
    setLatestResult(getLatestAssessment());
    trackEvent("training_dashboard_viewed");
  }, []);

  const nextDayToTrain =
    TRAINING_DAYS.find((d) => !completedDays.includes(d.day))?.day || 1;

  const currentScore = latestResult ? latestResult.overallScore : 68;

  return (
    <div className="min-h-screen bg-gym-bg text-gym-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gym-border/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gym-dark text-white text-xs font-semibold uppercase tracking-wider mb-3">
              <Dumbbell className="w-3.5 h-3.5 text-gym-accent" />
              {t.training.title}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gym-dark">
              {language === "id" ? "Dashboard Latihan Harian" : "Daily Workout Dashboard"}
            </h1>
            <p className="text-gym-muted mt-1 text-sm sm:text-base">
              {t.training.subtitle}
            </p>
          </div>

          <Link
            href={`/training/day/${nextDayToTrain}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gym-accent hover:bg-gym-accent-hover text-white font-bold text-sm shadow-sm transition-all hover:shadow-md active:scale-98"
            onClick={() => trackEvent("workout_cta_clicked", { day: nextDayToTrain })}
          >
            <span>
              {language === "id"
                ? `Lanjutkan Hari ${nextDayToTrain}`
                : `Continue Day ${nextDayToTrain}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gym-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gym-muted text-xs font-semibold uppercase tracking-wider">
              <span>{t.training.currentScore}</span>
              <Award className="w-4 h-4 text-gym-accent" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gym-dark">{currentScore}</span>
              <span className="text-xs text-gym-muted font-medium">/100</span>
            </div>
            <Link
              href="/assessment"
              className="mt-2 text-xs font-medium text-gym-accent hover:underline flex items-center gap-1"
            >
              <span>{language === "id" ? "Tes ulang" : "Retest score"}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gym-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gym-muted text-xs font-semibold uppercase tracking-wider">
              <span>{t.training.streak}</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gym-dark">
                {mounted ? streak : 3}
              </span>
              <span className="text-xs text-gym-muted font-medium">
                {t.training.days}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-gym-muted font-medium">
              {language === "id" ? "Konsistensi terjaga" : "Keep the momentum"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gym-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gym-muted text-xs font-semibold uppercase tracking-wider">
              <span>{t.training.completedExercises}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gym-dark">
                {mounted ? completedDays.length : 1}
              </span>
              <span className="text-xs text-gym-muted font-medium">
                /{TRAINING_DAYS.length}
              </span>
            </div>
            <div className="w-full bg-gym-border/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    ((mounted ? completedDays.length : 1) / TRAINING_DAYS.length) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gym-border shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gym-muted text-xs font-semibold uppercase tracking-wider">
              <span>{t.training.minutesTrained}</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gym-dark">
                {mounted ? minutesTrained : 12}
              </span>
              <span className="text-xs text-gym-muted font-medium">
                {t.training.minutes}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-gym-muted font-medium">
              {language === "id" ? "Repetisi aktif" : "Active repetitions"}
            </p>
          </div>
        </div>

        {/* Spotlight Next Workout */}
        {(() => {
          const featuredDay =
            TRAINING_DAYS.find((d) => d.day === nextDayToTrain) || TRAINING_DAYS[0];
          const isDone = completedDays.includes(featuredDay.day);
          return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gym-dark to-gym-charcoal text-white p-6 sm:p-8 shadow-xl">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-gym-accent/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-gym-accent text-white font-extrabold text-xs uppercase tracking-wider">
                      {language === "id" ? "Sesi Berikutnya" : "Next Workout"}
                    </span>
                    <span className="text-xs text-white/60 font-semibold">
                      {featuredDay.badge}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Day {featuredDay.day}:{" "}
                    {language === "id" ? featuredDay.titleId : featuredDay.titleEn}
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {language === "id" ? featuredDay.subtitleId : featuredDay.subtitleEn}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs text-gym-accent font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Framework: {featuredDay.framework}</span>
                  </div>
                </div>

                <Link
                  href={`/training/day/${featuredDay.day}`}
                  className="self-start md:self-center shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gym-dark font-extrabold text-sm hover:bg-gym-accent hover:text-white transition-all shadow-md active:scale-98"
                >
                  <span>
                    {isDone
                      ? language === "id"
                        ? "Ulangi Latihan"
                        : "Train Again"
                      : t.training.startWorkout}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })()}

        {/* 7-Day Program Track */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gym-dark">
                {t.training.programTitle}
              </h2>
              <p className="text-gym-muted text-xs sm:text-sm mt-0.5">
                {t.training.programSubtitle}
              </p>
            </div>
            <span className="text-xs font-bold text-gym-muted bg-white px-3 py-1.5 rounded-full border border-gym-border">
              7 Days · 10 Min/Day
            </span>
          </div>

          <div className="grid gap-3.5">
            {TRAINING_DAYS.map((day) => {
              const isCompleted = completedDays.includes(day.day);
              const isCurrent = day.day === nextDayToTrain;
              const title = language === "id" ? day.titleId : day.titleEn;
              const subtitle = language === "id" ? day.subtitleId : day.subtitleEn;
              const goal = language === "id" ? day.goalId : day.goalEn;

              return (
                <Link
                  key={day.day}
                  href={`/training/day/${day.day}`}
                  className={`group relative block p-5 rounded-2xl border transition-all duration-200 ${
                    isCurrent
                      ? "bg-white border-gym-accent/60 shadow-md ring-1 ring-gym-accent/40"
                      : isCompleted
                      ? "bg-white/90 border-gym-border hover:border-gym-dark/30 hover:shadow-sm"
                      : "bg-white/60 border-gym-border/80 hover:bg-white hover:border-gym-border hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Day Number Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shrink-0 transition-transform group-hover:scale-105 ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isCurrent
                            ? "bg-gym-accent text-white shadow-sm"
                            : "bg-gym-card text-gym-muted border border-gym-border"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <span>D{day.day}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-gym-dark group-hover:text-gym-accent transition-colors">
                            {title}
                          </h3>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gym-card text-gym-muted border border-gym-border/60">
                            {day.framework}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {t.training.completedBadge}
                            </span>
                          )}
                          {isCurrent && !isCompleted && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gym-accent/15 text-gym-accent">
                              {language === "id" ? "Aktif" : "Up Next"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gym-muted line-clamp-1">
                          {subtitle}
                        </p>
                        <p className="text-[11px] text-gym-dark/70 font-medium">
                          <span className="text-gym-muted">Goal:</span> {goal}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-xs text-gym-muted font-medium hidden md:inline">
                        {day.durationMinutes} min
                      </span>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gym-card group-hover:bg-gym-accent group-hover:text-white transition-colors text-gym-dark">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Philosophy Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gym-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gym-accent uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              {language === "id" ? "Kenapa Konsistensi Penting" : "Why Repetition Works"}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gym-dark">
              {language === "id"
                ? "Artikulasi adalah memori otot bicara, bukan teori."
                : "Articulation is vocal muscle memory, not passive theory."}
            </h3>
            <p className="text-xs sm:text-sm text-gym-muted leading-relaxed">
              {language === "id"
                ? "Membaca buku komunikasi tidak membuat seseorang otomatis lancar di panggung atau rapat. 10 menit latihan suara harian dengan umpan balik AI melatih otak Anda berpikir dan menyusun kalimat secara spontan."
                : "Reading communication books never guarantees composure in high-stakes meetings. 10 minutes of vocal repetition with AI coaching reprograms how your mind structures thoughts under spontaneous pressure."}
            </p>
          </div>

          <Link
            href="/assessment"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gym-dark font-bold text-xs sm:text-sm text-gym-dark hover:bg-gym-dark hover:text-white transition-colors"
          >
            <span>
              {language === "id"
                ? "Ambil Tes Artikulasi Gratis"
                : "Take Free Test"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
