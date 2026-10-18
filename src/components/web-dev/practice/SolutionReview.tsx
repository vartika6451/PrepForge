"use client";

import React, { useState } from "react";
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

  const handleCopy = () => {
    if (!question.referenceAnswer) return;
    navigator.clipboard.writeText(question.referenceAnswer);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleRevealClick = () => {
    // If the user hasn't written any draft yet, prompt a gentle confirmation
    if (!hasDraft && !confirmReveal) {
      setConfirmReveal(true);
      return;
    }
    setConfirmReveal(false);
    onRevealSolution();
  };

  if (!attempt.solutionRevealed) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center">
          <Eye className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base font-semibold text-white">
            Reference Solution & Self-Evaluation
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ready to review? Reveal the vetted reference answer, comprehensive evaluation rubric, common pitfalls, and interview follow-up challenge.
          </p>
        </div>

        {confirmReveal && !hasDraft && (
          <div className="max-w-md mx-auto p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">You haven&apos;t written an answer draft yet.</p>
              <p className="text-slate-300">
                Writing your thoughts down first mirrors the real interview setting. If you reveal the answer now, this attempt will be counted as reviewed rather than independently solved.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-1">
          {confirmReveal && (
            <button
              onClick={() => setConfirmReveal(false)}
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Keep Thinking
            </button>
          )}
          <button
            onClick={handleRevealClick}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition active:scale-[0.98]"
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Vetted Reference Solution */}
      <section className="p-6 rounded-2xl border border-orange-500/30 bg-[#0f172a]/90 space-y-4 shadow-xl shadow-orange-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Vetted Reference Solution</span>
          </div>
          {question.referenceAnswer && (
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition"
            >
              {copiedSolution ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Solution</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Formatted Reference Text / Code */}
        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-800/80 overflow-x-auto max-h-[500px] overflow-y-auto">
          {question.referenceAnswer || "No reference answer available."}
        </div>

        <p className="text-[11px] font-mono text-slate-400">
          Tip: Compare your draft above with this reference. Pay close attention to edge cases, system trade-offs, and clarity of explanation.
        </p>
      </section>

      {/* Evaluation Rubric / Checklist */}
      {rubric.length > 0 && (
        <section className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/70 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              <ListChecks className="w-4 h-4 text-orange-400" />
              <span>Self-Evaluation Rubric</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {checkedRubrics.length} of {rubric.length} covered
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Check off each key point your answer adequately addressed. This is for your self-reflection and gap analysis, not an automated grade.
          </p>

          <div className="space-y-2.5 pt-1">
            {rubric.map((item, idx) => {
              const isChecked = checkedRubrics.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onToggleRubric(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isChecked
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-medium leading-snug">
                        {item.criteria}
                      </span>
                      {item.weight && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                          {item.weight}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
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
        <section className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Frequent Candidate Pitfalls</span>
          </div>
          <ul className="space-y-2 pt-1">
            {commonMistakes.map((mistake, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Follow-Up Interview Question */}
      {question.followUpQuestion && (
        <section className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/70 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>Follow-Up Interview Question</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
            {question.followUpQuestion}
          </div>

          {!attempt.followUpRevealed ? (
            <div className="pt-1">
              <button
                onClick={onRevealFollowUp}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Follow-Up Answer</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Follow-Up Solution</span>
                <span className="text-[11px] text-amber-400/80">Revealed</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                {question.followUpAnswer || "No follow-up answer provided."}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
