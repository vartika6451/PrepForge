"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { WebDevQuestion, QuestionStatus } from "@/types/web-dev";
import { ModeBadge, WebDevDifficultyBadge, TopicBadge } from "../WebDevBadges";
import { toggleBookmark, useUserPracticeStore } from "@/lib/web-dev-progress";

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

  const handleToggleBookmark = () => {
    toggleBookmark(question.slug);
  };

  const getStatusBadge = (s: QuestionStatus) => {
    switch (s) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-amber-400 bg-amber-500/10 border-amber-500/20">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </span>
        );
      case "needs_revision":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-rose-400 bg-rose-500/10 border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Due for Revision</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-slate-400 bg-slate-800/80 border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-4 border-b border-slate-800">
      {/* Top navigation row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/developer" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Web Dev</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/developer?topic=${question.topic}`} className="hover:text-white transition">
            {question.topic}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-orange-400 font-medium truncate max-w-[200px] sm:max-w-xs">
            {question.id}
          </span>
        </nav>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {getStatusBadge(status)}

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            type="button"
            title={bookmarked ? "Remove from bookmarks" : "Bookmark for revision"}
            aria-pressed={bookmarked}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              bookmarked
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                : "bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
            <span className="hidden sm:inline">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>

          {/* Reset attempt */}
          {onResetAttempt && status !== "not_started" && (
            <button
              onClick={onResetAttempt}
              type="button"
              title="Start a new attempt (preserves history)"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Retry</span>
            </button>
          )}

          {/* Local storage indicator */}
          <span
            title="Your draft, notes, and progress are saved in this browser's local storage."
            className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800"
          >
            <HardDrive className="w-3 h-3 text-slate-400" />
            <span>Local</span>
          </span>
        </div>
      </div>

      {/* Main Title and Badges */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <TopicBadge topicId={question.topic} />
          <ModeBadge mode={question.mode} />
          <WebDevDifficultyBadge difficulty={question.difficulty} />
          <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 ml-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {question.estimatedMinutes} mins
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {question.title}
        </h1>
      </div>
    </div>
  );
}
