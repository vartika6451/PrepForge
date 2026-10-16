import React from "react";
import { formatDifficultyColor } from "@/lib/utils";
import { Difficulty, SkillLevel } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty | SkillLevel | string;
  className?: string;
}

export function DifficultyBadge({ difficulty, className = "" }: DifficultyBadgeProps) {
  const colorClass = formatDifficultyColor(difficulty);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {difficulty}
    </span>
  );
}
