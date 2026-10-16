export type Difficulty = "Easy" | "Medium" | "Hard";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type Platform = "LeetCode" | "HackerRank" | "Codeforces" | "InterviewBit";
export type PricingCategory = "Free" | "Paid" | "Subscription";

export interface Pattern {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "Core Patterns" | "Advanced Techniques" | "Data Structure Patterns";
  recognitionHints: string[];
  commonApproaches: string[];
  commonMistakes: string[];
  difficultyLevel: SkillLevel;
  sortOrder: number;
  tags: string[];
}

export interface DSAQuestion {
  id: string;
  slug: string;
  title: string;
  externalUrl: string;
  platform: Platform;
  difficulty: Difficulty;
  editorialNote: string;
  patternSlugs: string[];
  recommendedOrder: number;
}

export interface Technology {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "Languages" | "Frontend" | "Backend" | "Data & Systems" | "DevOps & Tools";
  sortOrder: number;
  iconName: string;
  colorClass: string;
  tagline: string;
}

export interface LearningResource {
  id: string;
  slug: string;
  title: string;
  url: string;
  technologySlug: string;
  resourceType: "Documentation" | "YouTube" | "Guide" | "Interactive" | "Article";
  provider: string;
  level: SkillLevel;
  pricingCategory: "Free";
  description: string;
  verificationStatus: "Verified Official" | "Curated Resource";
  lastVerifiedAt: string;
}

export interface PaidCourse {
  id: string;
  slug: string;
  title: string;
  technologySlug: string;
  provider: string;
  instructor: string;
  topicCoverage: string[];
  level: SkillLevel;
  pricingCategory: "Paid" | "Subscription";
  officialUrl: string;
}

export interface InterviewQuestion {
  id: string;
  slug: string;
  title: string;
  technologySlug: string;
  topic: string;
  difficulty: Difficulty;
  explanation: string;
  codeExample?: string;
  outputPrediction?: string;
  keyTakeaways: string[];
  relatedQuestionSlugs?: string[];
}

export interface ProjectMilestone {
  phase: string;
  title: string;
  tasks: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: SkillLevel;
  category: "JavaScript" | "TypeScript" | "React" | "Next.js" | "Node.js" | "Full Stack" | "AI Applications";
  technologySlugs: string[];
  problemSolved: string;
  coreFeatures: string[];
  milestones: ProjectMilestone[];
  skillsLearned: string[];
  stretchGoals: string[];
  referenceLinks: { title: string; url: string }[];
}

export interface RoadmapStage {
  stage: number;
  title: string;
  description: string;
  duration: string;
  focusItems: string[];
  targetPatterns?: string[];
  targetTechnologies?: string[];
  targetProjects?: string[];
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  targetRole: string;
  summary: string;
  estimatedDuration: string;
  stages: RoadmapStage[];
}

export interface SearchResultItem {
  id: string;
  type: "pattern" | "question" | "technology" | "interview" | "project" | "roadmap";
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  badgeColor?: string;
}
