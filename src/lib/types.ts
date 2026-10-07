export type Language = "id" | "en";

export interface FillerCount {
  word: string;
  count: number;
}

export interface SpeechMetrics {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  fillerTotal: number;
  fillerBreakdown: Record<string, number>;
  fillerRate: number; // (fillers / total words) * 100
  repetitions: string[];
  longPausesCount: number; // pauses > 1.5s
  responseLengthClass: "Too short" | "Good" | "Too long";
}

export interface CategoryScore {
  score: number; // 0 - 100
  feedback: string;
}

export interface CoachEvaluation {
  clarity: CategoryScore;
  conciseness: CategoryScore;
  structure: CategoryScore;
  fillerControlAssessment: string;
  fillerControlScore: number;
  paceAssessment: string;
  paceScore: number;
  vocabulary: CategoryScore;
  mainStrength: string;
  biggestOpportunity: string;
  coachFeedback: string;
  betterApproach: string;
  exampleImprovedAnswer: string;
  nextExercise: string;
  summarySentence: string;
}

export interface AssessmentResult {
  id: string;
  timestamp: number;
  question: string;
  language: Language;
  transcript: string;
  metrics: SpeechMetrics;
  categoryScores: {
    clarity: number;
    conciseness: number;
    structure: number;
    fillerControl: number;
    pace: number;
    vocabulary: number;
  };
  overallScore: number;
  coach: CoachEvaluation;
  isDemo?: boolean;
}

export interface TrainingDay {
  day: number;
  titleId: string;
  titleEn: string;
  subtitleId: string;
  subtitleEn: string;
  badge: string;
  durationMinutes: number;
  goalId: string;
  goalEn: string;
  framework: string;
  learnContentId: string[];
  learnContentEn: string[];
  exampleBadId: string;
  exampleBadEn: string;
  exampleGoodId: string;
  exampleGoodEn: string;
  challengeQuestionId: string;
  challengeQuestionEn: string;
  targetSeconds: { min: number; max: number };
}

export interface UserProgress {
  currentStreak: number;
  completedDays: number[];
  totalMinutesTrained: number;
  history: AssessmentResult[];
  latestAssessment?: AssessmentResult;
  previousAssessment?: AssessmentResult;
}