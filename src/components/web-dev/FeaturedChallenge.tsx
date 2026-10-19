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
    <section aria-labelledby="featured-challenge-heading">
      <div className="rounded-2xl border border-[#99958E] bg-[#CFCCC6] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            {/* Header / Label */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-[#A34823] bg-[#C9A28E]/40 border border-[#A34823]/30">
                <Sparkles className="w-3 h-3 text-[#A34823]" />
                <span id="featured-challenge-heading">Featured Challenge</span>
              </span>
              <span className="text-xs text-[#5A5652]">•</span>
              <span className="text-xs text-[#383431] font-mono">
                Recommended for active mode
              </span>
            </div>

            {/* Title & 2-line summary */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#272624] tracking-tight">
                {question.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#383431] leading-relaxed line-clamp-2">
                {question.summary}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <TopicBadge topicId={question.topic} />
              <ModeBadge mode={question.mode} />
              <WebDevDifficultyBadge difficulty={question.difficulty} />
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#383431] ml-1">
                <Clock className="w-3.5 h-3.5 text-[#A34823]" />
                {question.estimatedMinutes} mins
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex items-center lg:self-center">
            <Link
              href={`/developer/practice/${question.slug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#A34823] hover:bg-[#8F3D1C] text-white font-medium text-xs sm:text-sm shadow-xs transition cursor-pointer"
            >
              <span>Start Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
