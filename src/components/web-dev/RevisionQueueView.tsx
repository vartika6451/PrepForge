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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/developer"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-1 transition" />
          <span>Return to Question Library</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">
          Browser-local spaced repetition
        </span>
      </div>

      {/* Header Summary */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-orange-500/10 border border-orange-500/20 text-orange-400">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Spaced Practice Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Revision Queue & Personal Mistake Journal
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Questions are scheduled based on your self-reported confidence. Reviewing problems right before you forget cements reactive interview patterns into permanent recall.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Due Now */}
        <button
          type="button"
          onClick={() => setActiveTab("due")}
          className={`p-4 rounded-xl border text-left transition ${
            activeTab === "due"
              ? "bg-orange-950/30 border-orange-500/50 ring-1 ring-orange-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Due Now</span>
            <Flame
              className={`w-4 h-4 ${
                dueItems.length > 0 ? "text-orange-400" : "text-slate-600"
              }`}
            />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {dueItems.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {dueItems.length === 1 ? "1 question ready" : `${dueItems.length} questions ready`}
          </div>
        </button>

        {/* Upcoming */}
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`p-4 rounded-xl border text-left transition ${
            activeTab === "upcoming"
              ? "bg-slate-800/60 border-amber-500/50 ring-1 ring-amber-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Upcoming</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {upcomingItems.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Scheduled intervals
          </div>
        </button>

        {/* Bookmarked */}
        <button
          type="button"
          onClick={() => setActiveTab("bookmarks")}
          className={`p-4 rounded-xl border text-left transition ${
            activeTab === "bookmarks"
              ? "bg-slate-800/60 border-blue-500/50 ring-1 ring-blue-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Bookmarks</span>
            <Bookmark className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {bookmarkedQuestions.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Saved for focus
          </div>
        </button>

        {/* Mistakes */}
        <button
          type="button"
          onClick={() => setActiveTab("mistakes")}
          className={`p-4 rounded-xl border text-left transition ${
            activeTab === "mistakes"
              ? "bg-slate-800/60 border-purple-500/50 ring-1 ring-purple-500/30"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Mistakes</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {mistakes.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Recorded takeaways
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("due")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === "due"
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Due Now ({dueItems.length})
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === "upcoming"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Upcoming ({upcomingItems.length})
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === "bookmarks"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Bookmarked ({bookmarkedQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab("mistakes")}
          type="button"
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === "mistakes"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Mistake Journal ({mistakes.length})
        </button>
      </div>

      {/* Tab 1: Due Now */}
      {activeTab === "due" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {dueItems.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-semibold text-white">
                  No questions currently due for review!
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are all caught up on your spaced revisions. Keep your momentum going by attempting fresh questions from the library.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/developer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition"
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
                    className="p-5 rounded-2xl border border-orange-500/30 bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-orange-500/50 transition group"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TopicBadge topicId={q.topic} />
                        <ModeBadge mode={q.mode} />
                        <WebDevDifficultyBadge difficulty={q.difficulty} />
                        <span className="text-[11px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                          {formatDueText(rev.dueDate)}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-white group-hover:text-orange-300 transition">
                        {q.title}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {q.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-[11px] font-mono text-slate-400">
                          Interval: {rev.intervalDays}d
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          Streak: {rev.consecutiveSuccesses}
                        </div>
                      </div>
                      <Link
                        href={`/developer/practice/${q.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition"
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
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-3">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
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
                    className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <TopicBadge topicId={q.topic} />
                        <ModeBadge mode={q.mode} />
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          Due {dueDate} ({formatDueText(rev.dueDate)})
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base font-semibold text-white">
                        {q.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-400">
                        Streak: {rev.consecutiveSuccesses}
                      </span>
                      <Link
                        href={`/developer/practice/${q.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
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
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                You haven&apos;t bookmarked any questions yet. Click the bookmark icon on any challenge header to save it for quick review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarkedQuestions.map((q) => (
                <div
                  key={q.slug}
                  className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <TopicBadge topicId={q.topic} />
                      <ModeBadge mode={q.mode} />
                      <WebDevDifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <h2 className="text-sm sm:text-base font-semibold text-white">
                      {q.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {q.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleBookmark(q.slug)}
                      type="button"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/developer/practice/${q.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition"
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
            <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                Your mistake journal is empty. Record learning takeaways and pitfalls directly inside any practice challenge workspace.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mistakes.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {entry.category.replace("_", " ")}
                      </span>
                      <Link
                        href={`/developer/practice/${entry.questionSlug}`}
                        className="text-xs font-medium text-slate-300 hover:text-white hover:underline flex items-center gap-1"
                      >
                        <span>{entry.questionTitle}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(entry.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => deleteMistakeEntry(entry.id)}
                        type="button"
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Delete journal entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-slate-200">The Mistake:</span>
                    <p className="text-slate-300 leading-relaxed">
                      {entry.mistake}
                    </p>
                  </div>

                  {entry.misunderstanding && (
                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400">Misunderstanding:</span>
                      <p className="text-slate-300 leading-relaxed">
                        {entry.misunderstanding}
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-200">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">
                        Key Takeaway for Next Time:{" "}
                      </span>
                      <span>{entry.keyTakeaway}</span>
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
