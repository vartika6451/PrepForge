import { useSyncExternalStore } from "react";
import {
  UserPracticeStore,
  QuestionAttempt,
  QuestionStatus,
  ConfidenceLevel,
  MistakeEntry,
  RevisionItem,
  UserPracticeProgress,
} from "@/types/web-dev";

const STORAGE_KEY = "prepforge_webdev_store_v1";
const LEGACY_STORAGE_KEY = "prepforge_webdev_progress";
const EVENT_NAME = "prepforge_webdev_store_change";

const emptyStore: UserPracticeStore = {
  version: 1,
  attempts: {},
  bookmarks: [],
  mistakeJournal: [],
  revisions: {},
  pastInterviewSessions: [],
  updatedAt: "",
};

let cachedStore: UserPracticeStore = emptyStore;
let isLoaded = false;

function createDefaultAttempt(slug: string): QuestionAttempt {
  return {
    questionSlug: slug,
    status: "not_started",
    draftAnswer: "",
    hintsRevealed: [],
    solutionRevealed: false,
    checkedRubricIndices: [],
    followUpRevealed: false,
    lastAttemptedAt: "",
    attemptCount: 0,
    history: [],
  };
}

function readStorage(): UserPracticeStore {
  if (typeof window === "undefined") return emptyStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) {
        return {
          version: 1,
          attempts: parsed.attempts || {},
          bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
          mistakeJournal: Array.isArray(parsed.mistakeJournal) ? parsed.mistakeJournal : [],
          revisions: parsed.revisions || {},
          lastVisitedSlug: parsed.lastVisitedSlug,
          lastUnfinishedSlug: parsed.lastUnfinishedSlug,
          activeInterviewSession: parsed.activeInterviewSession,
          pastInterviewSessions: Array.isArray(parsed.pastInterviewSessions) ? parsed.pastInterviewSessions : [],
          updatedAt: parsed.updatedAt || "",
        };
      }
    }

    // Auto-migrate from Phase 1 legacy storage if available
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      const migratedAttempts: Record<string, QuestionAttempt> = {};
      if (Array.isArray(legacy.completedSlugs)) {
        legacy.completedSlugs.forEach((slug: string) => {
          migratedAttempts[slug] = {
            ...createDefaultAttempt(slug),
            status: "completed",
            confidence: "independent",
          };
        });
      }
      return {
        version: 1,
        attempts: migratedAttempts,
        bookmarks: [],
        mistakeJournal: [],
        revisions: {},
        lastVisitedSlug: legacy.lastVisitedSlug,
        updatedAt: legacy.updatedAt || new Date().toISOString(),
      };
    }

    return emptyStore;
  } catch (e) {
    console.error("Error reading web dev practice store from localStorage:", e);
    return emptyStore;
  }
}

export function getUserPracticeStore(): UserPracticeStore {
  if (typeof window === "undefined") return emptyStore;
  if (!isLoaded) {
    cachedStore = readStorage();
    isLoaded = true;
  }
  return cachedStore;
}

export function saveUserPracticeStore(store: UserPracticeStore): void {
  if (typeof window === "undefined") return;
  try {
    store.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    cachedStore = store;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: store }));
  } catch (e) {
    console.error("Failed to save practice store to localStorage:", e);
  }
}

export function subscribeToStore(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    cachedStore = readStorage();
    listener();
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

let hasHydrated = false;

function subscribeHydrate(onStoreChange: () => void) {
  if (!hasHydrated) {
    hasHydrated = true;
    queueMicrotask(() => {
      onStoreChange();
    });
  }
  return () => {};
}

function getHydrateSnapshot(): boolean {
  return hasHydrated;
}

function getServerHydrateSnapshot(): boolean {
  return false;
}

function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydrate,
    getHydrateSnapshot,
    getServerHydrateSnapshot
  );
}

export function useUserPracticeStore(): UserPracticeStore {
  const store = useSyncExternalStore(
    subscribeToStore,
    getUserPracticeStore,
    () => emptyStore
  );
  const isHydrated = useIsHydrated();
  return isHydrated ? store : emptyStore;
}

// ---------------------------------------------------------------------
// Attempt & Draft Operations
// ---------------------------------------------------------------------

export function getQuestionAttempt(slug: string): QuestionAttempt {
  const store = getUserPracticeStore();
  return store.attempts[slug] || createDefaultAttempt(slug);
}

export function saveQuestionDraft(
  slug: string,
  drafts: {
    draftAnswer?: string;
    rootCauseDraft?: string;
    fixDraft?: string;
  }
): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  const nextStatus: QuestionStatus =
    current.status === "completed" ? "completed" : "in_progress";

  const nextAttempt: QuestionAttempt = {
    ...current,
    status: nextStatus,
    draftAnswer: drafts.draftAnswer !== undefined ? drafts.draftAnswer : current.draftAnswer,
    rootCauseDraft: drafts.rootCauseDraft !== undefined ? drafts.rootCauseDraft : current.rootCauseDraft,
    fixDraft: drafts.fixDraft !== undefined ? drafts.fixDraft : current.fixDraft,
    lastAttemptedAt: new Date().toISOString(),
  };

  const nextStore: UserPracticeStore = {
    ...store,
    attempts: {
      ...store.attempts,
      [slug]: nextAttempt,
    },
    lastVisitedSlug: slug,
    lastUnfinishedSlug: nextStatus === "in_progress" ? slug : store.lastUnfinishedSlug,
  };

  saveUserPracticeStore(nextStore);
}

export function revealQuestionHint(slug: string, hintIndex: number): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  if (current.hintsRevealed.includes(hintIndex)) return;

  const nextRevealed = [...current.hintsRevealed, hintIndex];
  const nextAttempt: QuestionAttempt = {
    ...current,
    status: current.status === "completed" ? "completed" : "in_progress",
    hintsRevealed: nextRevealed,
    lastAttemptedAt: new Date().toISOString(),
  };

  saveUserPracticeStore({
    ...store,
    attempts: { ...store.attempts, [slug]: nextAttempt },
    lastUnfinishedSlug: nextAttempt.status === "in_progress" ? slug : store.lastUnfinishedSlug,
  });
}

export function revealQuestionSolution(slug: string): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  const nextAttempt: QuestionAttempt = {
    ...current,
    solutionRevealed: true,
    lastAttemptedAt: new Date().toISOString(),
  };

  saveUserPracticeStore({
    ...store,
    attempts: { ...store.attempts, [slug]: nextAttempt },
  });
}

export function toggleRubricCheck(slug: string, criterionIndex: number): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  const exists = current.checkedRubricIndices.includes(criterionIndex);
  const nextChecked = exists
    ? current.checkedRubricIndices.filter((i) => i !== criterionIndex)
    : [...current.checkedRubricIndices, criterionIndex];

  const nextAttempt: QuestionAttempt = {
    ...current,
    checkedRubricIndices: nextChecked,
    lastAttemptedAt: new Date().toISOString(),
  };

  saveUserPracticeStore({
    ...store,
    attempts: { ...store.attempts, [slug]: nextAttempt },
  });
}

export function revealQuestionFollowUp(slug: string): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  const nextAttempt: QuestionAttempt = {
    ...current,
    followUpRevealed: true,
    lastAttemptedAt: new Date().toISOString(),
  };

  saveUserPracticeStore({
    ...store,
    attempts: { ...store.attempts, [slug]: nextAttempt },
  });
}

export function resetQuestionAttempt(slug: string): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  const nextAttempt: QuestionAttempt = {
    ...createDefaultAttempt(slug),
    attemptCount: current.attemptCount + 1,
    history: current.history, // preserve prior history
  };

  saveUserPracticeStore({
    ...store,
    attempts: { ...store.attempts, [slug]: nextAttempt },
  });
}

// ---------------------------------------------------------------------
// Self-Assessment & Revision Scheduling
// ---------------------------------------------------------------------

export function submitSelfAssessment(
  slug: string,
  confidence: ConfidenceLevel
): void {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);

  // 1. Calculate next revision interval (Heuristics)
  // "Need more practice" -> 1 day
  // "Needed a hint" -> 3 days
  // "Solved independently" -> 7 days (or previous interval * 2)
  const existingRevision = store.revisions[slug];
  let intervalDays = 1;
  let consecutiveSuccesses = 0;

  if (confidence === "need_practice") {
    intervalDays = 1;
    consecutiveSuccesses = 0;
  } else if (confidence === "hint") {
    intervalDays = 3;
    consecutiveSuccesses = 1;
  } else {
    // Solved independently
    if (existingRevision && existingRevision.consecutiveSuccesses > 0) {
      consecutiveSuccesses = existingRevision.consecutiveSuccesses + 1;
      intervalDays = Math.min(60, existingRevision.intervalDays * 2);
    } else {
      intervalDays = 7;
      consecutiveSuccesses = 1;
    }
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + intervalDays);

  const revisionItem: RevisionItem = {
    questionSlug: slug,
    dueDate: dueDate.toISOString(),
    intervalDays,
    consecutiveSuccesses,
    lastConfidence: confidence,
    lastReviewedAt: new Date().toISOString(),
  };

  // 2. Finalize question attempt status
  const finalStatus: QuestionStatus =
    confidence === "need_practice" ? "needs_revision" : "completed";

  const historyItem = {
    timestamp: new Date().toISOString(),
    confidence,
    hintsUsed: current.hintsRevealed.length,
    solutionRevealed: current.solutionRevealed,
    rubricCount: current.checkedRubricIndices.length,
  };

  const nextAttempt: QuestionAttempt = {
    ...current,
    status: finalStatus,
    confidence,
    lastAttemptedAt: new Date().toISOString(),
    attemptCount: current.attemptCount + 1,
    history: [historyItem, ...(current.history || [])],
  };

  const nextStore: UserPracticeStore = {
    ...store,
    attempts: {
      ...store.attempts,
      [slug]: nextAttempt,
    },
    revisions: {
      ...store.revisions,
      [slug]: revisionItem,
    },
    lastUnfinishedSlug:
      store.lastUnfinishedSlug === slug ? undefined : store.lastUnfinishedSlug,
  };

  saveUserPracticeStore(nextStore);
}

// ---------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------

export function toggleBookmark(slug: string): boolean {
  const store = getUserPracticeStore();
  const exists = store.bookmarks.includes(slug);
  const nextBookmarks = exists
    ? store.bookmarks.filter((s) => s !== slug)
    : [...store.bookmarks, slug];

  saveUserPracticeStore({
    ...store,
    bookmarks: nextBookmarks,
  });

  return !exists;
}

export function isBookmarked(slug: string): boolean {
  const store = getUserPracticeStore();
  return store.bookmarks.includes(slug);
}

// ---------------------------------------------------------------------
// Mistake Journal
// ---------------------------------------------------------------------

export function addMistakeEntry(
  entry: Omit<MistakeEntry, "id" | "createdAt">
): MistakeEntry {
  const store = getUserPracticeStore();
  const newEntry: MistakeEntry = {
    ...entry,
    id: "mst_" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };

  saveUserPracticeStore({
    ...store,
    mistakeJournal: [newEntry, ...store.mistakeJournal],
  });

  return newEntry;
}

export function deleteMistakeEntry(id: string): void {
  const store = getUserPracticeStore();
  saveUserPracticeStore({
    ...store,
    mistakeJournal: store.mistakeJournal.filter((m) => m.id !== id),
  });
}

// ---------------------------------------------------------------------
// Status & Revision Aggregations
// ---------------------------------------------------------------------

export function getQuestionStatus(
  slug: string,
  customStore?: UserPracticeStore
): QuestionStatus {
  const store = customStore || (hasHydrated ? getUserPracticeStore() : emptyStore);
  const attempt = store.attempts[slug];
  if (!attempt) return "not_started";

  const revision = store.revisions[slug];
  if (revision && typeof window !== "undefined" && hasHydrated) {
    const dueTime = new Date(revision.dueDate).getTime();
    if (dueTime <= Date.now()) {
      return "needs_revision";
    }
  }

  return attempt.status;
}

export function getRevisionQueue(customStore?: UserPracticeStore): {
  dueNow: RevisionItem[];
  upcoming: RevisionItem[];
  completedCount: number;
} {
  if (typeof window === "undefined" || !hasHydrated) {
    return { dueNow: [], upcoming: [], completedCount: 0 };
  }
  const store = customStore || getUserPracticeStore();
  const now = Date.now();

  const allRevisions = Object.values(store.revisions);
  const dueNow: RevisionItem[] = [];
  const upcoming: RevisionItem[] = [];

  allRevisions.forEach((rev) => {
    const dueTime = new Date(rev.dueDate).getTime();
    if (dueTime <= now) {
      dueNow.push(rev);
    } else {
      upcoming.push(rev);
    }
  });

  // Sort dueNow: most overdue first
  dueNow.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  // Sort upcoming: closest due date first
  upcoming.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const completedCount = Object.values(store.attempts).filter(
    (a) => a.status === "completed"
  ).length;

  return { dueNow, upcoming, completedCount };
}

// ---------------------------------------------------------------------
// Backwards Compatibility for Phase 1 & 2
// ---------------------------------------------------------------------

export function getUserPracticeProgress(): UserPracticeProgress {
  const store = getUserPracticeStore();
  const completedSlugs = Object.entries(store.attempts)
    .filter(([, attempt]) => attempt.status === "completed")
    .map(([slug]) => slug);

  return {
    lastVisitedSlug: store.lastVisitedSlug,
    completedSlugs,
    updatedAt: store.updatedAt,
  };
}

export function markQuestionVisited(slug: string): void {
  const store = getUserPracticeStore();
  saveUserPracticeStore({
    ...store,
    lastVisitedSlug: slug,
  });
}

export function toggleQuestionCompleted(slug: string): boolean {
  const store = getUserPracticeStore();
  const current = store.attempts[slug] || createDefaultAttempt(slug);
  const isCompleted = current.status === "completed";

  if (isCompleted) {
    current.status = "not_started";
    current.confidence = undefined;
    const nextRevisions = { ...store.revisions };
    delete nextRevisions[slug];
    saveUserPracticeStore({
      ...store,
      attempts: { ...store.attempts, [slug]: current },
      revisions: nextRevisions,
    });
    return false;
  } else {
    submitSelfAssessment(slug, "independent");
    return true;
  }
}

export function isQuestionCompleted(slug: string): boolean {
  return getQuestionStatus(slug) === "completed";
}

export function useWebDevProgress(): UserPracticeProgress {
  const store = useUserPracticeStore();
  const completedSlugs = Object.entries(store.attempts)
    .filter(([, attempt]) => attempt.status === "completed")
    .map(([slug]) => slug);

  return {
    lastVisitedSlug: store.lastVisitedSlug,
    completedSlugs,
    updatedAt: store.updatedAt,
  };
}
