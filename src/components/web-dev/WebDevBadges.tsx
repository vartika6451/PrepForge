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
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-sky-400 bg-sky-500/10 border-sky-500/20 ${className}`}
      >
        <MessageSquareText className="w-3 h-3 text-sky-400" />
        <span>Explain</span>
      </span>
    );
  }

  if (mode === "debug") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-amber-400 bg-amber-500/10 border-amber-500/20 ${className}`}
      >
        <Bug className="w-3 h-3 text-amber-400" />
        <span>Debug</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-orange-400 bg-orange-500/10 border-orange-500/20 ${className}`}
    >
      <Code2 className="w-3 h-3 text-orange-400" />
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
  let colorClass = "";
  if (difficulty === "foundation") {
    colorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  } else if (difficulty === "applied") {
    colorClass = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  } else {
    colorClass = "text-rose-400 bg-rose-500/10 border-rose-500/20";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono text-slate-300 bg-slate-800/80 border border-slate-700/60 ${className}`}
    >
      {name}
    </span>
  );
}
