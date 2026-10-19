"use client";

import React, { useState, useEffect } from "react";
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
import { PracticeStageNav, PracticeStage } from "./practice/PracticeStageNav";
import { PracticeUnderstandStage } from "./practice/PracticeUnderstandStage";
import { PracticeAttemptStage } from "./practice/PracticeAttemptStage";
import { PracticeReviewStage } from "./practice/PracticeReviewStage";
import { MistakeJournalModal } from "./practice/MistakeJournalModal";

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

  const catalog = allQuestions || getAllWebDevQuestions();
  const revisionQueue = getRevisionQueue(store);

  // Determine smart initial stage
  const [stage, setStage] = useState<PracticeStage>(() => {
    if (attempt.status === "completed" || attempt.solutionRevealed) {
      return "review";
    }
    if (attempt.status === "in_progress") {
      return "attempt";
    }
    return "understand";
  });

  const [isJournalOpen, setIsJournalOpen] = useState(false);

  useEffect(() => {
    markQuestionVisited(question.slug);
  }, [question.slug]);

  const handleStageChange = (newStage: PracticeStage) => {
    if (newStage === "review" && hasDraft && !attempt.solutionRevealed) {
      handleRevealSolution();
    }
    setStage(newStage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
    setStage("understand");
  };

  // Find next question in topic or catalog
  const sameTopicQuestions = catalog.filter((q) => q.topic === question.topic);
  const currentTopicIndex = sameTopicQuestions.findIndex((q) => q.slug === question.slug);

  let nextQuestion: WebDevQuestion | null = null;
  if (currentTopicIndex !== -1 && currentTopicIndex < sameTopicQuestions.length - 1) {
    nextQuestion = sameTopicQuestions[currentTopicIndex + 1];
  } else {
    const globalIndex = catalog.findIndex((q) => q.slug === question.slug);
    if (globalIndex !== -1 && globalIndex < catalog.length - 1) {
      nextQuestion = catalog[globalIndex + 1];
    } else if (catalog.length > 0) {
      nextQuestion = catalog[0];
    }
  }

  const questionMistakeCount = mistakes.filter(
    (m) => m.questionSlug === question.slug
  ).length;

  const hasDraft = Boolean(
    (attempt.draftAnswer && attempt.draftAnswer.trim().length > 0) ||
    (attempt.rootCauseDraft && attempt.rootCauseDraft.trim().length > 0)
  );

  const isReviewed = Boolean(
    attempt.solutionRevealed || attempt.status === "completed"
  );

  // Width: 860px max for Explain & Debug, 960px max for Build mode
  const contentWidthClass =
    question.mode === "build" ? "max-w-[960px]" : "max-w-[860px]";

  return (
    <main className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 ${contentWidthClass} space-y-6 sm:space-y-8`}>
      {/* 1. Header: Back link, Topic, Status, Bookmark, Question Title & Summary */}
      <PracticeWorkspaceHeader
        question={question}
        status={attempt.status}
        onResetAttempt={handleResetAttempt}
      />

      {/* 2. Three-Step Practice Flow Segmented Switcher */}
      <PracticeStageNav
        currentStage={stage}
        onSelectStage={handleStageChange}
        hasDraft={hasDraft}
        isReviewed={isReviewed}
      />

      {/* 3. Single Centered Main Stage Content */}
      <div className="pt-1">
        {stage === "understand" && (
          <PracticeUnderstandStage
            question={question}
            onProceedToAttempt={() => handleStageChange("attempt")}
          />
        )}

        {stage === "attempt" && (
          <PracticeAttemptStage
            question={question}
            attempt={attempt}
            onSaveExplainDraft={handleSaveExplainDraft}
            onSaveDebugDraft={handleSaveDebugDraft}
            onSaveBuildDraft={handleSaveBuildDraft}
            onRevealHint={handleRevealHint}
            onBackToUnderstand={() => handleStageChange("understand")}
            onContinueToReview={() => {
              if (hasDraft && !attempt.solutionRevealed) {
                handleRevealSolution();
              }
              handleStageChange("review");
            }}
          />
        )}

        {stage === "review" && (
          <PracticeReviewStage
            question={question}
            attempt={attempt}
            revision={revision}
            nextQuestionSlug={nextQuestion?.slug}
            nextQuestionTitle={nextQuestion?.title}
            revisionDueCount={revisionQueue.dueNow.length}
            onRevealSolution={handleRevealSolution}
            onToggleRubric={handleToggleRubric}
            onRevealFollowUp={handleRevealFollowUp}
            onSubmitConfidence={handleSubmitConfidence}
            onOpenMistakeJournal={() => setIsJournalOpen(true)}
            onBackToAttempt={() => handleStageChange("attempt")}
            mistakeCount={questionMistakeCount}
          />
        )}
      </div>

      {/* 4. Mistake Journal Modal */}
      <MistakeJournalModal
        questionSlug={question.slug}
        questionTitle={question.title}
        mistakes={mistakes}
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
    </main>
  );
}
