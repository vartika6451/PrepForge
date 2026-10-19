"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  X,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  FolderOpen,
  RotateCcw,
  Bookmark,
  FileEdit,
} from "lucide-react";
import {
  WebDevQuestion,
  PracticeMode,
  QuestionDifficulty,
  WebDevTopicId,
  QuestionStatus,
} from "@/types/web-dev";
import { WEB_DEV_TOPICS } from "@/data/web-dev-topics";
import {
  useUserPracticeStore,
  getQuestionStatus,
} from "@/lib/web-dev-progress";
import { ModeBadge, WebDevDifficultyBadge, TopicBadge } from "./WebDevBadges";

interface QuestionLibraryProps {
  questions: WebDevQuestion[];
  totalQuestionsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeMode: PracticeMode | "all";
  onSelectMode: (mode: PracticeMode | "all") => void;
  activeTopic: WebDevTopicId | "all";
  onSelectTopic: (topic: WebDevTopicId | "all") => void;
  activeDifficulty: QuestionDifficulty | "all";
  onSelectDifficulty: (diff: QuestionDifficulty | "all") => void;
  activeStatus: QuestionStatus | "all";
  onSelectStatus: (status: QuestionStatus | "all") => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export function QuestionLibrary({
  questions,
  totalQuestionsCount,
  searchQuery,
  onSearchChange,
  activeMode,
  onSelectMode,
  activeTopic,
  onSelectTopic,
  activeDifficulty,
  onSelectDifficulty,
  activeStatus,
  onSelectStatus,
  onClearAllFilters,
  hasActiveFilters,
}: QuestionLibraryProps) {
  const store = useUserPracticeStore();
  const bookmarks = store.bookmarks || [];

  return (
    <section id="question-library" aria-labelledby="library-heading" className="space-y-4 pt-1">
      {/* Header and Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="library-heading" className="text-[11px] font-mono uppercase tracking-wider text-[#383431] font-semibold">
            Question Library
          </h2>
          <p className="text-xs text-[#383431] mt-0.5">
            Targeted technical interview questions with reference solutions and self-evaluation rubrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#383431] bg-[#BBB7B0] px-2.5 py-1 rounded-md border border-[#99958E]">
            Showing <strong className="text-[#272624]">{questions.length}</strong> of {totalQuestionsCount}
          </span>

          {hasActiveFilters && (
            <button
              onClick={onClearAllFilters}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#A34823] hover:underline transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 sm:p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-sm">
        {/* Search Input Row */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#383431] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions by title, keyword, or concept..."
            aria-label="Search questions"
            className="w-full pl-10 pr-9 py-2 rounded-lg bg-[#BBB7B0] border border-[#99958E] text-sm text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823] transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              type="button"
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#383431] hover:text-[#272624] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <div className="flex items-center gap-1.5 text-xs text-[#383431] font-mono mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#383431]" />
            <span>Filter:</span>
          </div>

          {/* Status Filter */}
          <select
            value={activeStatus}
            onChange={(e) => onSelectStatus(e.target.value as QuestionStatus | "all")}
            aria-label="Filter by practice status"
            className="text-xs bg-[#BBB7B0] border border-[#99958E] text-[#272624] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#A34823]"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="needs_revision">Needs Revision</option>
          </select>

          {/* Mode Dropdown */}
          <select
            value={activeMode}
            onChange={(e) => onSelectMode(e.target.value as PracticeMode | "all")}
            aria-label="Filter by practice mode"
            className="text-xs bg-[#BBB7B0] border border-[#99958E] text-[#272624] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#A34823]"
          >
            <option value="all">All Modes</option>
            <option value="explain">Explain</option>
            <option value="debug">Debug</option>
            <option value="build">Build</option>
          </select>

          {/* Topic Dropdown */}
          <select
            value={activeTopic}
            onChange={(e) => onSelectTopic(e.target.value as WebDevTopicId | "all")}
            aria-label="Filter by topic"
            className="text-xs bg-[#BBB7B0] border border-[#99958E] text-[#272624] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#A34823] max-w-[200px]"
          >
            <option value="all">All Topics</option>
            {WEB_DEV_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={activeDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value as QuestionDifficulty | "all")}
            aria-label="Filter by difficulty"
            className="text-xs bg-[#BBB7B0] border border-[#99958E] text-[#272624] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#A34823]"
          >
            <option value="all">All Difficulties</option>
            <option value="foundation">Foundation</option>
            <option value="applied">Applied</option>
            <option value="challenge">Challenge</option>
          </select>
        </div>
      </div>

      {/* Minimal Question Rows with Subtle Separators */}
      {questions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#BBB7B0] flex items-center justify-center mx-auto text-[#383431]">
            <FolderOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#272624]">No questions match your criteria</h3>
          <p className="text-xs text-[#383431] max-w-md mx-auto">
            Try adjusting your search terms or clearing your filters.
          </p>
          <button
            onClick={onClearAllFilters}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A34823] text-white text-xs font-medium hover:bg-[#8F3D1C] transition mt-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset all filters</span>
          </button>
        </div>
      ) : (
        <div className="border border-[#99958E] rounded-xl bg-[#CFCCC6] divide-y divide-[#99958E] shadow-sm overflow-hidden">
          {questions.map((question) => {
            const status = getQuestionStatus(question.slug, store);
            const isBookmarked = bookmarks.includes(question.slug);

            return (
              <div
                key={question.id}
                className="group p-3.5 sm:p-4 hover:bg-[#BBB7B0]/50 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Left column: Status indicator + bookmark + title + summary */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Status Indicator */}
                  <div className="pt-0.5 shrink-0 flex items-center gap-1.5">
                    {status === "completed" && (
                      <span title="Completed and self-reviewed" className="text-[#A34823]">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    {status === "in_progress" && (
                      <span title="In progress (Draft saved)" className="text-[#383431]">
                        <FileEdit className="w-4 h-4" />
                      </span>
                    )}
                    {status === "needs_revision" && (
                      <span title="Revision due" className="text-[#A34823]">
                        <RotateCcw className="w-4 h-4" />
                      </span>
                    )}
                    {status === "not_started" && (
                      <span
                        title="Not started"
                        className="inline-block w-2.5 h-2.5 rounded-full bg-[#99958E] mx-0.5"
                      />
                    )}

                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 fill-[#A34823] text-[#A34823] shrink-0" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <Link
                      href={`/developer/practice/${question.slug}`}
                      className="text-sm font-semibold text-[#272624] group-hover:text-[#A34823] transition truncate block"
                    >
                      {question.title}
                    </Link>
                    <p className="text-xs text-[#383431] leading-relaxed line-clamp-1">
                      {question.summary}
                    </p>
                  </div>
                </div>

                {/* Right column: Subtle badges + Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                  <TopicBadge topicId={question.topic} />
                  <ModeBadge mode={question.mode} />
                  <WebDevDifficultyBadge difficulty={question.difficulty} />

                  <span className="flex items-center gap-1 text-xs font-mono text-[#383431] shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#A34823]" />
                    <span>{question.estimatedMinutes}m</span>
                  </span>

                  <Link
                    href={`/developer/practice/${question.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#99958E] bg-[#BBB7B0] hover:bg-[#A34823] hover:text-white text-xs font-medium text-[#272624] transition ml-1 cursor-pointer"
                  >
                    <span>
                      {status === "in_progress"
                        ? "Resume"
                        : status === "needs_revision"
                        ? "Revise"
                        : "Practice"}
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
