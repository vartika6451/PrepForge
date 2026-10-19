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
    <div className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#99958E]">
        <div>
          <h3 className="text-sm font-semibold text-[#272624] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A34823]" />
            <span>Confidence Assessment &amp; Revision Scheduling</span>
          </h3>
          <p className="text-xs text-[#383431]">
            How confident do you feel after working through this problem?
          </p>
        </div>

        {/* Quick Mistake Journal Access */}
        <button
          onClick={onOpenMistakeJournal}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#272624] bg-[#BBB7B0]/60 hover:bg-[#BBB7B0] border border-[#99958E] transition self-start sm:self-center cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#A34823]" />
          <span>Mistake Journal</span>
          {mistakeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#A34823] text-white text-[10px] flex items-center justify-center font-mono font-semibold">
              {mistakeCount}
            </span>
          )}
        </button>
      </div>

      {justSaved && (
        <div className="p-3 rounded-xl bg-[#BBB7B0] border border-[#A34823] text-[#272624] text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#A34823] shrink-0" />
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
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
            selectedConfidence === "independent"
              ? "bg-[#BBB7B0] border-2 border-[#A34823] shadow-xs"
              : "bg-[#BBB7B0]/40 border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/70"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#272624] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A34823]" />
                Solved Independently
              </span>
              {selectedConfidence === "independent" && (
                <CheckCircle2 className="w-4 h-4 text-[#A34823]" />
              )}
            </div>
            <p className="text-[11px] text-[#383431] leading-relaxed">
              Arrived at the solution without hints or peaking at the answer.
            </p>
          </div>
          <div className="text-[10px] font-mono text-white bg-[#A34823] px-2 py-0.5 rounded w-fit font-medium">
            Revise in ~7 days
          </div>
        </button>

        {/* 2. Needed a Hint */}
        <button
          type="button"
          onClick={() => handleSelect("hint")}
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
            selectedConfidence === "hint"
              ? "bg-[#BBB7B0] border-2 border-[#A34823] shadow-xs"
              : "bg-[#BBB7B0]/40 border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/70"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#272624] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#A34823]" />
                Needed a Hint
              </span>
              {selectedConfidence === "hint" && (
                <CheckCircle2 className="w-4 h-4 text-[#A34823]" />
              )}
            </div>
            <p className="text-[11px] text-[#383431] leading-relaxed">
              Required a nudge from hints to connect the concepts or spot the bug.
            </p>
          </div>
          <div className="text-[10px] font-mono text-[#272624] bg-[#C9A28E] px-2 py-0.5 rounded w-fit font-medium">
            Revise in ~3 days
          </div>
        </button>

        {/* 3. Need More Practice */}
        <button
          type="button"
          onClick={() => handleSelect("need_practice")}
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
            selectedConfidence === "need_practice"
              ? "bg-[#BBB7B0] border-2 border-[#A34823] shadow-xs"
              : "bg-[#BBB7B0]/40 border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/70"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#272624] flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#A34823]" />
                Need More Practice
              </span>
              {selectedConfidence === "need_practice" && (
                <CheckCircle2 className="w-4 h-4 text-[#A34823]" />
              )}
            </div>
            <p className="text-[11px] text-[#383431] leading-relaxed">
              Found this challenging or learned significantly from the reference answer.
            </p>
          </div>
          <div className="text-[10px] font-mono text-[#272624] bg-[#BBB7B0] px-2 py-0.5 rounded w-fit font-medium border border-[#99958E]">
            Revise tomorrow (1 day)
          </div>
        </button>
      </div>

      {/* Revision meta summary */}
      {revision && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#BBB7B0]/50 border border-[#99958E] text-xs text-[#272624]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#A34823]" />
            <span>Next revision due:</span>
            <strong className="font-mono">{formattedDueDate}</strong>
            <span className="text-[11px] font-mono text-[#383431]">
              ({revision.intervalDays} day interval)
            </span>
          </div>

          <div className="text-[11px] font-mono text-[#383431]">
            Consecutive streaks:{" "}
            <span className="text-[#A34823] font-semibold">
              {revision.consecutiveSuccesses}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
