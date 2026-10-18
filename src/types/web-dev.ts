export type PracticeMode = "explain" | "debug" | "build";

export type QuestionDifficulty = "foundation" | "applied" | "challenge";

export type WebDevTopicId =
  | "javascript-typescript"
  | "react"
  | "browser-css"
  | "backend-apis"
  | "databases-security"
  | "performance-testing";

export type QuestionStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_revision";

export type ConfidenceLevel = "independent" | "hint" | "need_practice";

export type MistakeCategory =
  | "conceptual"
  | "approach"
  | "edge_case"
  | "bug"
  | "explanation"
  | "other";

export interface WebDevTopicMeta {
  id: WebDevTopicId;
  name: string;
  shortDescription: string;
  iconName: "Code2" | "Layers" | "Globe" | "Server" | "Database" | "Gauge";
}

export interface RubricCriterion {
  criteria: string;
  weight?: string;
  description?: string;
}

export interface QuestionReference {
  title: string;
  url: string;
}

export interface WebDevQuestion {
  id: string;
  slug: string;
  title: string;
  summary: string;
  topic: WebDevTopicId;
  mode: PracticeMode;
  difficulty: QuestionDifficulty;
  estimatedMinutes: number;
  tags: string[];
  skillsTested: string[];
  scenario: string;
  requirements: string[];
  starterCode?: string;
  programmingLanguage?: string;
  hints: string[];
  evaluationRubric?: RubricCriterion[];
  referenceAnswer?: string;
  commonMistakes?: string[];
  followUpQuestion?: string;
  followUpAnswer?: string;
  references?: QuestionReference[];
}

export interface MistakeEntry {
  id: string;
  questionSlug: string;
  questionTitle: string;
  category: MistakeCategory;
  mistake: string;
  misunderstanding: string;
  keyTakeaway: string;
  createdAt: string;
}

export interface AttemptHistoryItem {
  timestamp: string;
  confidence: ConfidenceLevel;
  hintsUsed: number;
  solutionRevealed: boolean;
  rubricCount: number;
}

export interface QuestionAttempt {
  questionSlug: string;
  status: QuestionStatus;
  draftAnswer: string;
  rootCauseDraft?: string;
  fixDraft?: string;
  hintsRevealed: number[];
  solutionRevealed: boolean;
  checkedRubricIndices: number[];
  followUpRevealed: boolean;
  confidence?: ConfidenceLevel;
  lastAttemptedAt: string;
  attemptCount: number;
  history: AttemptHistoryItem[];
}

export interface RevisionItem {
  questionSlug: string;
  dueDate: string; // ISO date string
  intervalDays: number;
  consecutiveSuccesses: number;
  lastConfidence: ConfidenceLevel;
  lastReviewedAt: string;
}

export interface UserPracticeStore {
  version: number;
  attempts: Record<string, QuestionAttempt>;
  bookmarks: string[];
  mistakeJournal: MistakeEntry[];
  revisions: Record<string, RevisionItem>;
  lastVisitedSlug?: string;
  lastUnfinishedSlug?: string;
  updatedAt: string;
}

// Backwards compatibility
export interface UserPracticeProgress {
  lastVisitedSlug?: string;
  completedSlugs: string[];
  updatedAt: string;
}
