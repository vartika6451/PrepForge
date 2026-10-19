import {
  WebDevQuestion,
  WebDevTopicId,
  PracticeMode,
  ConfidenceLevel,
  InterviewRoundSession,
  InterviewRoundSummary,
  InterviewQuestionResponse,
} from "@/types/web-dev";
import {
  getUserPracticeStore,
  saveUserPracticeStore,
  submitSelfAssessment,
  saveQuestionDraft,
} from "./web-dev-progress";

/**
 * Selects 5 balanced questions for a junior/internship technical interview round:
 * 1. JavaScript / TypeScript
 * 2. React
 * 3. Browser / CSS
 * 4. Backend / APIs
 * 5. Databases / Security OR Performance / Testing
 */
export function selectInterviewRoundQuestions(
  allQuestions: WebDevQuestion[],
  excludeSlugs: string[] = []
): WebDevQuestion[] {
  const chosen: WebDevQuestion[] = [];
  const chosenSlugs = new Set<string>();

  // Helper to pick best candidate for a topic prioritizing foundation/applied and unattempted
  const pickFromTopic = (
    topic: WebDevTopicId,
    preferredModes?: PracticeMode[]
  ): WebDevQuestion => {
    let pool = allQuestions.filter(
      (q) => q.topic === topic && !chosenSlugs.has(q.slug)
    );

    if (pool.length === 0) {
      // Explicit fallback if all in topic were chosen
      pool = allQuestions.filter((q) => q.topic === topic);
    }

    if (pool.length === 0) {
      throw new Error(`Insufficient questions available for topic: ${topic}`);
    }

    // Filter out previously excluded if possible
    const nonExcluded = pool.filter((q) => !excludeSlugs.includes(q.slug));
    if (nonExcluded.length > 0) {
      pool = nonExcluded;
    }

    // Try to match preferred modes for variety
    if (preferredModes && preferredModes.length > 0) {
      const modeMatched = pool.filter((q) => preferredModes.includes(q.mode));
      if (modeMatched.length > 0) {
        pool = modeMatched;
      }
    }

    // Prioritize foundation and applied for junior level
    const juniorPool = pool.filter((q) => q.difficulty !== "challenge");
    const finalCandidates = juniorPool.length > 0 ? juniorPool : pool;

    // Pick random candidate from filtered pool
    const selected =
      finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
    chosenSlugs.add(selected.slug);
    return selected;
  };

  // 1. JS / TS (typically Explain or Debug)
  const q1 = pickFromTopic("javascript-typescript", ["explain", "debug"]);
  chosen.push(q1);

  // 2. React (typically Debug or Build)
  const q2 = pickFromTopic("react", ["debug", "build"]);
  chosen.push(q2);

  // 3. Browser / CSS (typically Explain or Build)
  const q3 = pickFromTopic("browser-css", ["explain", "build"]);
  chosen.push(q3);

  // 4. Backend / APIs (typically Explain or Debug)
  const q4 = pickFromTopic("backend-apis", ["explain", "debug"]);
  chosen.push(q4);

  // 5. Alternate Databases / Security vs Performance / Testing
  const slot5Topic: WebDevTopicId =
    Math.random() > 0.5 ? "databases-security" : "performance-testing";
  const q5 = pickFromTopic(slot5Topic, ["debug", "build", "explain"]);
  chosen.push(q5);

  return chosen;
}

export function startNewInterviewRound(
  allQuestions: WebDevQuestion[]
): InterviewRoundSession {
  const store = getUserPracticeStore();

  // Exclude questions from the most recent session if available to provide variety
  const recentSlugs = store.activeInterviewSession?.questionSlugs || [];
  const selectedQuestions = selectInterviewRoundQuestions(
    allQuestions,
    recentSlugs
  );

  const newSession: InterviewRoundSession = {
    id: "rnd_" + Math.random().toString(36).substring(2, 9),
    startedAt: new Date().toISOString(),
    questionSlugs: selectedQuestions.map((q) => q.slug),
    currentQuestionIndex: 0,
    status: "in_progress",
    responses: {},
  };

  saveUserPracticeStore({
    ...store,
    activeInterviewSession: newSession,
  });

  return newSession;
}

export function getActiveInterviewSession(): InterviewRoundSession | null {
  const store = getUserPracticeStore();
  if (
    store.activeInterviewSession &&
    store.activeInterviewSession.status === "in_progress"
  ) {
    return store.activeInterviewSession;
  }
  return null;
}

export function updateInterviewQuestionIndex(index: number): void {
  const store = getUserPracticeStore();
  if (!store.activeInterviewSession) return;

  const boundedIndex = Math.max(
    0,
    Math.min(
      store.activeInterviewSession.questionSlugs.length - 1,
      index
    )
  );

  saveUserPracticeStore({
    ...store,
    activeInterviewSession: {
      ...store.activeInterviewSession,
      currentQuestionIndex: boundedIndex,
    },
  });
}

export function saveInterviewQuestionDraft(
  slug: string,
  draftAnswer: string
): void {
  const store = getUserPracticeStore();
  if (!store.activeInterviewSession) return;

  const currentResponses = store.activeInterviewSession.responses || {};
  const prevResponse = currentResponses[slug] || {
    slug,
    draftAnswer: "",
    hintsUsed: 0,
    solutionRevealed: false,
  };

  const nextResponse: InterviewQuestionResponse = {
    ...prevResponse,
    draftAnswer,
  };

  // Also autosave to main user practice attempts so progress is never lost
  saveQuestionDraft(slug, { draftAnswer });

  saveUserPracticeStore({
    ...store,
    activeInterviewSession: {
      ...store.activeInterviewSession,
      responses: {
        ...currentResponses,
        [slug]: nextResponse,
      },
    },
  });
}

export function submitInterviewQuestionAssessment(
  slug: string,
  confidence: ConfidenceLevel,
  hintsUsed: number,
  solutionRevealed: boolean
): void {
  const store = getUserPracticeStore();
  if (!store.activeInterviewSession) return;

  const currentResponses = store.activeInterviewSession.responses || {};
  const prevResponse = currentResponses[slug] || {
    slug,
    draftAnswer: "",
    hintsUsed: 0,
    solutionRevealed: false,
  };

  const nextResponse: InterviewQuestionResponse = {
    ...prevResponse,
    confidence,
    hintsUsed,
    solutionRevealed,
    completedAt: new Date().toISOString(),
  };

  // Also submit to overall spaced repetition schedule
  submitSelfAssessment(slug, confidence);

  saveUserPracticeStore({
    ...store,
    activeInterviewSession: {
      ...store.activeInterviewSession,
      responses: {
        ...currentResponses,
        [slug]: nextResponse,
      },
    },
  });
}

export function completeInterviewRound(
  allQuestions: WebDevQuestion[]
): InterviewRoundSummary {
  const store = getUserPracticeStore();
  const session = store.activeInterviewSession;

  if (!session) {
    throw new Error("No active interview session to complete.");
  }

  const completedAt = new Date().toISOString();
  const questionMap = new Map<string, WebDevQuestion>();
  allQuestions.forEach((q) => questionMap.set(q.slug, q));

  const confidenceDist: Record<ConfidenceLevel, number> = {
    independent: 0,
    hint: 0,
    need_practice: 0,
  };

  const topicsNeedingAttention: InterviewRoundSummary["topicsNeedingAttention"] =
    [];
  const recommendedRevisionSlugs: string[] = [];

  let attemptedCount = 0;
  let completedCount = 0;

  session.questionSlugs.forEach((slug) => {
    const resp = session.responses[slug];
    const q = questionMap.get(slug);

    if (resp && resp.draftAnswer.trim().length > 0) {
      attemptedCount++;
    }

    if (resp && resp.confidence) {
      completedCount++;
      confidenceDist[resp.confidence]++;

      if (
        resp.confidence === "need_practice" ||
        resp.confidence === "hint"
      ) {
        recommendedRevisionSlugs.push(slug);
        if (q) {
          topicsNeedingAttention.push({
            topicId: q.topic,
            questionTitle: q.title,
            slug: q.slug,
            confidence: resp.confidence,
          });
        }
      }
    } else if (q) {
      // Unattempted in session also marked for attention
      topicsNeedingAttention.push({
        topicId: q.topic,
        questionTitle: q.title,
        slug: q.slug,
      });
      recommendedRevisionSlugs.push(slug);
    }
  });

  const summary: InterviewRoundSummary = {
    roundId: session.id,
    startedAt: session.startedAt,
    completedAt,
    totalQuestions: session.questionSlugs.length,
    attemptedCount,
    completedCount,
    confidenceDistribution: confidenceDist,
    topicsNeedingAttention,
    recommendedRevisionSlugs,
  };

  const finalizedSession: InterviewRoundSession = {
    ...session,
    status: "completed",
    completedAt,
  };

  const pastSessions = [
    finalizedSession,
    ...(store.pastInterviewSessions || []),
  ];

  saveUserPracticeStore({
    ...store,
    activeInterviewSession: undefined,
    pastInterviewSessions: pastSessions,
  });

  return summary;
}

export function abandonInterviewRound(): void {
  const store = getUserPracticeStore();
  if (!store.activeInterviewSession) return;

  const abandonedSession: InterviewRoundSession = {
    ...store.activeInterviewSession,
    status: "abandoned",
    completedAt: new Date().toISOString(),
  };

  saveUserPracticeStore({
    ...store,
    activeInterviewSession: undefined,
    pastInterviewSessions: [
      abandonedSession,
      ...(store.pastInterviewSessions || []),
    ],
  });
}
