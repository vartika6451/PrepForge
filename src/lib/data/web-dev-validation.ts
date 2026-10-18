import { WEB_DEV_QUESTIONS } from "@/data/web-dev-questions";
import { PracticeMode, QuestionDifficulty, WebDevTopicId } from "@/types/web-dev";

export interface ValidationReport {
  isValid: boolean;
  totalQuestions: number;
  uniqueIds: number;
  uniqueSlugs: number;
  difficultyCounts: Record<QuestionDifficulty, number>;
  modeCounts: Record<PracticeMode, number>;
  topicCounts: Record<WebDevTopicId, number>;
  errors: string[];
}

export function validateQuestionBank(): ValidationReport {
  const errors: string[] = [];

  const expectedCounts = {
    total: 36,
    foundation: 8,
    applied: 21,
    challenge: 7,
    explain: 11,
    debug: 14,
    build: 11,
    topics: {
      "javascript-typescript": 8,
      react: 8,
      "browser-css": 5,
      "backend-apis": 7,
      "databases-security": 5,
      "performance-testing": 3,
    },
  };

  const ids = new Set<string>();
  const slugs = new Set<string>();

  const difficultyCounts: Record<QuestionDifficulty, number> = {
    foundation: 0,
    applied: 0,
    challenge: 0,
  };

  const modeCounts: Record<PracticeMode, number> = {
    explain: 0,
    debug: 0,
    build: 0,
  };

  const topicCounts: Record<WebDevTopicId, number> = {
    "javascript-typescript": 0,
    react: 0,
    "browser-css": 0,
    "backend-apis": 0,
    "databases-security": 0,
    "performance-testing": 0,
  };

  if (WEB_DEV_QUESTIONS.length !== expectedCounts.total) {
    errors.push(
      `Total question count mismatch: expected ${expectedCounts.total}, got ${WEB_DEV_QUESTIONS.length}`
    );
  }

  WEB_DEV_QUESTIONS.forEach((q, idx) => {
    const qIndex = `Question #${idx + 1} (${q.id || "unknown id"})`;

    // ID checks
    if (!q.id || q.id.trim().length === 0) {
      errors.push(`${qIndex}: Missing id`);
    } else if (ids.has(q.id)) {
      errors.push(`${qIndex}: Duplicate id '${q.id}'`);
    } else {
      ids.add(q.id);
    }

    // Slug checks
    if (!q.slug || q.slug.trim().length === 0) {
      errors.push(`${qIndex}: Missing slug`);
    } else if (slugs.has(q.slug)) {
      errors.push(`${qIndex}: Duplicate slug '${q.slug}'`);
    } else {
      slugs.add(q.slug);
    }

    // Title & Summary
    if (!q.title || q.title.trim().length < 5) {
      errors.push(`${qIndex}: Invalid or empty title`);
    }
    if (!q.summary || q.summary.trim().length < 10) {
      errors.push(`${qIndex}: Invalid or empty summary`);
    }

    // Scenario & Requirements
    if (!q.scenario || q.scenario.trim().length < 20) {
      errors.push(`${qIndex}: Scenario too short or empty`);
    }
    if (!Array.isArray(q.requirements) || q.requirements.length < 2) {
      errors.push(`${qIndex}: Must have at least 2 requirements`);
    }

    // Progressive Hints (>= 2)
    if (!Array.isArray(q.hints) || q.hints.length < 2) {
      errors.push(`${qIndex}: Must have at least 2 progressive hints`);
    }

    // Evaluation Rubric (>= 3)
    if (!Array.isArray(q.evaluationRubric) || q.evaluationRubric.length < 3) {
      errors.push(`${qIndex}: Must have at least 3 evaluation rubric criteria`);
    }

    // Reference Answer (Non-empty)
    if (!q.referenceAnswer || q.referenceAnswer.trim().length < 30) {
      errors.push(`${qIndex}: Reference answer is too short or missing`);
    }

    // Common Mistakes (>= 2)
    if (!Array.isArray(q.commonMistakes) || q.commonMistakes.length < 2) {
      errors.push(`${qIndex}: Must list at least 2 common mistakes`);
    }

    // Follow-up
    if (!q.followUpQuestion || q.followUpQuestion.trim().length < 10) {
      errors.push(`${qIndex}: Missing or short follow-up question`);
    }
    if (!q.followUpAnswer || q.followUpAnswer.trim().length < 10) {
      errors.push(`${qIndex}: Missing or short follow-up answer`);
    }

    // References (>= 1)
    if (!Array.isArray(q.references) || q.references.length < 1) {
      errors.push(`${qIndex}: Must have at least 1 authoritative reference link`);
    } else {
      q.references.forEach((ref, refIdx) => {
        if (!ref.title || !ref.url || !ref.url.startsWith("http")) {
          errors.push(`${qIndex}: Reference #${refIdx + 1} has invalid title or URL (${ref.url})`);
        }
      });
    }

    // Tags & Skills
    if (!Array.isArray(q.tags) || q.tags.length === 0) {
      errors.push(`${qIndex}: Missing tags`);
    }
    if (!Array.isArray(q.skillsTested) || q.skillsTested.length === 0) {
      errors.push(`${qIndex}: Missing skillsTested`);
    }

    // Counters
    if (q.difficulty in difficultyCounts) {
      difficultyCounts[q.difficulty]++;
    } else {
      errors.push(`${qIndex}: Invalid difficulty '${q.difficulty}'`);
    }

    if (q.mode in modeCounts) {
      modeCounts[q.mode]++;
    } else {
      errors.push(`${qIndex}: Invalid mode '${q.mode}'`);
    }

    if (q.topic in topicCounts) {
      topicCounts[q.topic]++;
    } else {
      errors.push(`${qIndex}: Invalid topic '${q.topic}'`);
    }
  });

  // Verify distributions
  if (difficultyCounts.foundation !== expectedCounts.foundation) {
    errors.push(`Foundation count mismatch: expected ${expectedCounts.foundation}, got ${difficultyCounts.foundation}`);
  }
  if (difficultyCounts.applied !== expectedCounts.applied) {
    errors.push(`Applied count mismatch: expected ${expectedCounts.applied}, got ${difficultyCounts.applied}`);
  }
  if (difficultyCounts.challenge !== expectedCounts.challenge) {
    errors.push(`Challenge count mismatch: expected ${expectedCounts.challenge}, got ${difficultyCounts.challenge}`);
  }

  if (modeCounts.explain !== expectedCounts.explain) {
    errors.push(`Explain mode mismatch: expected ${expectedCounts.explain}, got ${modeCounts.explain}`);
  }
  if (modeCounts.debug !== expectedCounts.debug) {
    errors.push(`Debug mode mismatch: expected ${expectedCounts.debug}, got ${modeCounts.debug}`);
  }
  if (modeCounts.build !== expectedCounts.build) {
    errors.push(`Build mode mismatch: expected ${expectedCounts.build}, got ${modeCounts.build}`);
  }

  for (const [topic, count] of Object.entries(expectedCounts.topics)) {
    if (topicCounts[topic as WebDevTopicId] !== count) {
      errors.push(`Topic '${topic}' count mismatch: expected ${count}, got ${topicCounts[topic as WebDevTopicId]}`);
    }
  }

  return {
    isValid: errors.length === 0,
    totalQuestions: WEB_DEV_QUESTIONS.length,
    uniqueIds: ids.size,
    uniqueSlugs: slugs.size,
    difficultyCounts,
    modeCounts,
    topicCounts,
    errors,
  };
}
