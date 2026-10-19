"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BarChart2,
  Target,
} from "lucide-react";
import { useUserPracticeStore } from "@/lib/web-dev-progress";
import { computeLearningInsights } from "@/lib/web-dev-insights";
import { getAllWebDevQuestions } from "@/lib/data/web-dev";
import {
  ModeBadge,
  TopicBadge,
} from "../WebDevBadges";

export function ProgressInsightsView() {
  const store = useUserPracticeStore();
  const allQuestions = getAllWebDevQuestions();
  const insights = computeLearningInsights(store, allQuestions);

  const hasAnyProgress =
    insights.totalAttempted > 0 ||
    insights.totalCompleted > 0 ||
    insights.totalMistakes > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Return to Library */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#99958E]">
        <Link
          href="/developer"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#383431] hover:text-[#272624] transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#383431] group-hover:-translate-x-1 transition" />
          <span>Return to Hub</span>
        </Link>
        <span className="text-xs font-mono text-[#383431]">
          Derived from verified browser activity
        </span>
      </div>

      {/* Header Summary */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#C9A28E]/40 border border-[#A34823]/30 text-[#A34823]">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#272624] tracking-tight">
          Personal Progress & Learning Insights
        </h1>
        <p className="text-sm sm:text-base text-[#383431] max-w-3xl leading-relaxed">
          Transparent metrics based entirely on your real practice sessions, rubric self-checks, and spaced revision history.
        </p>
      </div>

      {!hasAnyProgress ? (
        /* Empty State for Fresh Users */
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#BBB7B0] border border-[#99958E] text-[#A34823] mx-auto flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-semibold text-[#272624]">
              No practice activity recorded yet
            </h3>
            <p className="text-xs text-[#383431] leading-relaxed">
              Start practicing questions or try a Quick Interview Round. Detailed analytics, topic-level confidence distributions, and weak-area observations will automatically populate here.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition cursor-pointer"
            >
              <span>Explore Question Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/developer/interview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#99958E] bg-[#BBB7B0] hover:bg-[#A59B9F] text-[#272624] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A34823]" />
              <span>Start Quick Round</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-2 shadow-sm">
              <span className="text-xs font-mono text-[#383431]">Questions Attempted</span>
              <div className="text-2xl sm:text-3xl font-bold text-[#272624]">
                {insights.totalAttempted}
                <span className="text-sm font-normal text-[#383431] ml-1">
                  / {insights.totalQuestions}
                </span>
              </div>
              <div className="w-full bg-[#BBB7B0] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#A34823] h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (insights.totalAttempted / insights.totalQuestions) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-2 shadow-sm">
              <span className="text-xs font-mono text-[#383431]">Completed & Reviewed</span>
              <div className="text-2xl sm:text-3xl font-bold text-[#A34823]">
                {insights.totalCompleted}
                <span className="text-sm font-normal text-[#383431] ml-1">
                  / {insights.totalQuestions}
                </span>
              </div>
              <div className="w-full bg-[#BBB7B0] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#A34823] h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (insights.totalCompleted / insights.totalQuestions) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-2 shadow-sm">
              <span className="text-xs font-mono text-[#383431]">Due for Revision</span>
              <div className="text-2xl sm:text-3xl font-bold text-[#272624] flex items-center justify-between">
                <span>{insights.dueRevisionCount}</span>
                {insights.dueRevisionCount > 0 && (
                  <Link
                    href="/developer/revision"
                    className="text-xs font-mono text-[#A34823] hover:underline flex items-center gap-1 font-normal"
                  >
                    <span>Revise</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="text-[11px] text-[#383431]">
                {insights.dueRevisionCount === 1
                  ? "1 challenge needs review"
                  : `${insights.dueRevisionCount} challenges need review`}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-2 shadow-sm">
              <span className="text-xs font-mono text-[#383431]">Mistakes Recorded</span>
              <div className="text-2xl sm:text-3xl font-bold text-[#272624] flex items-center justify-between">
                <span>{insights.totalMistakes}</span>
                {insights.totalMistakes > 0 && (
                  <Link
                    href="/developer/revision"
                    className="text-xs font-mono text-[#A34823] hover:underline flex items-center gap-1 font-normal"
                  >
                    <span>Journal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="text-[11px] text-[#383431]">
                Logged takeaways
              </div>
            </div>
          </div>

          {/* Meaningful Weak Areas / Targeted Observations */}
          {insights.weakAreas.length > 0 ? (
            <div className="p-6 rounded-2xl border border-[#99958E] bg-[#BBB7B0]/60 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Areas Needing Attention (Transparent Observations)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.weakAreas.map((wa) => (
                  <div
                    key={wa.topicId}
                    className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <TopicBadge topicId={wa.topicId} />
                      <span className="text-[10px] font-mono text-[#383431]">
                        Sample size: {wa.sampleSize} questions
                      </span>
                    </div>
                    <p className="text-xs text-[#272624] leading-relaxed font-medium">
                      {wa.text}
                    </p>
                    <Link
                      href={`/developer?topic=${wa.topicId}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#A34823] hover:underline pt-1 transition font-medium"
                    >
                      <span>Practice {wa.topicName} questions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] text-xs text-[#383431] flex items-center gap-2.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#A34823] shrink-0" />
              <span>
                {insights.totalCompleted >= 3
                  ? "Great consistency! You have not shown a repeated pattern of difficulty in any single topic."
                  : "Topic observations will appear as you practice questions across different disciplines."}
              </span>
            </div>
          )}

          {/* Topic-by-Topic Breakdown */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#383431] font-semibold">
              Topic Breakdown & Self-Reported Confidence
            </h2>

            <div className="space-y-3">
              {insights.topicInsights.map((ti) => {
                const percent = Math.round(
                  (ti.completed / ti.totalAvailable) * 100
                );

                return (
                  <div
                    key={ti.topicId}
                    className="p-4 sm:p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <TopicBadge topicId={ti.topicId} />
                        <span className="text-xs sm:text-sm font-semibold text-[#272624]">
                          {ti.topicName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-[#383431]">
                          {ti.completed} of {ti.totalAvailable} completed
                        </span>
                        <span className="text-[#A34823] font-semibold">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#BBB7B0] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#A34823] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Confidence Distribution Row & Observation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                      <p className="text-[#383431]">{ti.observation}</p>

                      <div className="flex items-center gap-2 shrink-0">
                        {ti.confidenceBreakdown.independent > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#BBB7B0] text-[#A34823] border border-[#99958E] font-medium">
                            {ti.confidenceBreakdown.independent} independent
                          </span>
                        )}
                        {ti.confidenceBreakdown.hint > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#BBB7B0] text-[#272624] border border-[#99958E]">
                            {ti.confidenceBreakdown.hint} hint used
                          </span>
                        )}
                        {ti.confidenceBreakdown.need_practice > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C9A28E]/40 text-[#272624] border border-[#A34823]/40">
                            {ti.confidenceBreakdown.need_practice} need practice
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mode Distribution & Mistake Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Practice Format Breakdown */}
            <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#383431] font-semibold">
                Practice Format Distribution
              </h2>

              <div className="space-y-3">
                {(["explain", "debug", "build"] as const).map((m) => {
                  const stat = insights.modeDistribution[m];
                  const percent = Math.round((stat.completed / stat.total) * 100);

                  return (
                    <div key={m} className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <ModeBadge mode={m} />
                        <span className="font-mono text-[#383431]">
                          {stat.completed} / {stat.total} completed ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#BBB7B0] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#A34823] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Repeated Mistake Categories */}
            <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#383431] font-semibold">
                  Frequent Mistake Categories
                </h2>
                {insights.mistakeCategories.length > 0 && (
                  <Link
                    href="/developer/revision"
                    className="text-xs text-[#A34823] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>View Journal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {insights.mistakeCategories.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#383431] italic space-y-1">
                  <p>No mistakes recorded yet.</p>
                  <p>
                    Log learnings in the Mistake Journal during practice to identify recurring pitfalls.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {insights.mistakeCategories.map((item) => (
                    <div
                      key={item.category}
                      className="p-3 rounded-xl border border-[#99958E] bg-[#BBB7B0]/60 flex items-center justify-between text-xs"
                    >
                      <span className="text-[#272624] font-medium">
                        {item.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#BBB7B0] text-[#A34823] border border-[#99958E] font-semibold">
                        {item.count} {item.count === 1 ? "time" : "times"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          {insights.recentActivity.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-[#383431] font-semibold">
                Recent Practice Activity
              </h2>

              <div className="space-y-2.5">
                {insights.recentActivity.map((act) => (
                  <div
                    key={act.slug}
                    className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {act.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-[#A34823]" />
                        ) : (
                          <RotateCcw className="w-4 h-4 text-[#383431]" />
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <Link
                          href={`/developer/practice/${act.slug}`}
                          className="font-semibold text-[#272624] hover:text-[#A34823] transition truncate block"
                        >
                          {act.title}
                        </Link>
                        <div className="flex items-center gap-2 text-[11px] text-[#383431]">
                          <TopicBadge topicId={act.topic} />
                          <ModeBadge mode={act.mode} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {act.confidence && (
                        <span className="text-[11px] font-mono text-[#383431]">
                          {act.confidence === "independent"
                            ? "Independent"
                            : act.confidence === "hint"
                            ? "Hint Used"
                            : "Needed Practice"}
                        </span>
                      )}
                      <Link
                        href={`/developer/practice/${act.slug}`}
                        className="p-1.5 rounded-lg text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0] transition"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
