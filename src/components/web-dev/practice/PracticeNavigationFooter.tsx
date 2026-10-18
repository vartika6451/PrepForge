"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { WebDevQuestion } from "@/types/web-dev";

interface PracticeNavigationFooterProps {
  currentQuestion: WebDevQuestion;
  allQuestions: WebDevQuestion[];
  revisionDueCount: number;
}

export function PracticeNavigationFooter({
  currentQuestion,
  allQuestions,
  revisionDueCount,
}: PracticeNavigationFooterProps) {
  // Find next question logically:
  // 1. Next question in same topic
  // 2. Or next question in full catalog
  const sameTopicQuestions = allQuestions.filter(
    (q) => q.topic === currentQuestion.topic
  );
  const currentTopicIndex = sameTopicQuestions.findIndex(
    (q) => q.slug === currentQuestion.slug
  );

  let nextQuestion: WebDevQuestion | null = null;
  if (
    currentTopicIndex !== -1 &&
    currentTopicIndex < sameTopicQuestions.length - 1
  ) {
    nextQuestion = sameTopicQuestions[currentTopicIndex + 1];
  } else {
    // If last in topic, find next in global catalog
    const globalIndex = allQuestions.findIndex(
      (q) => q.slug === currentQuestion.slug
    );
    if (globalIndex !== -1 && globalIndex < allQuestions.length - 1) {
      nextQuestion = allQuestions[globalIndex + 1];
    } else if (allQuestions.length > 0) {
      // Loop back to start
      nextQuestion = allQuestions[0];
    }
  }

  return (
    <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Return to Library */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <Link
          href={`/developer?topic=${currentQuestion.topic}`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Library</span>
        </Link>

        {/* Revision Queue Quick Link */}
        <Link
          href="/developer/revision"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
          <span>Revision Queue</span>
          {revisionDueCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
              {revisionDueCount} due
            </span>
          )}
        </Link>
      </div>

      {/* Next Question Recommendation */}
      {nextQuestion && (
        <Link
          href={`/developer/practice/${nextQuestion.slug}`}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 transition group w-full sm:w-auto justify-center"
        >
          <div className="text-left flex flex-col sm:items-end">
            <span className="text-[10px] font-mono text-orange-100 uppercase tracking-wider font-normal">
              Next Challenge ({nextQuestion.mode.toUpperCase()})
            </span>
            <span className="max-w-[200px] sm:max-w-[260px] truncate text-white">
              {nextQuestion.title}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition shrink-0" />
        </Link>
      )}
    </div>
  );
}
