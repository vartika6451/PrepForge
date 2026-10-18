"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Target,
  Code2,
  ExternalLink,
  BookOpen,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { WebDevQuestion } from "@/types/web-dev";
import {
  useUserPracticeStore,
  getQuestionAttempt,
  saveQuestionDraft,
  revealQuestionHint,
  revealQuestionSolution,
  toggleRubricCheck,
  revealQuestionFollowUp,
  submitSelfAssessment,
  resetQuestionAttempt,
  markQuestionVisited,
  getRevisionQueue,
} from "@/lib/web-dev-progress";
import { getAllWebDevQuestions } from "@/lib/data/web-dev";
import { PracticeWorkspaceHeader } from "./practice/PracticeWorkspaceHeader";
import { ExplainWorkspace } from "./practice/ExplainWorkspace";
import { DebugWorkspace } from "./practice/DebugWorkspace";
import { BuildWorkspace } from "./practice/BuildWorkspace";
import { ProgressiveHints } from "./practice/ProgressiveHints";
import { SolutionReview } from "./practice/SolutionReview";
import { ConfidenceAssessment } from "./practice/ConfidenceAssessment";
import { MistakeJournalModal } from "./practice/MistakeJournalModal";
import { PracticeNavigationFooter } from "./practice/PracticeNavigationFooter";

interface PracticeQuestionViewProps {
  question: WebDevQuestion;
  allQuestions?: WebDevQuestion[];
}

export function PracticeQuestionView({
  question,
  allQuestions,
}: PracticeQuestionViewProps) {
  const store = useUserPracticeStore();
  const attempt = store.attempts[question.slug] || getQuestionAttempt(question.slug);
  const revision = store.revisions[question.slug];
  const mistakes = store.mistakeJournal || [];

  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load all questions for navigation if not passed
  const catalog = allQuestions || getAllWebDevQuestions();
  const revisionQueue = getRevisionQueue();

  useEffect(() => {
    markQuestionVisited(question.slug);
  }, [question.slug]);

  const handleSaveExplainDraft = (draft: string) => {
    saveQuestionDraft(question.slug, { draftAnswer: draft });
  };

  const handleSaveDebugDraft = (drafts: { rootCauseDraft: string; fixDraft: string }) => {
    saveQuestionDraft(question.slug, {
      rootCauseDraft: drafts.rootCauseDraft,
      fixDraft: drafts.fixDraft,
      draftAnswer: drafts.fixDraft,
    });
  };

  const handleSaveBuildDraft = (code: string) => {
    saveQuestionDraft(question.slug, { draftAnswer: code });
  };

  const handleRevealHint = (index: number) => {
    revealQuestionHint(question.slug, index);
  };

  const handleRevealSolution = () => {
    revealQuestionSolution(question.slug);
  };

  const handleToggleRubric = (idx: number) => {
    toggleRubricCheck(question.slug, idx);
  };

  const handleRevealFollowUp = () => {
    revealQuestionFollowUp(question.slug);
  };

  const handleSubmitConfidence = (level: "independent" | "hint" | "need_practice") => {
    submitSelfAssessment(question.slug, level);
  };

  const handleResetAttempt = () => {
    resetQuestionAttempt(question.slug);
  };

  const handleCopyStarterCode = () => {
    if (!question.starterCode) return;
    navigator.clipboard.writeText(question.starterCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const questionMistakeCount = mistakes.filter(
    (m) => m.questionSlug === question.slug
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">
      {/* 1. Header with Breadcrumb, Title, Metadata, Status & Bookmark */}
      <PracticeWorkspaceHeader
        question={question}
        status={attempt.status}
        onResetAttempt={handleResetAttempt}
      />

      {/* 2. Responsive Workspace Layout:
          Desktop: 2 columns (Left: Problem Context & Requirements, Right: Learner Workspace & Solutions)
          Mobile: 1 column
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem Panel (5 of 12 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interview Scenario */}
          <section className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/70 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold">
              <FileText className="w-4 h-4" />
              <span>Interview Scenario</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {question.scenario}
            </div>
          </section>

          {/* Key Task Requirements */}
          <section className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/70 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              <Target className="w-4 h-4 text-orange-400" />
              <span>Task Requirements</span>
            </div>
            <ul className="space-y-3">
              {question.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 border border-slate-700/80 flex items-center justify-center text-[11px] font-mono shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Starter Code Preview (for Build and Debug modes) */}
          {question.starterCode && (
            <section className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  <Code2 className="w-4 h-4 text-orange-400" />
                  <span>
                    {question.mode === "build"
                      ? "Starter Template"
                      : "Problem Code Snippet"}
                  </span>
                </div>
                <button
                  onClick={handleCopyStarterCode}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white bg-slate-800/80 transition"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[360px] overflow-y-auto leading-relaxed whitespace-pre">
                {question.starterCode}
              </div>
            </section>
          )}

          {/* Skills Tested */}
          <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Skills Assessed</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {question.skillsTested.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* References & Further Reading */}
          {question.references && question.references.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Reference Documentation</span>
              </div>
              <ul className="space-y-1.5">
                {question.references.map((ref, idx) => (
                  <li key={idx}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 hover:underline transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>{ref.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Learner Workspace, Hints, Review & Assessment (7 of 12 cols on desktop) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Mode-Specific Answer Workspace */}
          {question.mode === "explain" && (
            <ExplainWorkspace
              key={`${question.slug}-${attempt.attemptCount}`}
              initialDraft={attempt.draftAnswer}
              onSaveDraft={handleSaveExplainDraft}
            />
          )}

          {question.mode === "debug" && (
            <DebugWorkspace
              key={`${question.slug}-${attempt.attemptCount}`}
              initialRootCause={attempt.rootCauseDraft || ""}
              initialFix={attempt.fixDraft || attempt.draftAnswer || ""}
              onSaveDraft={handleSaveDebugDraft}
            />
          )}

          {question.mode === "build" && (
            <BuildWorkspace
              key={`${question.slug}-${attempt.attemptCount}`}
              starterCode={question.starterCode}
              initialDraft={attempt.draftAnswer}
              programmingLanguage={question.programmingLanguage || "typescript"}
              onSaveDraft={handleSaveBuildDraft}
            />
          )}

          {/* Progressive Hints Component */}
          <ProgressiveHints
            hints={question.hints}
            revealedHints={attempt.hintsRevealed}
            onRevealHint={handleRevealHint}
          />

          {/* Reference Solution, Rubric & Follow-Up */}
          <SolutionReview
            question={question}
            attempt={attempt}
            onRevealSolution={handleRevealSolution}
            onToggleRubric={handleToggleRubric}
            onRevealFollowUp={handleRevealFollowUp}
          />

          {/* Confidence Assessment & Spaced Revision Scheduling */}
          <ConfidenceAssessment
            attempt={attempt}
            revision={revision}
            onSubmitConfidence={handleSubmitConfidence}
            onOpenMistakeJournal={() => setIsJournalOpen(true)}
            mistakeCount={questionMistakeCount}
          />
        </div>
      </div>

      {/* 3. Navigation Footer */}
      <PracticeNavigationFooter
        currentQuestion={question}
        allQuestions={catalog}
        revisionDueCount={revisionQueue.dueNow.length}
      />

      {/* 4. Mistake Journal Modal */}
      <MistakeJournalModal
        questionSlug={question.slug}
        questionTitle={question.title}
        mistakes={mistakes}
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
    </div>
  );
}
