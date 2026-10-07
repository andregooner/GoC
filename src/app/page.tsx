"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mic,
  Activity,
  Award,
  RotateCcw,
  Compass,
  Zap,
  Layers,
  Volume2,
  Flame,
  MessageSquare,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function LandingPage() {
  const { t } = useLanguage();

  const handleCtaClick = (ctaName: string) => {
    trackEvent("landing_cta_clicked", { cta: ctaName });
  };

  const pillarIcons = [
    Compass,
    Zap,
    Layers,
    MessageSquare,
    Volume2,
    Flame,
  ];

  const stepIcons = [
    Mic,
    Activity,
    Award,
    RotateCcw,
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#E9E5DD_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      {/* SECTION 1: HERO */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gym-border bg-white/80 px-4 py-1.5 text-xs font-semibold text-gym-muted shadow-sm backdrop-blur-sm mb-8 animate-pulseSubtle">
          <span className="h-2 w-2 rounded-full bg-gym-accent" />
          <span>The Gym for Communication</span>
          <span className="text-gym-border">|</span>
          <span className="text-gym-dark font-bold">Bahasa Indonesia & English</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-gym-dark leading-[1.08] max-w-4xl mx-auto mb-6">
          {t.landing.heroTitle}
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gym-accent max-w-3xl mx-auto mb-6 tracking-tight">
          {t.landing.heroSubtitle}
        </p>

        <p className="text-base sm:text-lg text-gym-muted max-w-2xl mx-auto leading-relaxed mb-10">
          {t.landing.heroCopy}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <Link
            href="/assessment"
            onClick={() => handleCtaClick("hero_primary")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gym-accent px-8 py-4 text-base font-extrabold text-white shadow-lg hover:bg-gym-accentHover hover:shadow-xl active:scale-98 transition-all"
          >
            <Sparkles className="h-5 w-5" />
            <span>{t.landing.ctaPrimary}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <a
            href="#how-it-works"
            onClick={() => handleCtaClick("hero_see_how_it_works")}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-gym-border bg-white px-7 py-4 text-base font-bold text-gym-dark hover:bg-gym-surface transition-all active:scale-98"
          >
            <span>{t.landing.ctaSecondary}</span>
          </a>
        </div>

        <p className="text-xs font-medium text-gym-muted">
          {t.landing.badgeTime}
        </p>
      </section>

      {/* SECTION 2: COMMON PROBLEMS */}
      <section className="border-y border-gym-border bg-white/70 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gym-dark mb-4">
              {t.landing.problemsTitle}
            </h2>
            <p className="text-sm sm:text-base text-gym-muted">
              {t.landing.problemsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.landing.problems.map((problem, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-gym-border bg-gym-bg/80 p-6 transition-all hover:bg-white hover:border-gym-accent/50 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gym-surface text-gym-accent font-mono text-xs font-bold group-hover:bg-gym-accent group-hover:text-white transition-colors">
                    0{idx + 1}
                  </div>
                  <p className="text-sm font-semibold text-gym-dark leading-snug">
                    {problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-gym-accent mb-2 block">
              Gym Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gym-dark mb-4">
              {t.landing.howItWorksTitle}
            </h2>
            <p className="text-sm sm:text-base text-gym-muted">
              {t.landing.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.landing.steps.map((step, idx) => {
              const StepIcon = stepIcons[idx];
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-gym-border bg-white p-6 shadow-sm flex flex-col justify-between hover:border-gym-accent/40 transition-all hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gym-surface text-gym-accent">
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-2xl font-black text-gym-border">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-gym-dark mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gym-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gym-border/40 text-[11px] font-bold text-gym-accent flex items-center gap-1">
                    <span>Step {idx + 1}</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT WE TRAIN (6 PILLARS) */}
      <section id="curriculum" className="border-t border-gym-border bg-white/60 py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-gym-accent mb-2 block">
              The 6 Core Muscles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gym-dark mb-4">
              {t.landing.whatWeTrainTitle}
            </h2>
            <p className="text-sm sm:text-base text-gym-muted">
              {t.landing.whatWeTrainSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.landing.pillars.map((pillar, idx) => {
              const Icon = pillarIcons[idx];
              return (
                <div
                  key={idx}
                  className="group rounded-3xl border border-gym-border bg-white p-7 shadow-sm transition-all hover:border-gym-dark hover:shadow-md"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gym-surface text-gym-dark group-hover:bg-gym-accent group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-gym-dark mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gym-muted leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: PHILOSOPHICAL MANIFESTO */}
      <section className="py-24 sm:py-28 bg-gym-dark text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gym-accent mb-6">
            Manifesto
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            {t.landing.philosophyTitle}
          </h2>
          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            {t.landing.philosophyCopy}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 border-t border-zinc-800 pt-8 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gym-accent" /> Latihan &gt; Teori Pasif
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gym-accent" /> Metrik Obyektif
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gym-accent" /> Repetisi Mengasah Refleks
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="py-24 sm:py-28 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl border border-gym-border bg-white p-10 sm:p-14 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gym-dark mb-4">
              {t.landing.finalCtaTitle}
            </h2>
            <p className="text-sm sm:text-base text-gym-muted max-w-md mx-auto mb-8">
              {t.landing.finalCtaNote}
            </p>
            <Link
              href="/assessment"
              onClick={() => handleCtaClick("bottom_cta_test")}
              className="inline-flex items-center gap-2 rounded-full bg-gym-accent px-8 py-4 text-base font-extrabold text-white shadow-lg hover:bg-gym-accentHover active:scale-98 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              <span>{t.landing.finalCtaBtn}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}