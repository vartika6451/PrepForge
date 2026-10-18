import { WEB_DEV_QUESTIONS } from "@/data/web-dev-questions";
import { WEB_DEV_TOPICS } from "@/data/web-dev-topics";
import {
  WebDevQuestion,
  WebDevTopicMeta,
  WebDevTopicId,
  PracticeMode,
  QuestionDifficulty,
} from "@/types/web-dev";

export interface QuestionFilter {
  mode?: PracticeMode | "all";
  topic?: WebDevTopicId | "all";
  difficulty?: QuestionDifficulty | "all";
  search?: string;
}

export function getAllWebDevQuestions(): WebDevQuestion[] {
  return [...WEB_DEV_QUESTIONS];
}

export function getWebDevQuestionBySlug(slug: string): WebDevQuestion | undefined {
  return WEB_DEV_QUESTIONS.find((q) => q.slug === slug);
}

export function getWebDevQuestions(filter?: QuestionFilter): WebDevQuestion[] {
  let list = [...WEB_DEV_QUESTIONS];

  if (filter?.mode && filter.mode !== "all") {
    list = list.filter((q) => q.mode === filter.mode);
  }

  if (filter?.topic && filter.topic !== "all") {
    list = list.filter((q) => q.topic === filter.topic);
  }

  if (filter?.difficulty && filter.difficulty !== "all") {
    list = list.filter((q) => q.difficulty === filter.difficulty);
  }

  if (filter?.search && filter.search.trim().length > 0) {
    const s = filter.search.toLowerCase().trim();
    list = list.filter((q) => {
      const matchTitle = q.title.toLowerCase().includes(s);
      const matchSummary = q.summary.toLowerCase().includes(s);
      const matchTags = q.tags.some((t) => t.toLowerCase().includes(s));
      const matchSkills = q.skillsTested.some((sk) => sk.toLowerCase().includes(s));
      return matchTitle || matchSummary || matchTags || matchSkills;
    });
  }

  return list;
}

export interface WebDevTopicWithCount extends WebDevTopicMeta {
  count: number;
}

export function getWebDevTopicsWithCounts(): WebDevTopicWithCount[] {
  return WEB_DEV_TOPICS.map((topic) => {
    const count = WEB_DEV_QUESTIONS.filter((q) => q.topic === topic.id).length;
    return {
      ...topic,
      count,
    };
  });
}

export function getTopicById(topicId: WebDevTopicId): WebDevTopicMeta | undefined {
  return WEB_DEV_TOPICS.find((t) => t.id === topicId);
}

/**
 * Predictable selection rule for featured challenge based on mode
 */
export function getFeaturedQuestion(mode?: PracticeMode | "all"): WebDevQuestion {
  if (mode === "explain") {
    return (
      WEB_DEV_QUESTIONS.find((q) => q.id === "JS01") ||
      WEB_DEV_QUESTIONS[0]
    );
  }
  if (mode === "debug") {
    return (
      WEB_DEV_QUESTIONS.find((q) => q.id === "RE02") ||
      WEB_DEV_QUESTIONS[1]
    );
  }
  if (mode === "build") {
    return (
      WEB_DEV_QUESTIONS.find((q) => q.id === "JS04") ||
      WEB_DEV_QUESTIONS[2]
    );
  }
  // Default for "all":
  return (
    WEB_DEV_QUESTIONS.find((q) => q.id === "RE02") ||
    WEB_DEV_QUESTIONS[0]
  );
}
