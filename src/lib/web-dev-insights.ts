import {
  WebDevQuestion,
  PracticeMode,
  ConfidenceLevel,
  MistakeCategory,
  LearningInsights,
  TopicInsight,
  UserPracticeStore,
} from "@/types/web-dev";
import { WEB_DEV_TOPICS } from "@/data/web-dev-topics";
import { getQuestionStatus, getRevisionQueue } from "./web-dev-progress";

const MISTAKE_LABELS: Record<MistakeCategory, string> = {
  conceptual: "Conceptual Misunderstanding",
  approach: "Incorrect Approach",
  edge_case: "Missed Edge Case",
  bug: "Implementation Bug",
  explanation: "Incomplete Explanation",
  other: "Other",
};

export function computeLearningInsights(
  store: UserPracticeStore,
  allQuestions: WebDevQuestion[]
): LearningInsights {
  const questionMap = new Map<string, WebDevQuestion>();
  allQuestions.forEach((q) => questionMap.set(q.slug, q));

  const attempts = store.attempts || {};
  const bookmarks = store.bookmarks || [];
  const mistakes = store.mistakeJournal || [];
  const queue = getRevisionQueue(store);

  let totalAttempted = 0;
  let totalCompleted = 0;
  let totalNeedsRevision = 0;

  const modeDistribution: Record<
    PracticeMode,
    { total: number; attempted: number; completed: number }
  > = {
    explain: { total: 0, attempted: 0, completed: 0 },
    debug: { total: 0, attempted: 0, completed: 0 },
    build: { total: 0, attempted: 0, completed: 0 },
  };

  allQuestions.forEach((q) => {
    modeDistribution[q.mode].total++;

    const att = attempts[q.slug];
    const status = getQuestionStatus(q.slug, store);

    const hasAttempted =
      att &&
      (att.draftAnswer.trim().length > 0 ||
        (att.rootCauseDraft && att.rootCauseDraft.trim().length > 0) ||
        att.attemptCount > 0);

    if (hasAttempted) {
      totalAttempted++;
      modeDistribution[q.mode].attempted++;
    }

    if (status === "completed") {
      totalCompleted++;
      modeDistribution[q.mode].completed++;
    } else if (status === "needs_revision") {
      totalNeedsRevision++;
    }
  });

  // Topic-level insights
  const topicInsights: TopicInsight[] = WEB_DEV_TOPICS.map((topicMeta) => {
    const topicQuestions = allQuestions.filter((q) => q.topic === topicMeta.id);
    let attempted = 0;
    let completed = 0;
    let needsRevision = 0;

    const confDist: Record<ConfidenceLevel, number> = {
      independent: 0,
      hint: 0,
      need_practice: 0,
    };

    topicQuestions.forEach((q) => {
      const att = attempts[q.slug];
      const status = getQuestionStatus(q.slug, store);

      const hasAttempted =
        att &&
        (att.draftAnswer.trim().length > 0 ||
          (att.rootCauseDraft && att.rootCauseDraft.trim().length > 0) ||
          att.attemptCount > 0);

      if (hasAttempted) attempted++;
      if (status === "completed") completed++;
      if (status === "needs_revision") needsRevision++;

      if (att && att.confidence) {
        confDist[att.confidence]++;
      }
    });

    let observation: string | undefined;
    if (attempted === 0) {
      observation = "No questions attempted yet in this topic.";
    } else if (completed === topicQuestions.length) {
      observation = `All ${topicQuestions.length} questions reviewed and completed.`;
    } else {
      observation = `${completed} of ${topicQuestions.length} completed (${confDist.independent} independently, ${confDist.hint} with hint, ${confDist.need_practice} needing practice).`;
    }

    return {
      topicId: topicMeta.id,
      topicName: topicMeta.name,
      totalAvailable: topicQuestions.length,
      attempted,
      completed,
      needsRevision,
      confidenceBreakdown: confDist,
      observation,
    };
  });

  // Meaningful weak areas with sample size guard (requires >= 2 attempts)
  const weakAreas: LearningInsights["weakAreas"] = [];
  topicInsights.forEach((ti) => {
    const totalRated =
      ti.confidenceBreakdown.independent +
      ti.confidenceBreakdown.hint +
      ti.confidenceBreakdown.need_practice;

    if (totalRated >= 2) {
      const strugglingCount =
        ti.confidenceBreakdown.hint + ti.confidenceBreakdown.need_practice;
      const struggleRatio = strugglingCount / totalRated;

      if (struggleRatio >= 0.5) {
        weakAreas.push({
          topicId: ti.topicId,
          topicName: ti.topicName,
          text: `You marked ${strugglingCount} of ${totalRated} ${ti.topicName} attempts as needing hints or more practice.`,
          sampleSize: totalRated,
        });
      }
    }
  });

  // Repeated mistake categories
  const mistakeCounts: Record<MistakeCategory, number> = {
    conceptual: 0,
    approach: 0,
    edge_case: 0,
    bug: 0,
    explanation: 0,
    other: 0,
  };

  mistakes.forEach((m) => {
    if (mistakeCounts[m.category] !== undefined) {
      mistakeCounts[m.category]++;
    }
  });

  const mistakeCategories = (Object.keys(mistakeCounts) as MistakeCategory[])
    .filter((cat) => mistakeCounts[cat] > 0)
    .map((cat) => ({
      category: cat,
      count: mistakeCounts[cat],
      label: MISTAKE_LABELS[cat] || cat,
    }))
    .sort((a, b) => b.count - a.count);

  // Recent activity (sorted by timestamp descending)
  const recentActivity: LearningInsights["recentActivity"] = [];
  Object.keys(attempts).forEach((slug) => {
    const att = attempts[slug];
    const q = questionMap.get(slug);
    if (!q || !att.lastAttemptedAt) return;

    recentActivity.push({
      slug,
      title: q.title,
      mode: q.mode,
      topic: q.topic,
      timestamp: att.lastAttemptedAt,
      status: getQuestionStatus(slug, store),
      confidence: att.confidence,
    });
  });

  recentActivity.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    totalQuestions: allQuestions.length,
    totalAttempted,
    totalCompleted,
    totalNeedsRevision,
    totalBookmarks: bookmarks.length,
    totalMistakes: mistakes.length,
    dueRevisionCount: queue.dueNow.length,
    modeDistribution,
    topicInsights,
    weakAreas,
    mistakeCategories,
    recentActivity: recentActivity.slice(0, 6),
  };
}
