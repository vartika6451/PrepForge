"use client";

import React, { useState, useEffect } from "react";
import { FormattedMarkdownContent } from "./FormattedMarkdownContent";
import {
  Eye,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  ListChecks,
} from "lucide-react";
import { WebDevQuestion, QuestionAttempt } from "@/types/web-dev";

interface SolutionReviewProps {
  question: WebDevQuestion;
  attempt: QuestionAttempt;
  onRevealSolution: () => void;
  onToggleRubric: (criterionIndex: number) => void;
  onRevealFollowUp: () => void;
}

export function SolutionReview({
  question,
  attempt,
  onRevealSolution,
  onToggleRubric,
  onRevealFollowUp,
}: SolutionReviewProps) {
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);

  const hasDraft =
    attempt.draftAnswer.trim().length > 0 ||
    (attempt.rootCauseDraft && attempt.rootCauseDraft.trim().length > 0);

  const isSolutionVisible = attempt.solutionRevealed || hasDraft;

  useEffect(() => {
    if (hasDraft && !attempt.solutionRevealed) {
      onRevealSolution();
    }
  }, [hasDraft, attempt.solutionRevealed, onRevealSolution]);

  const handleCopy = () => {
    if (!question.referenceAnswer) return;
    navigator.clipboard.writeText(question.referenceAnswer);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleRevealClick = () => {
    if (!hasDraft && !confirmReveal) {
      setConfirmReveal(true);
      return;
    }
    setConfirmReveal(false);
    onRevealSolution();
  };

  if (!isSolutionVisible) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-[#BBB7B0] text-[#A34823] mx-auto flex items-center justify-center">
          <Eye className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base font-semibold text-[#272624]">
            Reference Solution &amp; Self-Evaluation
          </h3>
          <p className="text-xs text-[#383431] leading-relaxed">
            Ready to review? Reveal the vetted reference answer, comprehensive evaluation rubric, common pitfalls, and interview follow-up challenge.
          </p>
        </div>

        {confirmReveal && !hasDraft && (
          <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#BBB7B0]/70 border border-[#99958E] text-[#272624] text-xs text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#A34823] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[#272624]">You haven&apos;t written an answer draft yet.</p>
              <p className="text-[#383431]">
                Writing your thoughts down first mirrors real interviews. You can reveal now to study the solution, but recording a draft first tests recall.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-1">
          {confirmReveal && (
            <button
              onClick={() => setConfirmReveal(false)}
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#272624] border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition cursor-pointer"
            >
              Keep Thinking
            </button>
          )}
          <button
            onClick={handleRevealClick}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{confirmReveal ? "Confirm & Reveal Solution" : "Reveal Reference Solution"}</span>
          </button>
        </div>
      </div>
    );
  }

  const rubric = question.evaluationRubric || [];
  const checkedRubrics = attempt.checkedRubricIndices || [];
  const commonMistakes = question.commonMistakes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Vetted Reference Solution */}
      <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#99958E]">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
            <Sparkles className="w-4 h-4 text-[#A34823]" />
            <span>Vetted Reference Solution</span>
          </div>
          {question.referenceAnswer && (
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[#272624] bg-[#BBB7B0] hover:bg-[#99958E]/40 border border-[#99958E] transition cursor-pointer"
            >
              {copiedSolution ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#A34823]" />
                  <span className="text-[#A34823] font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#383431]" />
                  <span>Copy Solution</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Formatted Reference Text / Code */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#CFCCC6] border border-[#99958E] text-xs sm:text-sm text-[#272624] leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto shadow-xs">
          <FormattedMarkdownContent
            content={question.referenceAnswer || "No reference answer available."}
            defaultLanguage={question.programmingLanguage || "typescript"}
          />
        </div>

        <p className="text-[11px] font-mono text-[#383431]">
          Compare your workspace answer with this reference. Pay close attention to edge cases and system trade-offs.
        </p>
      </section>

      {/* Evaluation Rubric / Checklist */}
      {rubric.length > 0 && (
        <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
              <ListChecks className="w-4 h-4 text-[#A34823]" />
              <span>Self-Evaluation Rubric</span>
            </div>
            <span className="text-xs font-mono text-[#383431]">
              {checkedRubrics.length} of {rubric.length} covered
            </span>
          </div>

          <p className="text-xs text-[#383431] leading-relaxed">
            Check off key points your response adequately covered for self-assessment.
          </p>

          <div className="space-y-2 pt-1">
            {rubric.map((item, idx) => {
              const isChecked = checkedRubrics.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onToggleRubric(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? "bg-[#BBB7B0] border-[#A34823] text-[#272624]"
                      : "bg-[#BBB7B0]/40 border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/70"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isChecked
                        ? "bg-[#A34823] border-[#A34823] text-white"
                        : "border-[#99958E] bg-[#CFCCC6]"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-semibold leading-snug text-[#272624]">
                        {item.criteria}
                      </span>
                      {item.weight && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#BBB7B0] text-[#272624] border border-[#99958E] shrink-0 font-medium">
                          {item.weight}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-[#383431] leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Common Mistakes */}
      {commonMistakes.length > 0 && (
        <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#BBB7B0]/50 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
            <ShieldAlert className="w-4 h-4 text-[#A34823]" />
            <span>Frequent Candidate Pitfalls</span>
          </div>
          <ul className="space-y-1.5 pt-0.5">
            {commonMistakes.map((mistake, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-[#272624] leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] shrink-0 mt-2" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Follow-Up Interview Question */}
      {question.followUpQuestion && (
        <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
            <HelpCircle className="w-4 h-4 text-[#A34823]" />
            <span>Follow-Up Interview Question</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#BBB7B0]/50 border border-[#99958E] text-xs sm:text-sm text-[#272624] leading-relaxed">
            {question.followUpQuestion}
          </div>

          {!attempt.followUpRevealed ? (
            <div className="pt-0.5">
              <button
                onClick={onRevealFollowUp}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#A34823] hover:bg-[#8F3D1C] text-white transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Follow-Up Answer</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-0.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-mono text-[#383431]">
                <span>Follow-Up Solution</span>
                <span className="text-[11px] text-[#A34823] font-semibold">Revealed</span>
              </div>
              <div className="p-4 rounded-xl bg-[#CFCCC6] border border-[#99958E] text-xs sm:text-sm text-[#272624] leading-relaxed shadow-xs">
                <FormattedMarkdownContent
                  content={question.followUpAnswer || "No follow-up answer provided."}
                  defaultLanguage={question.programmingLanguage || "typescript"}
                />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
