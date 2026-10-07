export type AnalyticsEvent =
  | "landing_cta_clicked"
  | "assessment_started"
  | "recording_started"
  | "assessment_completed"
  | "retry_started"
  | "training_started"
  | "exercise_completed"
  | "training_dashboard_viewed"
  | "workout_cta_clicked";

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, any>
): void {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    properties: properties || {},
  };

  if (process.env.NODE_ENV !== "production") {
    console.log(`[GymAnalytics] ${event}`, payload);
  }

  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("goc_analytics_log") || "[]");
      existing.unshift(payload);
      if (existing.length > 50) existing.length = 50;
      localStorage.setItem("goc_analytics_log", JSON.stringify(existing));
    } catch {}
  }
}
