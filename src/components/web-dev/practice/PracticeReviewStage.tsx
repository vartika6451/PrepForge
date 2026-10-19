"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FormattedMarkdownContent } from "./FormattedMarkdownContent";
import {
  Eye,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Columns,
  Maximize2,
} from "lucide-react";
import {
  WebDevQuestion,
  QuestionAttempt,
  ConfidenceLevel,
  RevisionItem,
} from "@/types/web-dev";

interface PracticeReviewStageProps {
  question: WebDevQuestion;
  attempt: QuestionAttempt;
  revision?: RevisionItem;
  nextQuestionSlug?: string;
  nextQuestionTitle?: string;
  revisionDueCount: number;
  onRevealSolution: () => void;
  onToggleRubric: (index: number) => void;
  onRevealFollowUp: () => void;
  onSubmitConfidence: (level: ConfidenceLevel) => void;
  onOpenMistakeJournal: () => void;
  onBackToAttempt: () => void;
  mistakeCount: number;
}

export function PracticeReviewStage({
  question,
  attempt,
  revision,
  nextQuestionSlug,
  nextQuestionTitle,
  revisionDueCount,
  onRevealSolution,
  onToggleRubric,
  onRevealFollowUp,
  onSubmitConfidence,
  onOpenMistakeJournal,
  onBackToAttempt,
  mistakeCount,
}: PracticeReviewStageProps) {
  const [activeTab, setActiveTab] = useState<"solution" | "evaluation" | "followup">(
    "solution"
  );
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);

  const hasDraft =
    Boolean(attempt.draftAnswer && attempt.draftAnswer.trim().length > 0) ||
    Boolean(attempt.rootCauseDraft && attempt.rootCauseDraft.trim().length > 0);

  // Directly show solution and comparison if draft exists or if already revealed
  const isSolutionVisible = attempt.solutionRevealed || hasDraft;

  // Auto-reveal solution if user already typed their answer
  useEffect(() => {
    if (hasDraft && !attempt.solutionRevealed) {
      onRevealSolution();
    }
  }, [hasDraft, attempt.solutionRevealed, onRevealSolution]);

  const handleCopySolution = () => {
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

  const rubric = question.evaluationRubric || [];
  const checkedRubrics = attempt.checkedRubricIndices || [];
  const commonMistakes = question.commonMistakes || [];

  const formattedDueDate = revision?.dueDate
    ? new Date(revision.dueDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Refined Understated Sub-Tab Navigation */}
      <div className="border-b border-[#99958E]/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("solution")}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "solution"
                ? "border-[#A34823] text-[#272624]"
                : "border-transparent text-[#383431] hover:text-[#272624]"
            }`}
          >
            Reference Solution
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("evaluation")}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === "evaluation"
                ? "border-[#A34823] text-[#272624]"
                : "border-transparent text-[#383431] hover:text-[#272624]"
            }`}
          >
            <span>Self-Evaluation</span>
            {rubric.length > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  activeTab === "evaluation"
                    ? "bg-[#BBB7B0] text-[#272624]"
                    : "bg-[#BBB7B0]/60 text-[#383431]"
                }`}
              >
                {checkedRubrics.length}/{rubric.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("followup")}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "followup"
                ? "border-[#A34823] text-[#272624]"
                : "border-transparent text-[#383431] hover:text-[#272624]"
            }`}
          >
            Follow-Up Question
          </button>
        </div>

      </div>

      {/* 2. Sub-Tab Content */}

      {/* A. Solution Tab */}
      {activeTab === "solution" && (
        <div className="space-y-6">
          {!isSolutionVisible ? (
            <div className="p-8 sm:p-10 rounded-2xl border border-dashed border-[#99958E] bg-[#CFCCC6] text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#BBB7B0] text-[#A34823] mx-auto flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-semibold text-[#272624]">
                  Ready to review the reference solution?
                </h3>
                <p className="text-xs text-[#383431] leading-relaxed">
                  Compare your approach against the vetted explanation, code implementation, and key trade-offs.
                </p>
              </div>

              {confirmReveal && !hasDraft && (
                <div className="max-w-md mx-auto p-3.5 rounded-xl bg-[#BBB7B0]/60 border border-[#99958E] text-[#272624] text-xs text-left flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#A34823] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-[#272624]">
                      No draft was recorded in the Attempt stage.
                    </p>
                    <p className="text-[#383431]">
                      Drafting your approach first tests recall. You can reveal now or return to attempt the question first.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
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
                  <span>
                    {confirmReveal ? "Confirm & Reveal Solution" : "Reveal Reference Solution"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. Upper Block: Your Attempt Draft */}
              {hasDraft && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#383431] pb-1 border-b border-[#99958E]/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#A34823]" />
                      <span className="font-semibold text-sm text-[#272624]">Your Attempt</span>
                    </div>
                    <button
                      onClick={onBackToAttempt}
                      type="button"
                      className="text-xs text-[#A34823] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                    >
                      <span>Edit Draft</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-[#CFCCC6] border border-[#99958E] text-xs sm:text-sm text-[#272624] shadow-xs">
                    {attempt.rootCauseDraft && (
                      <div className="mb-4 pb-3 border-b border-[#99958E]/40">
                        <strong className="block text-[11px] font-mono text-[#A34823] uppercase tracking-wider mb-1.5">
                          Root Cause Diagnosis:
                        </strong>
                        <FormattedMarkdownContent
                          content={attempt.rootCauseDraft}
                          defaultLanguage={question.programmingLanguage || "typescript"}
                        />
                      </div>
                    )}
                    {attempt.fixDraft && (
                      <div>
                        <strong className="block text-[11px] font-mono text-[#A34823] uppercase tracking-wider mb-1.5">
                          Proposed Fix:
                        </strong>
                        <FormattedMarkdownContent
                          content={attempt.fixDraft}
                          defaultLanguage={question.programmingLanguage || "typescript"}
                        />
                      </div>
                    )}
                    {!attempt.rootCauseDraft && !attempt.fixDraft && attempt.draftAnswer && (
                      <FormattedMarkdownContent
                        content={attempt.draftAnswer}
                        defaultLanguage={question.programmingLanguage || "typescript"}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* 2. Bottom Block: Vetted Reference Solution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#383431] pb-1 border-b border-[#99958E]/40">
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-[#A34823]">
                    <Sparkles className="w-4 h-4" />
                    <span>Vetted Reference Solution</span>
                  </div>

                  <button
                    onClick={handleCopySolution}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#383431] hover:text-[#272624] transition cursor-pointer"
                  >
                    {copiedSolution ? (
                      <>
                        <Check className="w-3 h-3 text-[#A34823]" />
                        <span className="text-[#A34823]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Solution</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#CFCCC6] border border-[#99958E] text-xs sm:text-sm text-[#272624] shadow-xs">
                  <FormattedMarkdownContent
                    content={question.referenceAnswer}
                    defaultLanguage={question.programmingLanguage || "typescript"}
                  />
                </div>
              </div>

              {/* Collapsible Candidate Pitfalls Drawer */}
              {commonMistakes.length > 0 && (
                <div className="border border-[#99958E] bg-[#CFCCC6] rounded-xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => setShowMistakes(!showMistakes)}
                    type="button"
                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-[#272624] hover:bg-[#BBB7B0]/40 transition cursor-pointer"
                  >
                    <span className="font-semibold text-[#272624]">
                      Candidate Pitfalls &amp; Mistakes ({commonMistakes.length})
                    </span>
                    <div className="flex items-center gap-1 text-[#383431]">
                      <span>{showMistakes ? "Hide" : "Review"}</span>
                      {showMistakes ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {showMistakes && (
                    <ul className="px-4 pb-4 pt-1 border-t border-[#99958E]/50 space-y-2 text-xs sm:text-sm text-[#272624] leading-relaxed">
                      {commonMistakes.map((mistake, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] shrink-0 mt-2" />
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* B. Self-Evaluation Tab */}
      {activeTab === "evaluation" && (
        <div className="space-y-6">
          {/* Quick Draft Callout */}
          {hasDraft && (
            <div className="p-4 rounded-xl bg-[#CFCCC6] border border-[#99958E] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#383431]">
                <span className="font-semibold text-[#A34823] uppercase tracking-wider text-[11px]">
                  Your Draft for Reference
                </span>
                <button
                  onClick={onBackToAttempt}
                  type="button"
                  className="text-xs text-[#A34823] hover:underline cursor-pointer"
                >
                  Edit draft in Attempt stage →
                </button>
              </div>
              <div className="p-3.5 rounded-lg bg-[#BBB7B0]/60 text-xs sm:text-sm text-[#272624] leading-relaxed max-h-[220px] overflow-y-auto">
                {attempt.rootCauseDraft && (
                  <div className="mb-2">
                    <span className="font-semibold text-[#A34823] text-xs block mb-0.5">Root Cause:</span>
                    <FormattedMarkdownContent content={attempt.rootCauseDraft} defaultLanguage={question.programmingLanguage || "typescript"} />
                  </div>
                )}
                {attempt.fixDraft && (
                  <div>
                    <span className="font-semibold text-[#A34823] text-xs block mb-0.5">Proposed Fix:</span>
                    <FormattedMarkdownContent content={attempt.fixDraft} defaultLanguage={question.programmingLanguage || "typescript"} />
                  </div>
                )}
                {!attempt.rootCauseDraft && !attempt.fixDraft && attempt.draftAnswer && (
                  <FormattedMarkdownContent content={attempt.draftAnswer} defaultLanguage={question.programmingLanguage || "typescript"} />
                )}
              </div>
            </div>
          )}

          {/* Rubric Checklist */}
          {rubric.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#272624]">
                    Self-Evaluation Rubric
                  </h3>
                  <p className="text-xs text-[#383431] mt-0.5">
                    Check off key invariants and concepts your solution correctly addressed.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#272624] bg-[#BBB7B0] px-2.5 py-1 rounded-md border border-[#99958E]">
                  {checkedRubrics.length} of {rubric.length} satisfied
                </span>
              </div>

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
                          : "bg-[#CFCCC6] border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition ${
                          isChecked
                            ? "bg-[#A34823] border-[#A34823] text-white"
                            : "border-[#99958E] bg-[#CFCCC6]"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-semibold leading-snug text-[#272624]">
                            {item.criteria}
                          </span>
                          {item.weight && (
                            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#BBB7B0] text-[#272624] shrink-0 font-medium">
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
            </div>
          ) : (
            <p className="text-xs text-[#383431] italic">No rubric criteria available for this question.</p>
          )}
        </div>
      )}

      {/* C. Follow-Up Question Tab */}
      {activeTab === "followup" && (
        <div className="space-y-5">
          {question.followUpQuestion ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold">
                  <HelpCircle className="w-4 h-4 text-[#A34823]" />
                  <span>Interviewer Follow-Up Question</span>
                </div>
                <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] text-xs sm:text-sm text-[#272624] leading-relaxed shadow-xs">
                  {question.followUpQuestion}
                </div>
              </div>

              {!attempt.followUpRevealed ? (
                <div>
                  <button
                    onClick={onRevealFollowUp}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Follow-Up Answer</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <span className="text-xs font-mono text-[#A34823] font-semibold uppercase tracking-wider block">
                    Follow-Up Solution
                  </span>
                  <div className="p-4 rounded-xl bg-[#CFCCC6] border border-[#99958E] text-xs sm:text-sm text-[#272624] leading-relaxed shadow-xs">
                    <FormattedMarkdownContent
                      content={question.followUpAnswer || "No follow-up answer provided."}
                      defaultLanguage={question.programmingLanguage || "typescript"}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-[#99958E] bg-[#CFCCC6] text-xs text-[#383431] italic">
              No follow-up question specified for this prompt. You are ready to record your self-assessment below.
            </div>
          )}
        </div>
      )}

      {/* 3. Final Confidence Assessment & Revision Scheduling */}
      <section className="pt-6 border-t border-[#99958E] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Assessment &amp; Spaced Scheduling</span>
            </h3>
            <p className="text-xs text-[#383431] mt-0.5">
              How did you perform on this question?
            </p>
          </div>

          <button
            onClick={onOpenMistakeJournal}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#272624] bg-[#CFCCC6] hover:bg-[#BBB7B0] border border-[#99958E] transition self-start sm:self-center cursor-pointer"
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

        {/* 3 Confidence Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onSubmitConfidence("independent")}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer ${
              attempt.confidence === "independent"
                ? "bg-[#BBB7B0] border-2 border-[#A34823] shadow-xs"
                : "bg-[#CFCCC6] border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/50"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#272624]">
                  Solved Independently
                </span>
                {attempt.confidence === "independent" && (
                  <Check className="w-4 h-4 text-[#A34823]" />
                )}
              </div>
              <p className="text-[11px] text-[#383431] leading-relaxed">
                Solved correctly without hints or peaking.
              </p>
            </div>
            <span className="text-[10px] font-mono text-white bg-[#A34823] px-2 py-0.5 rounded w-fit font-medium">
              Revise in ~7 days
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSubmitConfidence("hint")}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer ${
              attempt.confidence === "hint"
                ? "bg-[#BBB7B0] border-2 border-[#A34823] shadow-xs"
                : "bg-[#CFCCC6] border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/50"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#272624]">
                  Needed a Hint
                </span>
                {attempt.confidence === "hint" && (
                  <Check className="w-4 h-4 text-[#A34823]" />
                )}
              </div>
              <p className="text-[11px] text-[#383431] leading-relaxed">
                Required a nudge from hints to complete.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#272624] bg-[#C9A28E] px-2 py-0.5 rounded w-fit font-medium">
              Revise in ~3 days
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSubmitConfidence("need_practice")}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer ${
              attempt.confidence === "need_practice"
                ? "bg-[#BBB7B0] border-2 border-[#A34823] shadow-xs"
                : "bg-[#CFCCC6] border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]/50"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#272624]">
                  Need More Practice
                </span>
                {attempt.confidence === "need_practice" && (
                  <Check className="w-4 h-4 text-[#A34823]" />
                )}
              </div>
              <p className="text-[11px] text-[#383431] leading-relaxed">
                Found challenging; learned from reference.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#272624] bg-[#BBB7B0] px-2 py-0.5 rounded w-fit font-medium">
              Revise tomorrow (1 day)
            </span>
          </button>
        </div>

        {revision && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#BBB7B0]/50 border border-[#99958E] text-xs text-[#272624]">
            <span>
              Next revision scheduled for <strong>{formattedDueDate}</strong> ({revision.intervalDays} day interval).
            </span>
            <span className="text-[11px] font-mono text-[#383431]">
              Streak: <strong className="text-[#A34823]">{revision.consecutiveSuccesses}</strong>
            </span>
          </div>
        )}
      </section>

      {/* 4. Bottom Completion & Navigation Actions */}
      <div className="pt-4 border-t border-[#99958E] flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onBackToAttempt}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-[#383431] hover:text-[#272624] transition cursor-pointer font-medium self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Attempt</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/developer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] text-[#272624] transition"
          >
            <span>Return to Hub</span>
          </Link>

          {revisionDueCount > 0 && (
            <Link
              href="/developer/revision"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] text-[#272624] transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#A34823]" />
              <span>Queue ({revisionDueCount})</span>
            </Link>
          )}

          {nextQuestionSlug && (
            <Link
              href={`/developer/practice/${nextQuestionSlug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
