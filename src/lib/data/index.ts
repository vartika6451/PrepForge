import { PATTERNS } from "@/data/patterns";
import { DSA_QUESTIONS } from "@/data/questions";
import { TECHNOLOGIES } from "@/data/technologies";
import { FREE_RESOURCES, PAID_COURSES } from "@/data/resources";
import { INTERVIEW_QUESTIONS } from "@/data/interview-questions";
import { PROJECTS } from "@/data/projects";
import { ROADMAPS } from "@/data/roadmaps";
import {
  Pattern,
  DSAQuestion,
  Technology,
  LearningResource,
  PaidCourse,
  InterviewQuestion,
  Project,
  Roadmap,
  SearchResultItem
} from "@/types";

// Patterns
export function getPatterns(): Pattern[] {
  return [...PATTERNS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPatternBySlug(slug: string): Pattern | undefined {
  return PATTERNS.find(p => p.slug === slug);
}

// DSA Questions
export function getQuestions(filter?: {
  difficulty?: string;
  platform?: string;
  pattern?: string;
  search?: string;
}): DSAQuestion[] {
  let list = [...DSA_QUESTIONS];

  if (filter?.difficulty && filter.difficulty !== "all") {
    list = list.filter(q => q.difficulty.toLowerCase() === filter.difficulty?.toLowerCase());
  }

  if (filter?.platform && filter.platform !== "all") {
    list = list.filter(q => q.platform.toLowerCase() === filter.platform?.toLowerCase());
  }

  if (filter?.pattern && filter.pattern !== "all") {
    list = list.filter(q => q.patternSlugs.includes(filter.pattern!));
  }

  if (filter?.search) {
    const s = filter.search.toLowerCase().trim();
    list = list.filter(
      q => q.title.toLowerCase().includes(s) || q.editorialNote.toLowerCase().includes(s)
    );
  }

  return list;
}

export function getQuestionsForPattern(patternSlug: string): DSAQuestion[] {
  return DSA_QUESTIONS.filter(q => q.patternSlugs.includes(patternSlug)).sort(
    (a, b) => a.recommendedOrder - b.recommendedOrder
  );
}

export function getQuestionCountForPattern(patternSlug: string): number {
  return DSA_QUESTIONS.filter(q => q.patternSlugs.includes(patternSlug)).length;
}

// Technologies
export function getTechnologies(): Technology[] {
  return [...TECHNOLOGIES].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTechnologyBySlug(slug: string): Technology | undefined {
  return TECHNOLOGIES.find(t => t.slug === slug);
}

// Resources & Paid Courses
export function getResourcesForTech(techSlug: string): LearningResource[] {
  return FREE_RESOURCES.filter(r => r.technologySlug === techSlug);
}

export function getPaidCoursesForTech(techSlug: string): PaidCourse[] {
  return PAID_COURSES.filter(c => c.technologySlug === techSlug);
}

// Interview Questions
export function getInterviewQuestions(filter?: {
  tech?: string;
  topic?: string;
  difficulty?: string;
  search?: string;
}): InterviewQuestion[] {
  let list = [...INTERVIEW_QUESTIONS];

  if (filter?.tech && filter.tech !== "all") {
    list = list.filter(q => q.technologySlug.toLowerCase() === filter.tech?.toLowerCase());
  }

  if (filter?.topic && filter.topic !== "all") {
    list = list.filter(q => q.topic.toLowerCase() === filter.topic?.toLowerCase());
  }

  if (filter?.difficulty && filter.difficulty !== "all") {
    list = list.filter(q => q.difficulty.toLowerCase() === filter.difficulty?.toLowerCase());
  }

  if (filter?.search) {
    const s = filter.search.toLowerCase().trim();
    list = list.filter(
      q =>
        q.title.toLowerCase().includes(s) ||
        q.explanation.toLowerCase().includes(s) ||
        q.topic.toLowerCase().includes(s)
    );
  }

  return list;
}

export function getInterviewQuestionBySlug(techSlug: string, slug: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find(q => q.technologySlug === techSlug && q.slug === slug);
}

export function getInterviewQuestionsForTech(techSlug: string): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter(q => q.technologySlug === techSlug);
}

// Projects
export function getProjects(filter?: {
  category?: string;
  difficulty?: string;
  search?: string;
}): Project[] {
  let list = [...PROJECTS];

  if (filter?.category && filter.category !== "all") {
    list = list.filter(
      p =>
        p.category.toLowerCase() === filter.category?.toLowerCase() ||
        p.technologySlugs.some(t => t.toLowerCase() === filter.category?.toLowerCase())
    );
  }

  if (filter?.difficulty && filter.difficulty !== "all") {
    list = list.filter(p => p.difficulty.toLowerCase() === filter.difficulty?.toLowerCase());
  }

  if (filter?.search) {
    const s = filter.search.toLowerCase().trim();
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.problemSolved.toLowerCase().includes(s)
    );
  }

  return list;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}

export function getProjectsForTech(techSlug: string): Project[] {
  return PROJECTS.filter(p => p.technologySlugs.includes(techSlug));
}

// Roadmaps
export function getRoadmaps(): Roadmap[] {
  return [...ROADMAPS];
}

export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return ROADMAPS.find(r => r.slug === slug);
}

// Global Search
export function searchGlobal(query: string): SearchResultItem[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // Patterns
  for (const pat of PATTERNS) {
    if (pat.name.toLowerCase().includes(q) || pat.description.toLowerCase().includes(q) || pat.tags.some(t => t.toLowerCase().includes(q))) {
      results.push({
        id: pat.id,
        type: "pattern",
        title: pat.name,
        subtitle: `DSA Pattern • ${pat.difficultyLevel} • ${pat.category}`,
        url: `/dsa-patterns/${pat.slug}`,
        badge: "DSA Pattern",
        badgeColor: "text-orange-400 bg-orange-950/40 border-orange-800/40"
      });
    }
  }

  // DSA Questions
  for (const question of DSA_QUESTIONS) {
    if (question.title.toLowerCase().includes(q) || question.editorialNote.toLowerCase().includes(q)) {
      results.push({
        id: question.id,
        type: "question",
        title: question.title,
        subtitle: `${question.platform} • ${question.difficulty} • ${question.editorialNote.slice(0, 70)}...`,
        url: question.externalUrl,
        badge: question.difficulty,
        badgeColor:
          question.difficulty === "Easy"
            ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/40"
            : question.difficulty === "Medium"
            ? "text-amber-400 bg-amber-950/40 border-amber-800/40"
            : "text-rose-400 bg-rose-950/40 border-rose-800/40"
      });
    }
  }

  // Technologies
  for (const tech of TECHNOLOGIES) {
    if (tech.name.toLowerCase().includes(q) || tech.description.toLowerCase().includes(q)) {
      results.push({
        id: tech.id,
        type: "technology",
        title: tech.name,
        subtitle: tech.tagline,
        url: `/developer/${tech.slug}`,
        badge: tech.category,
        badgeColor: "text-blue-400 bg-blue-950/40 border-blue-800/40"
      });
    }
  }

  // Interview Questions
  for (const iq of INTERVIEW_QUESTIONS) {
    if (iq.title.toLowerCase().includes(q) || iq.topic.toLowerCase().includes(q) || iq.explanation.toLowerCase().includes(q)) {
      results.push({
        id: iq.id,
        type: "interview",
        title: iq.title,
        subtitle: `${iq.topic} • ${iq.difficulty}`,
        url: `/interview-questions/${iq.technologySlug}/${iq.slug}`,
        badge: "Interview Prep",
        badgeColor: "text-purple-400 bg-purple-950/40 border-purple-800/40"
      });
    }
  }

  // Projects
  for (const proj of PROJECTS) {
    if (proj.title.toLowerCase().includes(q) || proj.description.toLowerCase().includes(q) || proj.category.toLowerCase().includes(q)) {
      results.push({
        id: proj.id,
        type: "project",
        title: proj.title,
        subtitle: `${proj.category} • ${proj.difficulty} Level`,
        url: `/projects/${proj.slug}`,
        badge: proj.category,
        badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40"
      });
    }
  }

  // Roadmaps
  for (const rm of ROADMAPS) {
    if (rm.title.toLowerCase().includes(q) || rm.targetRole.toLowerCase().includes(q) || rm.summary.toLowerCase().includes(q)) {
      results.push({
        id: rm.id,
        type: "roadmap",
        title: rm.title,
        subtitle: `${rm.targetRole} • ${rm.estimatedDuration}`,
        url: `/roadmaps/${rm.slug}`,
        badge: "Roadmap",
        badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/40"
      });
    }
  }

  return results.slice(0, 20);
}
