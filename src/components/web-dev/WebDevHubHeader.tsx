"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Clock,
  Flame,
  FileEdit,
} from "lucide-react";
import {
  useUserPracticeStore,
  getRevisionQueue,
} from "@/lib/web-dev-progress";
import { getWebDevQuestionBySlug } from "@/lib/data/web-dev";
import { ModeBadge, WebDevDifficultyBadge } from "./WebDevBadges";

export function WebDevHubHeader() {
  const store = useUserPracticeStore();
  const queue = getRevisionQueue(store);
  const dueCount = queue.dueNow.length;

  // Determine the most relevant unfinished question to resume:
  // 1. lastUnfinishedSlug if set
  // 2. Any attempt with status === 'in_progress'
  // 3. lastVisitedSlug if attempt exists and is in_progress
  const unfinishedQuestion = useMemo(() => {
    if (store.lastUnfinishedSlug) {
      const q = getWebDevQuestionBySlug(store.lastUnfinishedSlug);
      if (q) return { question: q, isUnfinished: true };
    }

    // Check attempts in progress
    const inProgressSlug = Object.keys(store.attempts).find(
      (slug) => store.attempts[slug].status === "in_progress"
    );
    if (inProgressSlug) {
      const q = getWebDevQuestionBySlug(inProgressSlug);
      if (q) return { question: q, isUnfinished: true };
    }

    // Fall back to last visited slug if progress exists
    if (store.lastVisitedSlug) {
      const q = getWebDevQuestionBySlug(store.lastVisitedSlug);
      if (q) return { question: q, isUnfinished: false };
    }

    return null;
  }, [store.lastUnfinishedSlug, store.lastVisitedSlug, store.attempts]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-2">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-between text-xs font-mono text-slate-400"
        >
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-200 transition">
              PrepForge
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-orange-400 font-medium">Web Development</span>
          </div>

          {/* Revision Entry Link */}
          <Link
            href="/developer/revision"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
              dueCount > 0
                ? "bg-orange-500/15 border-orange-500/40 text-orange-300 hover:bg-orange-500/25"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            {dueCount > 0 ? (
              <Flame className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>
              {dueCount > 0
                ? `${dueCount} to revise`
                : "Revision Queue"}
            </span>
          </Link>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Web Development Hub
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Practice real interview questions. Explain concepts, debug problems, and build solutions with spaced revision tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Continue learning card - strictly displayed only when actual progress exists */}
      {unfinishedQuestion && (
        <div className="p-4 sm:p-5 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-slate-900/80 to-[#0f172a] backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-orange-950/10">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold">
              <FileEdit className="w-3.5 h-3.5" />
              <span>
                {unfinishedQuestion.isUnfinished
                  ? "Resume Saved Draft"
                  : "Continue where you left off"}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white truncate">
              {unfinishedQuestion.question.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-0.5">
              <ModeBadge mode={unfinishedQuestion.question.mode} />
              <WebDevDifficultyBadge
                difficulty={unfinishedQuestion.question.difficulty}
              />
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                {unfinishedQuestion.question.estimatedMinutes} mins
              </span>
            </div>
          </div>

          <Link
            href={`/developer/practice/${unfinishedQuestion.question.slug}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs sm:text-sm font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-md shadow-orange-500/20 transition shrink-0"
          >
            <span>Resume Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
