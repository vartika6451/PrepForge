import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Clock } from "lucide-react";
import { WebDevQuestion } from "@/types/web-dev";
import { ModeBadge, WebDevDifficultyBadge, TopicBadge } from "./WebDevBadges";

interface FeaturedChallengeProps {
  question: WebDevQuestion;
}

export function FeaturedChallenge({ question }: FeaturedChallengeProps) {
  return (
    <section aria-labelledby="featured-challenge-heading" className="relative">
      <div className="relative rounded-2xl border border-orange-500/25 bg-gradient-to-r from-orange-500/[0.04] via-[#0f172a]/95 to-[#0f172a] p-5 sm:p-6 shadow-sm overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Header / Label */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span id="featured-challenge-heading">Featured challenge</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Curated daily recommendation
              </span>
            </div>

            {/* Title & 2-line description */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {question.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                {question.summary}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <TopicBadge topicId={question.topic} />
              <ModeBadge mode={question.mode} />
              <WebDevDifficultyBadge difficulty={question.difficulty} />
              <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 ml-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {question.estimatedMinutes} mins
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex items-center lg:self-center">
            <Link
              href={`/developer/practice/${question.slug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm shadow-md shadow-orange-500/15 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            >
              <span>Start challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
