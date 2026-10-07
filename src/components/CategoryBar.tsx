"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface CategoryBarProps {
  label: string;
  weight: number;
  score: number;
  prevScore?: number;
  feedback?: string;
}

export default function CategoryBar({
  label,
  weight,
  score,
  prevScore,
  feedback,
}: CategoryBarProps) {
  const delta = prevScore !== undefined ? score - prevScore : undefined;

  return (
    <div className="rounded-2xl border border-gym-border/80 bg-white p-4 transition-all hover:border-gym-dark/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gym-dark">{label}</span>
          <span className="rounded-full bg-gym-surface px-2 py-0.5 text-[10px] font-semibold text-gym-muted">
            {weight}% weight
          </span>
        </div>

        <div className="flex items-center gap-2">
          {prevScore !== undefined && (
            <span className="text-xs font-mono text-gym-muted">
              {prevScore} →
            </span>
          )}
          <span className="font-mono text-base font-extrabold text-gym-dark">
            {score}
          </span>
          {delta !== undefined && (
            <span
              className={`inline-flex items-center text-xs font-bold ${
                delta > 0
                  ? "text-emerald-600"
                  : delta < 0
                  ? "text-rose-600"
                  : "text-gym-muted"
              }`}
            >
              {delta > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3" />
                  +{delta}
                </>
              ) : delta < 0 ? (
                <>
                  <ArrowDownRight className="h-3 w-3" />
                  {delta}
                </>
              ) : (
                <>
                  <Minus className="h-3 w-3" />
                  0
                </>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gym-surface">
        {prevScore !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-gym-muted z-10 opacity-70"
            style={{ left: `${Math.min(100, Math.max(0, prevScore))}%` }}
            title={`Previous: ${prevScore}`}
          />
        )}
        <div
          className="h-full rounded-full bg-gym-dark transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {feedback && (
        <p className="mt-2 text-xs text-gym-muted leading-relaxed">
          {feedback}
        </p>
      )}
    </div>
  );
}
