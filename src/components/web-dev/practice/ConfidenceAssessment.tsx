"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Calendar,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { ConfidenceLevel, QuestionAttempt, RevisionItem } from "@/types/web-dev";

interface ConfidenceAssessmentProps {
  attempt: QuestionAttempt;
  revision?: RevisionItem;
  onSubmitConfidence: (level: ConfidenceLevel) => void;
  onOpenMistakeJournal: () => void;
  mistakeCount: number;
}

export function ConfidenceAssessment({
  attempt,
  revision,
  onSubmitConfidence,
  onOpenMistakeJournal,
  mistakeCount,
}: ConfidenceAssessmentProps) {
  const [selectedConfidence, setSelectedConfidence] = useState<
    ConfidenceLevel | undefined
  >(attempt.confidence);
  const [justSaved, setJustSaved] = useState(false);

  const handleSelect = (level: ConfidenceLevel) => {
    setSelectedConfidence(level);
    onSubmitConfidence(level);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const formattedDueDate = revision?.dueDate
    ? new Date(revision.dueDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/80 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Confidence Assessment & Revision Scheduling</span>
          </h3>
          <p className="text-xs text-slate-400">
            How confident do you feel after working through this problem?
          </p>
        </div>

        {/* Quick Mistake Journal Access */}
        <button
          onClick={onOpenMistakeJournal}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition self-start sm:self-center"
        >
          <BookOpen className="w-3.5 h-3.5 text-orange-400" />
          <span>Mistake Journal</span>
          {mistakeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center font-mono">
              {mistakeCount}
            </span>
          )}
        </button>
      </div>

      {justSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Progress saved! Spaced revision scheduled for{" "}
            <strong>{formattedDueDate}</strong>.
          </span>
        </div>
      )}

      {/* 3 Rating Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Solved Independently */}
        <button
          type="button"
          onClick={() => handleSelect("independent")}
          className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between gap-3 ${
            selectedConfidence === "independent"
              ? "bg-emerald-950/30 border-emerald-500/50 text-white ring-1 ring-emerald-500/40"
              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Solved Independently
              </span>
              {selectedConfidence === "independent" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Arrived at the solution without hints or peaking at the answer.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded w-fit">
            Revise in ~7 days
          </div>
        </button>

        {/* 2. Needed a Hint */}
        <button
          type="button"
          onClick={() => handleSelect("hint")}
          className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between gap-3 ${
            selectedConfidence === "hint"
              ? "bg-amber-950/30 border-amber-500/50 text-white ring-1 ring-amber-500/40"
              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Needed a Hint
              </span>
              {selectedConfidence === "hint" && (
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Required a nudge from hints to connect the concepts or spot the bug.
            </p>
          </div>
          <div className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded w-fit">
            Revise in ~3 days
          </div>
        </button>

        {/* 3. Need More Practice */}
        <button
          type="button"
          onClick={() => handleSelect("need_practice")}
          className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between gap-3 ${
            selectedConfidence === "need_practice"
              ? "bg-rose-950/30 border-rose-500/50 text-white ring-1 ring-rose-500/40"
              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Need More Practice
              </span>
              {selectedConfidence === "need_practice" && (
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Found this challenging or learned significantly from the reference answer.
            </p>
          </div>
          <div className="text-[10px] font-mono text-rose-300/80 bg-rose-500/10 px-2 py-0.5 rounded w-fit">
            Revise tomorrow (1 day)
          </div>
        </button>
      </div>

      {/* Revision meta summary */}
      {revision && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Next revision due:</span>
            <strong className="text-white font-mono">{formattedDueDate}</strong>
            <span className="text-[11px] font-mono text-slate-500">
              ({revision.intervalDays} day interval)
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Consecutive streaks:{" "}
            <span className="text-orange-400 font-semibold">
              {revision.consecutiveSuccesses}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
