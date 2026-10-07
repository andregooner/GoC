"use client";

import React, { useState, useEffect } from "react";
import { Dumbbell, Activity, Brain, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function StagedLoading() {
  const { t } = useLanguage();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    {
      title: t.loading.step1,
      icon: Activity,
      subtitle: "Memproses audio verbatim & mendeteksi filler kata",
      duration: 3200,
    },
    {
      title: t.loading.step2,
      icon: Brain,
      subtitle: "Menghitung metrik WPM, jeda hening, & struktur argumen",
      duration: 4000,
    },
    {
      title: t.loading.step3,
      icon: Dumbbell,
      subtitle: "Menyusun evaluasi personal, perbaikan kalimat & framework PREP",
      duration: 5000,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(1), stages[0].duration);
    const timer2 = setTimeout(() => setCurrentStage(2), stages[0].duration + stages[1].duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-gym-border bg-white p-8 sm:p-10 text-center shadow-lg my-8">
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gym-surface text-gym-accent">
        <div className="absolute inset-0 rounded-2xl border-2 border-gym-accent animate-ping opacity-25" />
        <Dumbbell className="h-10 w-10 animate-pulse text-gym-accent" />
      </div>

      <h3 className="text-xl font-extrabold text-gym-dark mb-2">
        {stages[currentStage].title}
      </h3>
      <p className="text-xs text-gym-muted mb-8 max-w-xs mx-auto">
        {stages[currentStage].subtitle}
      </p>

      <div className="space-y-3 text-left">
        {stages.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isActive = currentStage === idx;
          const Icon = stage.icon;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 rounded-xl p-3 border transition-all ${
                isActive
                  ? "border-gym-accent/40 bg-gym-accentLight/60 shadow-sm"
                  : isDone
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-gym-border/40 bg-transparent opacity-40"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? "bg-gym-accent text-white"
                    : isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-gym-surface text-gym-muted"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className={`h-4 w-4 ${isActive ? "animate-pulse" : ""}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold leading-tight ${isActive ? "text-gym-dark" : "text-gym-muted"}`}>
                  {stage.title}
                </p>
                <span className="text-[10px] text-gym-muted">Tahap {idx + 1} dari 3</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-gym-border/60">
        <p className="text-[11px] text-gym-muted italic">
          Model: <span className="font-mono text-gym-dark">gemini-3.5-transcribe</span> → <span className="font-mono text-gym-dark">gemini-3.8-flash</span>
        </p>
      </div>
    </div>
  );
}