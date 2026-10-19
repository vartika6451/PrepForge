"use client";

import React from "react";
import Link from "next/link";
import { BarChart2, ArrowRight, CheckCircle2, RotateCcw, BookOpen } from "lucide-react";
import { useUserPracticeStore } from "@/lib/web-dev-progress";
import { computeLearningInsights } from "@/lib/web-dev-insights";
import { getAllWebDevQuestions } from "@/lib/data/web-dev";

export function ProgressInsightsSnippet() {
  const store = useUserPracticeStore();
  const allQuestions = getAllWebDevQuestions();
  const insights = computeLearningInsights(store, allQuestions);

  const hasProgress =
    insights.totalAttempted > 0 ||
    insights.totalCompleted > 0 ||
    insights.totalMistakes > 0;

  if (!hasProgress) return null;

  return (
    <section
      aria-labelledby="insights-snippet-heading"
      className="p-4 sm:p-5 rounded-xl border border-[#99958E] bg-[#CFCCC6] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
          <BarChart2 className="w-3.5 h-3.5" />
          <span id="insights-snippet-heading">Learning Insights</span>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-[#272624]">
          Personal Practice Readiness
        </h3>
        <p className="text-xs text-[#383431] max-w-xl leading-relaxed">
          Transparent metrics across self-assessment outcomes, topic breakdowns, and revision intervals.
        </p>

        {/* 3 Quick Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs font-mono text-[#272624]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#BBB7B0] border border-[#99958E]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#A34823]" />
            <span>{insights.totalCompleted} Completed</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#BBB7B0] border border-[#99958E]">
            <RotateCcw className="w-3.5 h-3.5 text-[#A34823]" />
            <span>{insights.dueRevisionCount} Due Revision</span>
          </span>
          {insights.totalMistakes > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#BBB7B0] border border-[#99958E]">
              <BookOpen className="w-3.5 h-3.5 text-[#383431]" />
              <span>{insights.totalMistakes} Mistakes</span>
            </span>
          )}
        </div>
      </div>

      <Link
        href="/developer/progress"
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-[#99958E] bg-[#BBB7B0] hover:bg-[#A34823] hover:text-white text-[#272624] transition shrink-0 self-start md:self-center cursor-pointer"
      >
        <span>View Full Insights</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
