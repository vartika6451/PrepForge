"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  WebDevQuestion,
  InterviewRoundSession,
  InterviewRoundSummary,
  ConfidenceLevel,
} from "@/types/web-dev";
import {
  useUserPracticeStore,
  revealQuestionHint,
  revealQuestionSolution,
  toggleRubricCheck,
  revealQuestionFollowUp,
  getQuestionAttempt,
} from "@/lib/web-dev-progress";
import {
  startNewInterviewRound,
  getActiveInterviewSession,
  updateInterviewQuestionIndex,
  saveInterviewQuestionDraft,
  submitInterviewQuestionAssessment,
  completeInterviewRound,
  abandonInterviewRound,
} from "@/lib/web-dev-interview";
import { getAllWebDevQuestions } from "@/lib/data/web-dev";
import {
  ModeBadge,
  WebDevDifficultyBadge,
  TopicBadge,
} from "../WebDevBadges";
import { ExplainWorkspace } from "../practice/ExplainWorkspace";
import { DebugWorkspace } from "../practice/DebugWorkspace";
import { BuildWorkspace } from "../practice/BuildWorkspace";
import { ProgressiveHints } from "../practice/ProgressiveHints";
import { SolutionReview } from "../practice/SolutionReview";
import { ConfidenceAssessment } from "../practice/ConfidenceAssessment";
import { MistakeJournalModal } from "../practice/MistakeJournalModal";

export function InterviewRoundView() {
  const store = useUserPracticeStore();
  const allQuestions = getAllWebDevQuestions();

  const [activeSession, setActiveSession] = useState<InterviewRoundSession | null>(
    () => getActiveInterviewSession()
  );
  const [roundSummary, setRoundSummary] = useState<InterviewRoundSummary | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  // Map slugs to questions
  const questionMap = new Map<string, WebDevQuestion>();
  allQuestions.forEach((q) => questionMap.set(q.slug, q));

  // Sync activeSession with store changes if store has active session
  const storedActive = store.activeInterviewSession;
  const currentSession =
    activeSession && activeSession.status === "in_progress"
      ? storedActive || activeSession
      : storedActive;

  // Handle Starting a New Round
  const handleStartRound = () => {
    const session = startNewInterviewRound(allQuestions);
    setActiveSession(session);
    setRoundSummary(null);
  };

  // Handle Discarding Round
  const handleAbandon = () => {
    abandonInterviewRound();
    setActiveSession(null);
    setRoundSummary(null);
    setConfirmAbandon(false);
  };

  // Handle Question Navigation
  const handleGoToIndex = (idx: number) => {
    updateInterviewQuestionIndex(idx);
    if (currentSession) {
      setActiveSession({
        ...currentSession,
        currentQuestionIndex: idx,
      });
    }
  };

  const handleNext = () => {
    if (!currentSession) return;
    const nextIdx = currentSession.currentQuestionIndex + 1;
    if (nextIdx < currentSession.questionSlugs.length) {
      handleGoToIndex(nextIdx);
    } else {
      // Last question reached -> Complete round
      const summary = completeInterviewRound(allQuestions);
      setRoundSummary(summary);
      setActiveSession(null);
    }
  };

  const handlePrev = () => {
    if (!currentSession) return;
    const prevIdx = currentSession.currentQuestionIndex - 1;
    if (prevIdx >= 0) {
      handleGoToIndex(prevIdx);
    }
  };

  // -------------------------------------------------------------------------
  // 1. COMPLETION SCREEN
  // -------------------------------------------------------------------------
  if (roundSummary) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8 animate-in fade-in duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#BBB7B0] border border-[#99958E] text-[#A34823] mx-auto flex items-center justify-center shadow-xs">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold">
              Round Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#272624] tracking-tight">
              Technical Interview Summary
            </h1>
            <p className="text-sm text-[#383431] max-w-xl mx-auto leading-relaxed">
              Great work completing this mixed round. Here is your transparent self-assessment breakdown and areas to reinforce before your actual interview.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1 shadow-sm">
            <span className="text-xs font-mono text-[#383431]">Total Questions</span>
            <div className="text-2xl font-bold text-[#272624]">
              {roundSummary.totalQuestions}
            </div>
            <div className="text-[11px] text-[#383431]">5 distinct disciplines</div>
          </div>

          <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1 shadow-sm">
            <span className="text-xs font-mono text-[#383431]">Drafted Answers</span>
            <div className="text-2xl font-bold text-[#272624]">
              {roundSummary.attemptedCount} / {roundSummary.totalQuestions}
            </div>
            <div className="text-[11px] text-[#A34823] font-semibold">Written responses</div>
          </div>

          <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1 shadow-sm">
            <span className="text-xs font-mono text-[#383431]">Solved Cleanly</span>
            <div className="text-2xl font-bold text-[#A34823]">
              {roundSummary.confidenceDistribution.independent}
            </div>
            <div className="text-[11px] text-[#383431]">Independent recall</div>
          </div>

          <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1 shadow-sm">
            <span className="text-xs font-mono text-[#383431]">Revision Needed</span>
            <div className="text-2xl font-bold text-[#272624]">
              {roundSummary.topicsNeedingAttention.length}
            </div>
            <div className="text-[11px] text-[#383431]">Scheduled in queue</div>
          </div>
        </div>

        {/* Topics Needing Attention */}
        {roundSummary.topicsNeedingAttention.length > 0 && (
          <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Questions To Revisit Before Interviews</span>
            </div>
            <p className="text-xs text-[#383431] leading-relaxed">
              These challenges required hints or were marked for more practice. Spaced repetition dates have been automatically scheduled.
            </p>

            <div className="space-y-2.5 pt-1">
              {roundSummary.topicsNeedingAttention.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#99958E] bg-[#BBB7B0]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <TopicBadge topicId={item.topicId} />
                      <span className="text-xs font-medium text-[#272624] truncate">
                        {item.questionTitle}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/developer/practice/${item.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#A34823] hover:bg-[#8F3D1C] transition self-start sm:self-center shrink-0 cursor-pointer"
                  >
                    <span>Practice Individually</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#99958E]">
          <button
            onClick={handleStartRound}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Another Round</span>
          </button>

          <Link
            href="/developer/progress"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-medium border border-[#99958E] bg-[#BBB7B0] hover:bg-[#A59B9F] text-[#272624] transition"
          >
            <span>View Learning Insights</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            href="/developer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-medium text-[#383431] hover:text-[#272624] transition"
          >
            <span>Return to Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 2. START SCREEN (No Active Round)
  // -------------------------------------------------------------------------
  if (!currentSession) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 animate-in fade-in duration-300">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#383431]">
          <Link href="/developer" className="hover:text-[#272624] transition">
            Web Development
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
          <span className="text-[#A34823] font-semibold">Quick Interview Round</span>
        </nav>

        {/* Hero Banner */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#C9A28E]/40 border border-[#A34823]/30 text-[#A34823]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Mock Interview Experience</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#272624] tracking-tight">
            Quick Technical Interview Round
          </h1>

          <p className="text-base sm:text-lg text-[#383431] max-w-2xl leading-relaxed">
            Five questions. Different skills. One focused practice session.
          </p>
        </div>

        {/* Round Composition Cards */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#383431] font-semibold">
            Round Composition (5 Balanced Disciplines)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1.5 shadow-sm">
              <div className="text-xs font-mono text-[#A34823] font-semibold">
                Slot 1 • Core JS / TS
              </div>
              <p className="text-xs text-[#383431]">
                Event loop mechanics, scoping closures, or type system integrity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1.5 shadow-sm">
              <div className="text-xs font-mono text-[#A34823] font-semibold">
                Slot 2 • React Architecture
              </div>
              <p className="text-xs text-[#383431]">
                Hooks lifecycles, re-render avoidance, or practical component builds.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1.5 shadow-sm">
              <div className="text-xs font-mono text-[#A34823] font-semibold">
                Slot 3 • Browser & CSS
              </div>
              <p className="text-xs text-[#383431]">
                DOM event delegation, reflow optimizations, or flexbox/grid layout bugs.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1.5 shadow-sm">
              <div className="text-xs font-mono text-[#A34823] font-semibold">
                Slot 4 • Backend & APIs
              </div>
              <p className="text-xs text-[#383431]">
                REST vs GraphQL, rate limiting, idempotent mutations, or auth flows.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-1.5 sm:col-span-2 lg:col-span-2 shadow-sm">
              <div className="text-xs font-mono text-[#A34823] font-semibold">
                Slot 5 • Security, Databases, or Performance
              </div>
              <p className="text-xs text-[#383431]">
                SQL injection, JWT token storage, Web Vitals, or N+1 query optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Round Parameters */}
        <div className="p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
          <div className="space-y-1">
            <span className="font-semibold text-[#272624]">How This Round Works:</span>
            <p className="text-[#383431] leading-relaxed max-w-xl">
              Questions are selected to match junior-to-mid developer interviews. Write answers, use progressive hints if stuck, and compare your draft against vetted rubrics. Progress autosaves continuously so you can pause or resume anytime.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[#383431] font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#A34823]" />
              ~60-75 mins
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A34823]" />
              Self-Assessed
            </span>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStartRound}
            type="button"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition cursor-pointer"
          >
            <span>Start Technical Interview Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 3. DURING THE ROUND
  // -------------------------------------------------------------------------
  const currentSlug =
    currentSession.questionSlugs[currentSession.currentQuestionIndex];
  const question = questionMap.get(currentSlug);
  const currentResponse = currentSession.responses[currentSlug];

  // Overall question attempt from user practice store
  const attempt = store.attempts[currentSlug] || getQuestionAttempt(currentSlug);

  if (!question) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-[#A34823] mx-auto" />
        <h2 className="text-base font-semibold text-[#272624]">Question not found</h2>
        <button
          onClick={handleAbandon}
          type="button"
          className="px-4 py-2 rounded-lg bg-[#A34823] text-xs text-white cursor-pointer"
        >
          Reset Session
        </button>
      </div>
    );
  }

  const isLastQuestion =
    currentSession.currentQuestionIndex ===
    currentSession.questionSlugs.length - 1;

  const handleSaveExplainDraft = (draft: string) => {
    saveInterviewQuestionDraft(question.slug, draft);
  };

  const handleSaveDebugDraft = (drafts: {
    rootCauseDraft: string;
    fixDraft: string;
  }) => {
    const combined = drafts.fixDraft || drafts.rootCauseDraft;
    saveInterviewQuestionDraft(question.slug, combined);
  };

  const handleSaveBuildDraft = (code: string) => {
    saveInterviewQuestionDraft(question.slug, code);
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

  const handleSubmitConfidence = (level: ConfidenceLevel) => {
    submitInterviewQuestionAssessment(
      question.slug,
      level,
      attempt.hintsRevealed.length,
      attempt.solutionRevealed
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Session Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Left: Progress Counter & Steps */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold">
              Interview Round
            </span>
            <span className="text-[#5A5652]">•</span>
            <span className="text-xs font-mono text-[#383431]">
              Question {currentSession.currentQuestionIndex + 1} of{" "}
              {currentSession.questionSlugs.length}
            </span>
          </div>

          {/* 5 Step Pills */}
          <div className="flex items-center gap-1.5">
            {currentSession.questionSlugs.map((slug, idx) => {
              const resp = currentSession.responses[slug];
              const isCurrent = idx === currentSession.currentQuestionIndex;
              const isAssessed = !!resp?.confidence;

              return (
                <button
                  key={slug}
                  onClick={() => handleGoToIndex(idx)}
                  type="button"
                  title={`Go to Question ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? "w-8 bg-[#A34823] ring-2 ring-[#A34823]/30"
                      : isAssessed
                      ? "w-5 bg-[#C9A28E]"
                      : "w-5 bg-[#BBB7B0] hover:bg-[#99958E]"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Safe Leave / Exit controls */}
        <div className="flex items-center gap-3">
          {confirmAbandon ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#272624]">Discard this round?</span>
              <button
                onClick={handleAbandon}
                type="button"
                className="px-2.5 py-1 rounded text-xs bg-[#A34823] hover:bg-[#8F3D1C] text-white font-medium cursor-pointer"
              >
                Yes, discard
              </button>
              <button
                onClick={() => setConfirmAbandon(false)}
                type="button"
                className="px-2.5 py-1 rounded text-xs bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/developer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#272624] bg-[#BBB7B0] hover:bg-[#A59B9F] border border-[#99958E] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Pause & Return to Hub</span>
              </Link>
              <button
                onClick={() => setConfirmAbandon(true)}
                type="button"
                className="p-1.5 rounded-lg text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0] transition cursor-pointer"
                title="Discard this round"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Question Practice Interface */}
      <div className="space-y-4">
        {/* Question Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          <TopicBadge topicId={question.topic} />
          <ModeBadge mode={question.mode} />
          <WebDevDifficultyBadge difficulty={question.difficulty} />
          <span className="text-xs font-mono text-[#383431] flex items-center gap-1 ml-1">
            <Clock className="w-3.5 h-3.5 text-[#A34823]" />
            {question.estimatedMinutes} mins
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#272624] tracking-tight">
          {question.title}
        </h2>
        <p className="text-sm text-[#383431] max-w-3xl leading-relaxed">
          {question.summary}
        </p>
      </div>

      {/* 2-Column Responsive Practice Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem Scenario & Requirements (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A34823] font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Interview Scenario</span>
            </div>
            <div className="text-xs sm:text-sm text-[#272624] leading-relaxed whitespace-pre-line font-normal">
              {question.scenario}
            </div>
          </section>

          <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-[#272624] font-semibold">
              Task Requirements
            </div>
            <ul className="space-y-3">
              {question.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-[#272624] leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#BBB7B0] text-[#A34823] flex items-center justify-center text-[11px] font-mono shrink-0 mt-0.5 font-semibold">
                    {idx + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {question.starterCode && (
            <section className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-sm">
              <div className="text-xs font-mono uppercase tracking-wider text-[#272624] font-semibold">
                {question.mode === "build"
                  ? "Starter Template"
                  : "Problem Code Snippet"}
              </div>
              <div className="p-4 rounded-xl bg-[#2D2C2A] border border-[#99958E] text-xs font-mono text-[#EDEAE4] overflow-x-auto max-h-[300px] overflow-y-auto leading-relaxed whitespace-pre">
                {question.starterCode}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Workspaces, Hints, Review & Confidence (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {question.mode === "explain" && (
            <ExplainWorkspace
              key={`${question.slug}-${currentSession.id}`}
              initialDraft={
                currentResponse?.draftAnswer || attempt.draftAnswer || ""
              }
              onSaveDraft={handleSaveExplainDraft}
            />
          )}

          {question.mode === "debug" && (
            <DebugWorkspace
              key={`${question.slug}-${currentSession.id}`}
              initialRootCause={attempt.rootCauseDraft || ""}
              initialFix={
                currentResponse?.draftAnswer ||
                attempt.fixDraft ||
                attempt.draftAnswer ||
                ""
              }
              onSaveDraft={handleSaveDebugDraft}
            />
          )}

          {question.mode === "build" && (
            <BuildWorkspace
              key={`${question.slug}-${currentSession.id}`}
              starterCode={question.starterCode}
              initialDraft={
                currentResponse?.draftAnswer || attempt.draftAnswer || ""
              }
              programmingLanguage={question.programmingLanguage || "typescript"}
              onSaveDraft={handleSaveBuildDraft}
            />
          )}

          <ProgressiveHints
            hints={question.hints}
            revealedHints={attempt.hintsRevealed}
            onRevealHint={handleRevealHint}
          />

          <SolutionReview
            question={question}
            attempt={attempt}
            onRevealSolution={handleRevealSolution}
            onToggleRubric={handleToggleRubric}
            onRevealFollowUp={handleRevealFollowUp}
          />

          <ConfidenceAssessment
            attempt={attempt}
            onSubmitConfidence={handleSubmitConfidence}
            onOpenMistakeJournal={() => setIsJournalOpen(true)}
            mistakeCount={
              (store.mistakeJournal || []).filter(
                (m) => m.questionSlug === question.slug
              ).length
            }
          />
        </div>
      </div>

      {/* Bottom Round Navigation Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <button
          onClick={handlePrev}
          disabled={currentSession.currentQuestionIndex === 0}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#272624] bg-[#BBB7B0] hover:bg-[#A59B9F] border border-[#99958E] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Question</span>
        </button>

        <span className="text-xs font-mono text-[#383431]">
          Question {currentSession.currentQuestionIndex + 1} of{" "}
          {currentSession.questionSlugs.length}
        </span>

        <button
          onClick={handleNext}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#A34823] hover:bg-[#8F3D1C] text-white shadow-xs transition active:scale-[0.98] cursor-pointer"
        >
          <span>
            {isLastQuestion ? "Complete & Review Round" : "Next Question"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mistake Journal Modal */}
      <MistakeJournalModal
        questionSlug={question.slug}
        questionTitle={question.title}
        mistakes={store.mistakeJournal || []}
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
    </div>
  );
}
