"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  PracticeMode,
  QuestionDifficulty,
  WebDevTopicId,
  WebDevQuestion,
  QuestionStatus,
} from "@/types/web-dev";
import { WebDevTopicWithCount, getFeaturedQuestion } from "@/lib/data/web-dev";
import { getQuestionStatus, useUserPracticeStore } from "@/lib/web-dev-progress";
import { WebDevHubHeader } from "./WebDevHubHeader";
import { PracticeModeSelector } from "./PracticeModeSelector";
import { DueRevisionBanner } from "./DueRevisionBanner";
import { FeaturedChallenge } from "./FeaturedChallenge";
import { TopicGrid } from "./TopicGrid";
import { QuestionLibrary } from "./QuestionLibrary";
import { ProgressInsightsSnippet } from "./ProgressInsightsSnippet";

interface WebDevHubClientProps {
  initialQuestions: WebDevQuestion[];
  topicsWithCounts: WebDevTopicWithCount[];
}

export function WebDevHubClient({
  initialQuestions,
  topicsWithCounts,
}: WebDevHubClientProps) {
  const store = useUserPracticeStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial params
  const paramMode = searchParams.get("mode") as PracticeMode | null;
  const paramTopic = searchParams.get("topic") as WebDevTopicId | null;

  const validModes: PracticeMode[] = ["explain", "debug", "build"];
  const initialMode: PracticeMode | "all" =
    paramMode && validModes.includes(paramMode) ? paramMode : "all";

  const [activeMode, setActiveMode] = useState<PracticeMode | "all">(initialMode);
  const [activeTopic, setActiveTopic] = useState<WebDevTopicId | "all">(
    paramTopic ? paramTopic : "all"
  );
  const [activeDifficulty, setActiveDifficulty] = useState<QuestionDifficulty | "all">("all");
  const [activeStatus, setActiveStatus] = useState<QuestionStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Update URL param for mode and topic when changed
  const updateUrlParam = (mode: PracticeMode | "all", topic: WebDevTopicId | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "all") {
      params.delete("mode");
    } else {
      params.set("mode", mode);
    }

    if (topic === "all") {
      params.delete("topic");
    } else {
      params.set("topic", topic);
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const handleSelectMode = (mode: PracticeMode | "all") => {
    setActiveMode(mode);
    updateUrlParam(mode, activeTopic);
  };

  const handleSelectTopic = (topic: WebDevTopicId | "all") => {
    setActiveTopic(topic);
    updateUrlParam(activeMode, topic);
  };

  const handleClearAllFilters = () => {
    setActiveMode("all");
    setActiveTopic("all");
    setActiveDifficulty("all");
    setActiveStatus("all");
    setSearchQuery("");
    updateUrlParam("all", "all");
  };

  const hasActiveFilters =
    activeMode !== "all" ||
    activeTopic !== "all" ||
    activeDifficulty !== "all" ||
    activeStatus !== "all" ||
    searchQuery.trim().length > 0;

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return initialQuestions.filter((q) => {
      if (activeMode !== "all" && q.mode !== activeMode) {
        return false;
      }
      if (activeTopic !== "all" && q.topic !== activeTopic) {
        return false;
      }
      if (activeDifficulty !== "all" && q.difficulty !== activeDifficulty) {
        return false;
      }
      if (activeStatus !== "all") {
        const status = getQuestionStatus(q.slug, store);
        if (status !== activeStatus) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase().trim();
        const matchTitle = q.title.toLowerCase().includes(s);
        const matchSummary = q.summary.toLowerCase().includes(s);
        const matchTags = q.tags.some((t) => t.toLowerCase().includes(s));
        const matchSkills = q.skillsTested.some((sk) => sk.toLowerCase().includes(s));
        if (!matchTitle && !matchSummary && !matchTags && !matchSkills) {
          return false;
        }
      }
      return true;
    });
  }, [initialQuestions, activeMode, activeTopic, activeDifficulty, activeStatus, searchQuery, store]);

  // Featured challenge updates predictably with mode
  const featured = useMemo(() => {
    return getFeaturedQuestion(activeMode);
  }, [activeMode]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Section A — Compact header with resume draft and revision badge */}
      <WebDevHubHeader />

      {/* Section B — Quick practice actions: Explain, Debug, Build, Quick Interview Round */}
      <PracticeModeSelector
        activeMode={activeMode}
        onSelectMode={handleSelectMode}
      />

      {/* Section C — Due revision prompt (only shown if revisions are due) */}
      <DueRevisionBanner />

      {/* Section D — Featured challenge */}
      <FeaturedChallenge question={featured} />

      {/* Section E — Explore by topic with real progress */}
      <TopicGrid
        topics={topicsWithCounts}
        activeTopic={activeTopic}
        onSelectTopic={handleSelectTopic}
      />

      {/* Section F — Question library with status filtering */}
      <QuestionLibrary
        questions={filteredQuestions}
        totalQuestionsCount={initialQuestions.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeMode={activeMode}
        onSelectMode={handleSelectMode}
        activeTopic={activeTopic}
        onSelectTopic={handleSelectTopic}
        activeDifficulty={activeDifficulty}
        onSelectDifficulty={setActiveDifficulty}
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
        onClearAllFilters={handleClearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Section G — Small progress insights entry point (only when progress exists) */}
      <ProgressInsightsSnippet />
    </div>
  );
}
