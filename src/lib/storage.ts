import { AssessmentResult, Language, UserProgress } from "./types";

const STORAGE_KEYS = {
  LANGUAGE: "goc_language",
  LATEST_ASSESSMENT: "goc_latest_assessment",
  PREVIOUS_ASSESSMENT: "goc_previous_assessment",
  STREAK: "goc_streak",
  LAST_TRAINED_DATE: "goc_last_trained_date",
  COMPLETED_DAYS: "goc_completed_days",
  MINUTES_TRAINED: "goc_minutes_trained",
  RETRY_MODE: "goc_retry_mode",
};

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "id";
  const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  return stored === "en" ? "en" : "id";
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function saveAssessmentResult(result: AssessmentResult): void {
  if (typeof window === "undefined") return;

  const existingLatest = getLatestAssessment();
  if (existingLatest && existingLatest.id !== result.id) {
    localStorage.setItem(STORAGE_KEYS.PREVIOUS_ASSESSMENT, JSON.stringify(existingLatest));
  }

  localStorage.setItem(STORAGE_KEYS.LATEST_ASSESSMENT, JSON.stringify(result));

  const currentMinutes = getMinutesTrained();
  const addedMinutes = Math.max(1, Math.round(result.metrics.durationSeconds / 60));
  localStorage.setItem(STORAGE_KEYS.MINUTES_TRAINED, (currentMinutes + addedMinutes).toString());
  updateStreak();
}

export function getLatestAssessment(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.LATEST_ASSESSMENT);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getPreviousAssessment(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.PREVIOUS_ASSESSMENT);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAssessmentHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.LATEST_ASSESSMENT);
  localStorage.removeItem(STORAGE_KEYS.PREVIOUS_ASSESSMENT);
  localStorage.removeItem(STORAGE_KEYS.RETRY_MODE);
}

export function setRetryMode(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) {
    localStorage.setItem(STORAGE_KEYS.RETRY_MODE, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.RETRY_MODE);
  }
}

export function isRetryMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.RETRY_MODE) === "true";
}

export function getMinutesTrained(): number {
  if (typeof window === "undefined") return 12;
  const val = localStorage.getItem(STORAGE_KEYS.MINUTES_TRAINED);
  return val ? parseInt(val, 10) : 12;
}

export function getCompletedDays(): number[] {
  if (typeof window === "undefined") return [1];
  const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_DAYS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function markDayCompleted(day: number): void {
  if (typeof window === "undefined") return;
  const list = getCompletedDays();
  if (!list.includes(day)) {
    list.push(day);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(list));
    updateStreak();
    const currentMinutes = getMinutesTrained();
    localStorage.setItem(STORAGE_KEYS.MINUTES_TRAINED, (currentMinutes + 10).toString());
  }
}

export function getStreak(): number {
  if (typeof window === "undefined") return 3;
  const val = localStorage.getItem(STORAGE_KEYS.STREAK);
  return val ? parseInt(val, 10) : 3;
}

export function updateStreak(): number {
  if (typeof window === "undefined") return 1;
  const todayStr = new Date().toISOString().slice(0, 10);
  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_TRAINED_DATE);
  let streak = getStreak();

  if (!lastDate) {
    streak = 1;
  } else if (lastDate === todayStr) {
    return streak;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    if (lastDate === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
  localStorage.setItem(STORAGE_KEYS.LAST_TRAINED_DATE, todayStr);
  return streak;
}

export function getUserProgress(): UserProgress {
  return {
    currentStreak: getStreak(),
    completedDays: getCompletedDays(),
    totalMinutesTrained: getMinutesTrained(),
    history: [],
    latestAssessment: getLatestAssessment() || undefined,
    previousAssessment: getPreviousAssessment() || undefined,
  };
}
