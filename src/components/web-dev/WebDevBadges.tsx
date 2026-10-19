import React from "react";
import { MessageSquareText, Bug, Code2 } from "lucide-react";
import { PracticeMode, QuestionDifficulty, WebDevTopicId } from "@/types/web-dev";
import { WEB_DEV_TOPICS } from "@/data/web-dev-topics";

export function formatModeLabel(mode: PracticeMode): string {
  switch (mode) {
    case "explain":
      return "Explain";
    case "debug":
      return "Debug";
    case "build":
      return "Build";
  }
}

export function formatDifficultyLabel(diff: QuestionDifficulty): string {
  switch (diff) {
    case "foundation":
      return "Foundation";
    case "applied":
      return "Applied";
    case "challenge":
      return "Challenge";
  }
}

export function ModeBadge({ mode, className = "" }: { mode: PracticeMode; className?: string }) {
  if (mode === "explain") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border border-[#99958E] bg-[#CFCCC6] text-[#272624] ${className}`}
      >
        <MessageSquareText className="w-3 h-3 text-[#A34823]" />
        <span>Explain</span>
      </span>
    );
  }

  if (mode === "debug") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border border-[#99958E] bg-[#CFCCC6] text-[#272624] ${className}`}
      >
        <Bug className="w-3 h-3 text-[#A34823]" />
        <span>Debug</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border border-[#99958E] bg-[#CFCCC6] text-[#272624] ${className}`}
    >
      <Code2 className="w-3 h-3 text-[#A34823]" />
      <span>Build</span>
    </span>
  );
}

export function WebDevDifficultyBadge({
  difficulty,
  className = "",
}: {
  difficulty: QuestionDifficulty;
  className?: string;
}) {
  let styleClass = "";
  if (difficulty === "foundation") {
    styleClass = "border-[#99958E] bg-[#BBB7B0] text-[#383431]";
  } else if (difficulty === "applied") {
    styleClass = "border-[#99958E] bg-[#CFCCC6] text-[#272624] font-medium";
  } else {
    styleClass = "border-[#A34823]/40 bg-[#C9A28E]/40 text-[#272624] font-semibold";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styleClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {formatDifficultyLabel(difficulty)}
    </span>
  );
}

export function TopicBadge({
  topicId,
  className = "",
}: {
  topicId: WebDevTopicId;
  className?: string;
}) {
  const topic = WEB_DEV_TOPICS.find((t) => t.id === topicId);
  const name = topic ? topic.name : topicId;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border border-[#99958E] bg-[#BBB7B0] text-[#272624] ${className}`}
    >
      {name}
    </span>
  );
}
