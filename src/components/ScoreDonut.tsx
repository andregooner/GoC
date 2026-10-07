"use client";

import React from "react";

interface ScoreDonutProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  delta?: number;
}

export default function ScoreDonut({
  score,
  size = 200,
  strokeWidth = 14,
  delta,
}: ScoreDonutProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getDescriptor = (s: number) => {
    if (s >= 85) return { label: "Elite Communicator", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    if (s >= 75) return { label: "Strong Communicator", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (s >= 65) return { label: "Good Foundation", bg: "bg-amber-50 text-amber-800 border-amber-200" };
    if (s >= 50) return { label: "Developing Foundation", bg: "bg-orange-50 text-orange-800 border-orange-200" };
    return { label: "Needs Focused Reps", bg: "bg-rose-50 text-rose-800 border-rose-200" };
  };

  const descriptor = getDescriptor(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E9E5DD"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EA580C"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-gym-dark leading-none">
            {clampedScore}
          </span>
          <span className="text-xs font-bold text-gym-muted mt-1 uppercase tracking-wider">
            / 100
          </span>
          {delta !== undefined && delta !== 0 && (
            <span
              className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                delta > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
        </div>
      </div>

      <div className={`mt-4 inline-flex items-center rounded-full px-4 py-1 text-xs font-bold border ${descriptor.bg}`}>
        {descriptor.label}
      </div>
    </div>
  );
}