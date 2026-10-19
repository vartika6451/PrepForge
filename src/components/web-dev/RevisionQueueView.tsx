"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  Calendar,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Trash2,
  ExternalLink,
  Flame,
} from "lucide-react";
import {
  useUserPracticeStore,
  getRevisionQueue,
  deleteMistakeEntry,
  toggleBookmark,
} from "@/lib/web-dev-progress";
import { getAllWebDevQuestions } from "@/lib/data/web-dev";
import {
  ModeBadge,
  WebDevDifficultyBadge,
  TopicBadge,
} from "./WebDevBadges";
import { WebDevQuestion } from "@/types/web-dev";

let currentTimestamp = 0;

function subscribeTime(callback: () => void) {
  if (currentTimestamp === 0 && typeof window !== "undefined") {
    currentTimestamp = Date.now();
  }
  const timer = setInterval(() => {
    currentTimestamp = Date.now();
    callback();
  }, 30000);
  return () => clearInterval(timer);
}

function getTimeSnapshot(): number {
  if (currentTimestamp === 0 && typeof window !== "undefined") {
    currentTimestamp = Date.now();
  }
  return currentTimestamp;
}

function getServerTimeSnapshot(): number {
  return 0;
}

function useCurrentTime(): number {
  return useSyncExternalStore(
    subscribeTime,
    getTimeSnapshot,
    getServerTimeSnapshot
  );
}

export function RevisionQueueView() {
  const store = useUserPracticeStore();
  const allQuestions = getAllWebDevQuestions();
  const queue = getRevisionQueue(store);
  const currentTime = useCurrentTime();

  const [activeTab, setActiveTab] = useState<
    "due" | "upcoming" | "bookmarks" | "mistakes"
  >("due");

  // Map slugs to full question objects for easy rendering
  const questionMap = new Map<string, WebDevQuestion>();
  allQuestions.forEach((q) => questionMap.set(q.slug, q));

  const dueItems = queue.dueNow;
  const upcomingItems = queue.upcoming;
  const bookmarkedQuestions = (store.bookmarks || [])
    .map((slug) => questionMap.get(slug))
    .filter((q): q is WebDevQuestion => q !== undefined);
  const mistakes = store.mistakeJournal || [];

  const formatDueText = (dueDateStr: string) => {
    if (!currentTime) return "Due soon";
    const dueTime = new Date(dueDateStr).getTime();
    const diffHours = Math.round((dueTime - currentTime) / (1000 * 60 * 60));
    if (diffHours <= 0) return "Due now";
    if (diffHours < 24) return `Due in ${diffHours}h`;
    const diffDays = Math.ceil(diffHours / 24);
    return `Due in ${diffDays}d`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Breadcrumb & Return to Library */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#99958E]">
        <Link
          href="/developer"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#383431] hover:text-[#272624] transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#383431] group-hover:-translate-x-1 transition" />
          <span>Return to Question Library</span>
        </Link>
        <span className="text-xs font-mono text-[#383431]">
          Browser-local spaced repetition
        </span>
      </div>

      {/* Header Summary */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#C9A28E]/40 border border-[#A34823]/30 text-[#A34823]">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Spaced Practice Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#272624] tracking-tight">
          Revision Queue & Personal Mistake Journal
        </h1>
        <p className="text-sm sm:text-base text-[#383431] max-w-3xl leading-relaxed">
          Questions are scheduled based on your self-reported confidence. Reviewing problems right before you forget cements reactive interview patterns into permanent recall.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Due Now */}
        <button
          type="button"
          onClick={() => setActiveTab("due")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer shadow-sm ${
            activeTab === "due"
              ? "bg-[#BBB7B0] border-2 border-[#A34823]"
              : "bg-[#CFCCC6] border-[#99958E] hover:bg-[#BBB7B0]/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#383431]">Due Now</span>
            <Flame
              className={`w-4 h-4 ${
                dueItems.length > 0 ? "text-[#A34823]" : "text-[#5A5652]"
              }`}
            />
          </div>
          <div className="text-2xl font-bold text-[#272624] mt-1">
            {dueItems.length}
          </div>
          <div className="text-[11px] text-[#383431] mt-0.5">
            {dueItems.length === 1 ? "1 question ready" : `${dueItems.length} questions ready`}
          </div>
        </button>

        {/* Upcoming */}
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer shadow-sm ${
            activeTab === "upcoming"
              ? "bg-[#BBB7B0] border-2 border-[#A34823]"
              : "bg-[#CFCCC6] border-[#99958E] hover:bg-[#BBB7B0]/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#383431]">Upcoming</span>
            <Calendar className="w-4 h-4 text-[#A34823]" />
          </div>
          <div className="text-2xl font-bold text-[#272624] mt-1">
            {upcomingItems.length}
          </div>
          <div className="text-[11px] text-[#383431] mt-0.5">
            Scheduled intervals
          </div>
        </button>

        {/* Bookmarked */}
        <button
          type="button"
          onClick={() => setActiveTab("bookmarks")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer shadow-sm ${
            activeTab === "bookmarks"
              ? "bg-[#BBB7B0] border-2 border-[#A34823]"
              : "bg-[#CFCCC6] border-[#99958E] hover:bg-[#BBB7B0]/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#383431]">Bookmarks</span>
            <Bookmark className="w-4 h-4 text-[#A34823]" />
          </div>
          <div className="text-2xl font-bold text-[#272624] mt-1">
            {bookmarkedQuestions.length}
          </div>
          <div className="text-[11px] text-[#383431] mt-0.5">
            Saved for focus
          </div>
        </button>

        {/* Mistakes */}
        <button
          type="button"
          onClick={() => setActiveTab("mistakes")}
          className={`p-4 rounded-xl border text-left transition cursor-pointer shadow-sm ${
            activeTab === "mistakes"
              ? "bg-[#BBB7B0] border-2 border-[#A34823]"
              : "bg-[#CFCCC6] border-[#99958E] hover:bg-[#BBB7B0]/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#383431]">Mistakes</span>
            <BookOpen className="w-4 h-4 text-[#A34823]" />
          </div>
          <div className="text-2xl font-bold text-[#272624] mt-1">
            {mistakes.length}
          </div>
          <div className="text-[11px] text-[#383431] mt-0.5">
            Recorded takeaways
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#99958E] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("due")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === "due"
              ? "bg-[#A34823] text-white shadow-xs"
              : "text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]"
          }`}
        >
          Due Now ({dueItems.length})
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === "upcoming"
              ? "bg-[#A34823] text-white shadow-xs"
              : "text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]"
          }`}
        >
          Upcoming ({upcomingItems.length})
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === "bookmarks"
              ? "bg-[#A34823] text-white shadow-xs"
              : "text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]"
          }`}
        >
          Bookmarked ({bookmarkedQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab("mistakes")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === "mistakes"
              ? "bg-[#A34823] text-white shadow-xs"
              : "text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]"
          }`}
        >
          Mistake Journal ({mistakes.length})
        </button>
      </div>

      {/* Tab 1: Due Now */}
      {activeTab === "due" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {dueItems.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#BBB7B0] text-[#A34823] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-semibold text-[#272624]">
                  No questions currently due for review!
                </h3>
                <p className="text-xs text-[#383431] leading-relaxed">
                  You are all caught up on your spaced revisions. Keep your momentum going by attempting fresh questions from the library.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/developer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition cursor-pointer"
                >
                  <span>Explore Question Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {dueItems.map((rev) => {
                const q = questionMap.get(rev.questionSlug);
                if (!q) return null;

                return (
                  <div
                    key={rev.questionSlug}
                    className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#A34823]/50 transition group"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TopicBadge topicId={q.topic} />
                        <ModeBadge mode={q.mode} />
                        <WebDevDifficultyBadge difficulty={q.difficulty} />
                        <span className="text-[11px] font-mono text-[#A34823] bg-[#C9A28E]/40 px-2 py-0.5 rounded border border-[#A34823]/30 font-medium">
                          {formatDueText(rev.dueDate)}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-[#272624] group-hover:text-[#A34823] transition">
                        {q.title}
                      </h2>
                      <p className="text-xs text-[#383431] line-clamp-1">
                        {q.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-[11px] font-mono text-[#383431]">
                          Interval: {rev.intervalDays}d
                        </div>
                        <div className="text-[11px] font-mono text-[#5A5652]">
                          Streak: {rev.consecutiveSuccesses}
                        </div>
                      </div>
                      <Link
                        href={`/developer/practice/${q.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revise Now</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Upcoming */}
      {activeTab === "upcoming" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {upcomingItems.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-3 shadow-sm">
              <Calendar className="w-8 h-8 text-[#5A5652] mx-auto" />
              <p className="text-xs text-[#383431]">
                No future revisions scheduled yet. Rate your confidence after practicing to schedule revisions automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingItems.map((rev) => {
                const q = questionMap.get(rev.questionSlug);
                if (!q) return null;

                const dueDate = new Date(rev.dueDate).toLocaleDateString(
                  undefined,
                  { weekday: "short", month: "short", day: "numeric" }
                );

                return (
                  <div
                    key={rev.questionSlug}
                    className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TopicBadge topicId={q.topic} />
                        <ModeBadge mode={q.mode} />
                        <span className="text-[11px] font-mono text-[#383431] bg-[#BBB7B0] px-2 py-0.5 rounded border border-[#99958E]">
                          Due {dueDate} ({formatDueText(rev.dueDate)})
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base font-semibold text-[#272624]">
                        {q.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-[#383431]">
                        Streak: {rev.consecutiveSuccesses}
                      </span>
                      <Link
                        href={`/developer/practice/${q.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#272624] hover:bg-[#A59B9F] bg-[#BBB7B0] border border-[#99958E] transition"
                      >
                        <span>Open Early</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Bookmarks */}
      {activeTab === "bookmarks" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {bookmarkedQuestions.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-3 shadow-sm">
              <Bookmark className="w-8 h-8 text-[#5A5652] mx-auto" />
              <p className="text-xs text-[#383431]">
                You haven&apos;t bookmarked any questions yet. Click the bookmark icon on any challenge header to save it for quick review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarkedQuestions.map((q) => (
                <div
                  key={q.slug}
                  className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <TopicBadge topicId={q.topic} />
                      <ModeBadge mode={q.mode} />
                      <WebDevDifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold text-[#272624]">
                      {q.title}
                    </h2>
                    <p className="text-xs text-[#383431] line-clamp-1">
                      {q.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleBookmark(q.slug)}
                      type="button"
                      className="p-2 rounded-lg text-[#383431] hover:text-rose-600 hover:bg-[#BBB7B0] transition cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/developer/practice/${q.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white transition cursor-pointer"
                    >
                      <span>Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Mistake Journal */}
      {activeTab === "mistakes" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {mistakes.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-3 shadow-sm">
              <BookOpen className="w-8 h-8 text-[#5A5652] mx-auto" />
              <p className="text-xs text-[#383431]">
                Your mistake journal is empty. Record learning takeaways and pitfalls directly inside any practice challenge workspace.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mistakes.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#99958E] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#C9A28E]/40 text-[#A34823] border border-[#A34823]/30 font-semibold">
                        {entry.category.replace("_", " ")}
                      </span>
                      <Link
                        href={`/developer/practice/${entry.questionSlug}`}
                        className="text-xs font-medium text-[#272624] hover:text-[#A34823] hover:underline flex items-center gap-1"
                      >
                        <span>{entry.questionTitle}</span>
                        <ExternalLink className="w-3 h-3 text-[#383431]" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-[#383431]">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => deleteMistakeEntry(entry.id)}
                        type="button"
                        className="text-[#383431] hover:text-rose-600 transition cursor-pointer"
                        title="Delete journal entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-[#272624]">The Mistake:</span>
                    <p className="text-[#383431] leading-relaxed">
                      {entry.mistake}
                    </p>
                  </div>

                  {entry.misunderstanding && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[#383431] font-medium">Misunderstanding:</span>
                      <p className="text-[#383431] leading-relaxed">
                        {entry.misunderstanding}
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-[#BBB7B0]/60 border border-[#99958E] flex items-start gap-2.5 text-xs text-[#272624]">
                    <Lightbulb className="w-4 h-4 text-[#A34823] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#A34823]">
                        Key Takeaway for Next Time:{" "}
                      </span>
                      <span className="text-[#272624]">{entry.keyTakeaway}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
