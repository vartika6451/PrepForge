"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Sparkles,
  FileEdit,
} from "lucide-react";
import {
  useUserPracticeStore,
  getRevisionQueue,
} from "@/lib/web-dev-progress";
import { getWebDevQuestionBySlug } from "@/lib/data/web-dev";

export function WebDevHubHeader() {
  const store = useUserPracticeStore();
  const queue = getRevisionQueue(store);
  const dueCount = queue.dueNow.length;

  const unfinishedQuestion = useMemo(() => {
    if (store.lastUnfinishedSlug) {
      const q = getWebDevQuestionBySlug(store.lastUnfinishedSlug);
      if (q) return { question: q, isUnfinished: true };
    }

    const inProgressSlug = Object.keys(store.attempts).find(
      (slug) => store.attempts[slug].status === "in_progress"
    );
    if (inProgressSlug) {
      const q = getWebDevQuestionBySlug(inProgressSlug);
      if (q) return { question: q, isUnfinished: true };
    }

    if (store.lastVisitedSlug) {
      const q = getWebDevQuestionBySlug(store.lastVisitedSlug);
      if (q) return { question: q, isUnfinished: false };
    }

    return null;
  }, [store.lastUnfinishedSlug, store.lastVisitedSlug, store.attempts]);

  return (
    <header className="space-y-4">
      {/* Breadcrumb & Navigation Actions */}
      <div className="flex items-center justify-between text-xs font-mono text-[#383431]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#272624] transition">
            PrepForge
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
          <span className="text-[#272624] font-medium">Web Development</span>
        </nav>

        <div className="flex items-center gap-2">
          {/* Quick Interview Round Link */}
          <Link
            href="/developer/interview"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#A34823] text-white hover:bg-[#8F3D1C] transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Interview Round</span>
          </Link>

          {/* Revision Queue Link */}
          <Link
            href="/developer/revision"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#99958E] bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#A34823]" />
            <span>
              Revision Queue
              {dueCount > 0 ? (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#A34823] text-white font-semibold">
                  {dueCount}
                </span>
              ) : null}
            </span>
          </Link>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#272624]">
          Web Development
        </h1>
        <p className="mt-1 text-sm text-[#383431] max-w-2xl leading-relaxed">
          Curated technical interview practice across frontend, backend, and full-stack systems.
        </p>
      </div>

      {/* Continue Practice Unobtrusive Banner */}
      {unfinishedQuestion && (
        <div className="mt-3 p-3.5 sm:p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#BBB7B0] flex items-center justify-center text-[#A34823] shrink-0">
              <FileEdit className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#383431] block">
                {unfinishedQuestion.isUnfinished ? "In Progress Draft" : "Resume Practice"}
              </span>
              <p className="text-sm font-semibold text-[#272624] truncate">
                {unfinishedQuestion.question.title}
              </p>
            </div>
          </div>

          <Link
            href={`/developer/practice/${unfinishedQuestion.question.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#A34823] text-white text-xs font-medium hover:bg-[#8F3D1C] transition shrink-0"
          >
            <span>Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
