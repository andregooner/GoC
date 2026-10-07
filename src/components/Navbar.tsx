"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { Dumbbell, Menu, X, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (ctaName: string) => {
    trackEvent("landing_cta_clicked", { cta: ctaName, location: "navbar" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gym-border/80 bg-gym-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-98"
          onClick={() => handleNavClick("logo_home")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gym-dark text-white shadow-sm transition-colors group-hover:bg-gym-accent">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-gym-dark text-lg sm:text-xl block leading-tight">
              Gym of Communication
            </span>
            <span className="text-[11px] font-medium text-gym-muted hidden sm:block">
              {t.nav.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-gym-muted hover:text-gym-dark transition-colors"
          >
            {t.nav.howItWorks}
          </Link>
          <Link
            href="/#curriculum"
            className="text-sm font-medium text-gym-muted hover:text-gym-dark transition-colors"
          >
            {t.nav.curriculum}
          </Link>
          <Link
            href="/training"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith("/training")
                ? "text-gym-accent font-semibold"
                : "text-gym-muted hover:text-gym-dark"
            }`}
          >
            {t.nav.training}
          </Link>

          <div className="flex items-center rounded-full border border-gym-border bg-white p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`rounded-full px-2.5 py-1 transition-all ${
                language === "id"
                  ? "bg-gym-dark text-white shadow-sm"
                  : "text-gym-muted hover:text-gym-dark"
              }`}
              title="Bahasa Indonesia"
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2.5 py-1 transition-all ${
                language === "en"
                  ? "bg-gym-dark text-white shadow-sm"
                  : "text-gym-muted hover:text-gym-dark"
              }`}
              title="English"
            >
              🇬🇧 EN
            </button>
          </div>

          <Link
            href="/assessment"
            onClick={() => handleNavClick("navbar_take_test")}
            className="inline-flex items-center gap-1.5 rounded-full bg-gym-accent px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-gym-accentHover hover:shadow active:scale-98"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.nav.test}</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center rounded-full border border-gym-border bg-white p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`rounded-full px-2 py-0.5 ${
                language === "id" ? "bg-gym-dark text-white" : "text-gym-muted"
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2 py-0.5 ${
                language === "en" ? "bg-gym-dark text-white" : "text-gym-muted"
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gym-dark hover:bg-gym-surface"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gym-border bg-gym-bg px-4 py-4 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => handleNavClick("mobile_how_it_works")}
            className="block text-sm font-medium text-gym-dark py-2"
          >
            {t.nav.howItWorks}
          </Link>
          <Link
            href="/#curriculum"
            onClick={() => handleNavClick("mobile_curriculum")}
            className="block text-sm font-medium text-gym-dark py-2"
          >
            {t.nav.curriculum}
          </Link>
          <Link
            href="/training"
            onClick={() => handleNavClick("mobile_training")}
            className="block text-sm font-medium text-gym-dark py-2"
          >
            {t.nav.training}
          </Link>
          <div className="pt-2">
            <Link
              href="/assessment"
              onClick={() => handleNavClick("mobile_take_test")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gym-accent px-4 py-3 text-sm font-bold text-white shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.nav.test}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
