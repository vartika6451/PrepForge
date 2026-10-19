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
  misunderstanding?: string;
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

export interface InterviewQuestionResponse {
  slug: string;
  draftAnswer: string;
  hintsUsed: number;
  solutionRevealed: boolean;
  confidence?: ConfidenceLevel;
  completedAt?: string;
}

export interface InterviewRoundSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  questionSlugs: string[];
  currentQuestionIndex: number;
  status: "in_progress" | "completed" | "abandoned";
  responses: Record<string, InterviewQuestionResponse>;
}

export interface InterviewRoundSummary {
  roundId: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  attemptedCount: number;
  completedCount: number;
  confidenceDistribution: Record<ConfidenceLevel, number>;
  topicsNeedingAttention: Array<{
    topicId: WebDevTopicId;
    questionTitle: string;
    slug: string;
    confidence?: ConfidenceLevel;
  }>;
  recommendedRevisionSlugs: string[];
}

export interface TopicInsight {
  topicId: WebDevTopicId;
  topicName: string;
  totalAvailable: number;
  attempted: number;
  completed: number;
  needsRevision: number;
  confidenceBreakdown: Record<ConfidenceLevel, number>;
  observation?: string;
}

export interface LearningInsights {
  totalQuestions: number;
  totalAttempted: number;
  totalCompleted: number;
  totalNeedsRevision: number;
  totalBookmarks: number;
  totalMistakes: number;
  dueRevisionCount: number;
  modeDistribution: Record<
    PracticeMode,
    { total: number; attempted: number; completed: number }
  >;
  topicInsights: TopicInsight[];
  weakAreas: Array<{
    topicId: WebDevTopicId;
    topicName: string;
    text: string;
    sampleSize: number;
  }>;
  mistakeCategories: Array<{
    category: MistakeCategory;
    count: number;
    label: string;
  }>;
  recentActivity: Array<{
    slug: string;
    title: string;
    mode: PracticeMode;
    topic: WebDevTopicId;
    timestamp: string;
    status: QuestionStatus;
    confidence?: ConfidenceLevel;
  }>;
}

export interface UserPracticeStore {
  version: number;
  attempts: Record<string, QuestionAttempt>;
  bookmarks: string[];
  mistakeJournal: MistakeEntry[];
  revisions: Record<string, RevisionItem>;
  lastVisitedSlug?: string;
  lastUnfinishedSlug?: string;
  activeInterviewSession?: InterviewRoundSession;
  pastInterviewSessions?: InterviewRoundSession[];
  updatedAt: string;
}

// Backwards compatibility
export interface UserPracticeProgress {
  lastVisitedSlug?: string;
  completedSlugs: string[];
  updatedAt: string;
}
