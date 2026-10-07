"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Key, X } from "lucide-react";

export default function DemoBanner({ isDemo }: { isDemo?: boolean }) {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHasApiKey(data.configured))
      .catch(() => setHasApiKey(false));
  }, []);

  if (dismissed) return null;

  if (isDemo) {
    return (
      <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-sm flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              Mode Demo Aktif (High-Fidelity Sample)
            </p>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              Hasil di bawah ini menggunakan data asesmen realistis untuk mereview alur UI/UX, metrik percakapan, dan umpan balik pelatih secara instan.
              {hasApiKey === false && " Untuk analisis rekaman mikrofon live Anda, pastikan GEMINI_API_KEY sudah disetel di .env.local."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-amber-700 hover:text-amber-950 p-1"
          title="Tutup pemberitahuan"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (hasApiKey === false) {
    return (
      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/90 p-4 text-xs text-blue-900 shadow-sm flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Key className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              Konfigurasi API Gemini
            </p>
            <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
              Server belum mendeteksi <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code>.
              Aplikasi berjalan mulus menggunakan <strong>Mode Demo</strong> interaktif sehingga Anda tetap bisa menguji seluruh alur, membandingkan skor repetisi, dan menjalankan program 7 hari tanpa hambatan.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-blue-700 hover:text-blue-950 p-1"
          title="Tutup pemberitahuan"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
