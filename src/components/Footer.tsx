"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, Shield, Mic, Globe } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gym-border bg-white text-gym-dark mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gym-dark text-white">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">Gym of Communication</span>
            </div>
            <p className="text-xs text-gym-muted max-w-md leading-relaxed">
              {t.nav.tagline}. Train the human skills AI can&apos;t replace. Built for Indonesian professionals, founders, managers, and thinkers who refuse to be passive communicators.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] text-gym-muted">
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-gym-accent" /> Bahasa Indonesia & English
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Mic className="h-3.5 w-3.5 text-gym-accent" /> Verbatim Speech Engine
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gym-muted">Gym Flow</h4>
            <ul className="space-y-1.5 text-xs text-gym-muted">
              <li>
                <Link href="/assessment" className="hover:text-gym-accent transition-colors">
                  {t.nav.test}
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-gym-accent transition-colors">
                  Articulation Score
                </Link>
              </li>
              <li>
                <Link href="/training" className="hover:text-gym-accent transition-colors">
                  7-Day Gym Workout
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gym-muted">Privacy & Models</h4>
            <div className="space-y-1.5 text-xs text-gym-muted">
              <div className="flex items-start gap-1.5">
                <Shield className="h-3.5 w-3.5 text-gym-success shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">
                  Audio is processed ephemerally and not permanently retained.
                </span>
              </div>
              <div className="text-[11px] text-gym-muted pt-1">
                Models: <span className="font-mono text-gym-dark">gemini-3.5-transcribe</span> & <span className="font-mono text-gym-dark">gemini-3.8-flash</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gym-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gym-muted gap-3">
          <p>© {new Date().getFullYear()} Gym of Communication. All rights reserved.</p>
          <p className="italic">“The world is training AI. We train humans.”</p>
        </div>
      </div>
    </footer>
  );
}
