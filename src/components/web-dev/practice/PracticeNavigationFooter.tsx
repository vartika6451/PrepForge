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
    const globalIndex = allQuestions.findIndex(
      (q) => q.slug === currentQuestion.slug
    );
    if (globalIndex !== -1 && globalIndex < allQuestions.length - 1) {
      nextQuestion = allQuestions[globalIndex + 1];
    } else if (allQuestions.length > 0) {
      nextQuestion = allQuestions[0];
    }
  }

  return (
    <div className="pt-6 border-t border-[#99958E] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Return to Library */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
        <Link
          href={`/developer?topic=${currentQuestion.topic}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#272624] bg-[#CFCCC6] hover:bg-[#BBB7B0] border border-[#99958E] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Library</span>
        </Link>

        {/* Revision Queue Quick Link */}
        <Link
          href="/developer/revision"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#272624] bg-[#CFCCC6] hover:bg-[#BBB7B0] border border-[#99958E] transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#A34823]" />
          <span>Revision Queue</span>
          {revisionDueCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-[#A34823] text-white">
              {revisionDueCount}
            </span>
          )}
        </Link>
      </div>

      {/* Next Question Recommendation */}
      {nextQuestion && (
        <Link
          href={`/developer/practice/${nextQuestion.slug}`}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition group w-full sm:w-auto justify-center"
        >
          <div className="text-left flex flex-col sm:items-end">
            <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider font-normal">
              Next Question ({nextQuestion.mode})
            </span>
            <span className="max-w-[200px] sm:max-w-[260px] truncate text-white font-semibold">
              {nextQuestion.title}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition shrink-0" />
        </Link>
      )}
    </div>
  );
}
