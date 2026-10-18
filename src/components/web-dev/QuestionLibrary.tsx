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
  Flame,
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
    <section id="question-library" aria-labelledby="library-heading" className="space-y-4 pt-2">
      {/* Header and Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="library-heading" className="text-sm font-mono uppercase tracking-wider text-slate-400">
            Question Library
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Curated technical interview challenges with interactive practice workspaces and persistent progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Showing <strong className="text-white">{questions.length}</strong> of {totalQuestionsCount} questions
          </span>

          {hasActiveFilters && (
            <button
              onClick={onClearAllFilters}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-mono text-orange-400 hover:text-orange-300 hover:underline transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-[#0f172a]/70 backdrop-blur-sm space-y-3">
        {/* Search Input Row */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions by title, keyword, or concept..."
            aria-label="Search questions"
            className="w-full pl-10 pr-9 py-2 rounded-lg bg-[#090d16] border border-slate-800 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              type="button"
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={activeStatus}
            onChange={(e) => onSelectStatus(e.target.value as QuestionStatus | "all")}
            aria-label="Filter by practice status"
            className="text-xs bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
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
            className="text-xs bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
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
            className="text-xs bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 max-w-[200px]"
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
            className="text-xs bg-[#090d16] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Difficulties</option>
            <option value="foundation">Foundation</option>
            <option value="applied">Applied</option>
            <option value="challenge">Challenge</option>
          </select>
        </div>
      </div>

      {/* Question Rows List */}
      {questions.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 px-4 rounded-xl border border-slate-800 bg-[#0f172a]/40 space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FolderOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">No questions match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms or resetting the status, mode, topic, and difficulty filters.
          </p>
          <button
            onClick={onClearAllFilters}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition mt-2"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset all filters</span>
          </button>
        </div>
      ) : (
        /* Compact Rows */
        <div className="space-y-2.5">
          {questions.map((question) => {
            const status = getQuestionStatus(question.slug, store);
            const isBookmarked = bookmarks.includes(question.slug);

            return (
              <div
                key={question.id}
                className="group p-4 rounded-xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left column: Status indicator + bookmark + title + summary */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Status Indicator */}
                  <div className="pt-0.5 shrink-0 flex items-center gap-1.5">
                    {status === "completed" && (
                      <span
                        title="Completed and reviewed"
                        className="inline-flex text-emerald-400"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    {status === "in_progress" && (
                      <span
                        title="In progress (Draft saved)"
                        className="inline-flex text-amber-400"
                      >
                        <FileEdit className="w-4 h-4" />
                      </span>
                    )}
                    {status === "needs_revision" && (
                      <span
                        title="Revision due"
                        className="inline-flex text-orange-400"
                      >
                        <Flame className="w-4 h-4" />
                      </span>
                    )}
                    {status === "not_started" && (
                      <span
                        title="Not started"
                        className="inline-block w-4 h-4 rounded-full border border-slate-700/80 bg-slate-800/40"
                      />
                    )}

                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 fill-blue-400 text-blue-400 shrink-0" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/developer/practice/${question.slug}`}
                      className="text-sm font-semibold text-white group-hover:text-orange-400 transition hover:underline truncate block"
                    >
                      {question.title}
                    </Link>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-1">
                      {question.summary}
                    </p>
                  </div>
                </div>

                {/* Right column: Badges + Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  <TopicBadge topicId={question.topic} />
                  <ModeBadge mode={question.mode} />
                  <WebDevDifficultyBadge difficulty={question.difficulty} />

                  <span className="flex items-center gap-1 text-xs font-mono text-slate-400 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{question.estimatedMinutes}m</span>
                  </span>

                  <Link
                    href={`/developer/practice/${question.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-orange-500 hover:text-white text-xs font-medium text-slate-200 border border-slate-700/80 group-hover:border-slate-600 transition ml-1"
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
