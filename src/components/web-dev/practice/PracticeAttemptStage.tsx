"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
} from "lucide-react";
import { WebDevQuestion, QuestionAttempt } from "@/types/web-dev";
import { ExplainWorkspace } from "./ExplainWorkspace";
import { DebugWorkspace } from "./DebugWorkspace";
import { BuildWorkspace } from "./BuildWorkspace";

interface PracticeAttemptStageProps {
  question: WebDevQuestion;
  attempt: QuestionAttempt;
  onSaveExplainDraft: (draft: string) => void;
  onSaveDebugDraft: (drafts: { rootCauseDraft: string; fixDraft: string }) => void;
  onSaveBuildDraft: (code: string) => void;
  onRevealHint: (index: number) => void;
  onBackToUnderstand: () => void;
  onContinueToReview: () => void;
}

export function PracticeAttemptStage({
  question,
  attempt,
  onSaveExplainDraft,
  onSaveDebugDraft,
  onSaveBuildDraft,
  onRevealHint,
  onBackToUnderstand,
  onContinueToReview,
}: PracticeAttemptStageProps) {
  const [showPromptRef, setShowPromptRef] = useState(false);
  const [showHints, setShowHints] = useState(
    attempt.hintsRevealed && attempt.hintsRevealed.length > 0
  );

  const hints = question.hints || [];
  const revealedHints = attempt.hintsRevealed || [];
  const nextHintIndex = revealedHints.length;
  const hasMoreHints = nextHintIndex < hints.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Quiet Collapsible Drawer for Problem Reference */}
      <div className="rounded-xl border border-[#99958E] bg-[#CFCCC6] overflow-hidden shadow-xs transition-colors">
        <button
          onClick={() => setShowPromptRef(!showPromptRef)}
          type="button"
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-[#272624] hover:bg-[#BBB7B0]/60 transition cursor-pointer"
        >
          <div className="flex items-center gap-2 font-medium">
            <FileText className="w-3.5 h-3.5 text-[#A34823]" />
            <span>Problem Scenario &amp; Requirements Reference</span>
          </div>
          <div className="flex items-center gap-1 text-[#383431]">
            <span>{showPromptRef ? "Hide" : "Review"}</span>
            {showPromptRef ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {showPromptRef && (
          <div className="px-4 pb-4 pt-2 border-t border-[#99958E]/60 space-y-3 text-xs text-[#272624] leading-relaxed animate-in fade-in duration-150">
            <div>
              <span className="font-semibold text-[#A34823] text-xs block mb-1">
                Scenario
              </span>
              <p className="text-[#383431] whitespace-pre-line">{question.scenario}</p>
            </div>

            <div>
              <span className="font-semibold text-[#A34823] text-xs block mb-1">
                Requirements
              </span>
              <ul className="space-y-1 list-disc pl-4 text-[#383431]">
                {question.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 2. Focused Workspace Area */}
      <div>
        {question.mode === "explain" && (
          <ExplainWorkspace
            key={`${question.slug}-${attempt.attemptCount}`}
            initialDraft={attempt.draftAnswer}
            onSaveDraft={onSaveExplainDraft}
          />
        )}

        {question.mode === "debug" && (
          <DebugWorkspace
            key={`${question.slug}-${attempt.attemptCount}`}
            initialRootCause={attempt.rootCauseDraft || ""}
            initialFix={attempt.fixDraft || attempt.draftAnswer || ""}
            onSaveDraft={onSaveDebugDraft}
          />
        )}

        {question.mode === "build" && (
          <BuildWorkspace
            key={`${question.slug}-${attempt.attemptCount}`}
            starterCode={question.starterCode}
            initialDraft={attempt.draftAnswer}
            programmingLanguage={question.programmingLanguage || "typescript"}
            onSaveDraft={onSaveBuildDraft}
          />
        )}
      </div>

      {/* 3. Subtle, Unobtrusive Hints Accordion */}
      {hints.length > 0 && (
        <div className="border border-[#99958E] bg-[#CFCCC6] rounded-xl overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={() => setShowHints(!showHints)}
              type="button"
              className="flex items-center gap-2 text-xs font-mono text-[#272624] hover:text-[#A34823] transition cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#A34823]" />
              <span className="font-medium">
                Need a hint?{" "}
                <span className="text-[#383431] font-normal">
                  ({revealedHints.length} of {hints.length} revealed)
                </span>
              </span>
              {showHints ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#383431]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#383431]" />
              )}
            </button>

            {hasMoreHints && (
              <button
                onClick={() => {
                  setShowHints(true);
                  onRevealHint(nextHintIndex);
                }}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#A34823] hover:bg-[#BBB7B0]/60 transition cursor-pointer"
              >
                <span>Reveal Hint #{nextHintIndex + 1}</span>
              </button>
            )}
          </div>

          {showHints && revealedHints.length > 0 && (
            <div className="px-4 pb-3.5 pt-1 border-t border-[#99958E]/40 space-y-2 animate-in fade-in duration-150">
              {revealedHints.map((hintIdx) => (
                <div
                  key={hintIdx}
                  className="p-3 rounded-lg bg-[#BBB7B0]/50 border-l-2 border-[#A34823] text-xs space-y-1"
                >
                  <span className="font-mono font-semibold text-[#A34823] text-[11px] block">
                    Hint #{hintIdx + 1}
                  </span>
                  <p className="text-[#272624] leading-relaxed">{hints[hintIdx]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Action Bar */}
      <div className="pt-4 border-t border-[#99958E]/60 flex items-center justify-between">
        <button
          onClick={onBackToUnderstand}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-[#383431] hover:text-[#272624] transition cursor-pointer font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Problem</span>
        </button>

        <button
          onClick={onContinueToReview}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A34823] hover:bg-[#8F3D1C] text-white font-medium text-xs sm:text-sm shadow-xs transition cursor-pointer"
        >
          <span>Check &amp; Compare Solution</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
