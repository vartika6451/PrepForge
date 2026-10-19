"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  Clock,
  Sparkles,
} from "lucide-react";
import { WebDevQuestion, QuestionStatus } from "@/types/web-dev";
import { toggleBookmark, useUserPracticeStore } from "@/lib/web-dev-progress";
import { formatModeLabel, formatDifficultyLabel } from "../WebDevBadges";
import { WEB_DEV_TOPICS } from "@/data/web-dev-topics";

interface PracticeWorkspaceHeaderProps {
  question: WebDevQuestion;
  status: QuestionStatus;
  onResetAttempt?: () => void;
}

export function PracticeWorkspaceHeader({
  question,
  status,
  onResetAttempt,
}: PracticeWorkspaceHeaderProps) {
  const store = useUserPracticeStore();
  const bookmarked = (store.bookmarks || []).includes(question.slug);

  const topicObj = WEB_DEV_TOPICS.find((t) => t.id === question.topic);
  const topicName = topicObj ? topicObj.name : question.topic;

  const handleToggleBookmark = () => {
    toggleBookmark(question.slug);
  };

  return (
    <header className="space-y-4">
      {/* 1. Quiet Utility Bar */}
      <div className="flex items-center justify-between gap-3 text-xs font-mono text-[#383431] border-b border-[#99958E]/50 pb-3">
        {/* Left: Minimal Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Link
            href="/developer"
            className="inline-flex items-center gap-1.5 text-[#383431] hover:text-[#272624] transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Web Dev</span>
          </Link>
          <span className="text-[#99958E]">/</span>
          <Link
            href={`/developer?topic=${question.topic}`}
            className="text-[#383431] hover:text-[#272624] transition truncate"
          >
            {topicName}
          </Link>
        </div>

        {/* Right: Subtle Status & Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {status === "completed" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A34823] pr-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}

          {status === "in_progress" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#383431] pr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A34823]" />
              <span>Draft Saved</span>
            </span>
          )}

          {status === "needs_revision" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A34823] pr-1">
              <RotateCcw className="w-3 h-3" />
              <span>Revision Due</span>
            </span>
          )}

          <button
            onClick={handleToggleBookmark}
            type="button"
            title={bookmarked ? "Remove bookmark" : "Bookmark this question"}
            aria-pressed={bookmarked}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              bookmarked
                ? "bg-[#BBB7B0] text-[#A34823]"
                : "text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]/60"
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                bookmarked ? "fill-[#A34823] text-[#A34823]" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {bookmarked ? "Saved" : "Save"}
            </span>
          </button>

          {onResetAttempt && status !== "not_started" && (
            <button
              onClick={onResetAttempt}
              type="button"
              title="Reset current attempt"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]/60 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Editorial Question Header */}
      <div className="space-y-2 pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#272624] tracking-tight leading-snug">
          {question.title}
        </h1>

        <p className="text-sm sm:text-base text-[#383431] leading-relaxed max-w-3xl">
          {question.summary}
        </p>

        {/* Clean, Understated Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#383431]">
          <span className="font-semibold text-[#272624]">{topicName}</span>
          <span className="text-[#99958E]">·</span>
          <span>{formatModeLabel(question.mode)}</span>
          <span className="text-[#99958E]">·</span>
          <span>{formatDifficultyLabel(question.difficulty)}</span>
          <span className="text-[#99958E]">·</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-[#99958E]" />
            ~{question.estimatedMinutes} mins
          </span>
        </div>
      </div>
    </header>
  );
}
