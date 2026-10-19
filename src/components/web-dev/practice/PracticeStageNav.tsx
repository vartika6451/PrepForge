"use client";

import React from "react";
import { Check } from "lucide-react";

export type PracticeStage = "understand" | "attempt" | "review";

interface PracticeStageNavProps {
  currentStage: PracticeStage;
  onSelectStage: (stage: PracticeStage) => void;
  hasDraft: boolean;
  isReviewed: boolean;
}

export function PracticeStageNav({
  currentStage,
  onSelectStage,
  hasDraft,
  isReviewed,
}: PracticeStageNavProps) {
  const stages: Array<{
    id: PracticeStage;
    number: string;
    label: string;
    subtitle: string;
    isDone: boolean;
  }> = [
    {
      id: "understand",
      number: "1",
      label: "Understand",
      subtitle: "Prompt & specs",
      isDone: hasDraft || isReviewed,
    },
    {
      id: "attempt",
      number: "2",
      label: "Attempt",
      subtitle: "Draft solution",
      isDone: isReviewed,
    },
    {
      id: "review",
      number: "3",
      label: "Review",
      subtitle: "Solution & rubric",
      isDone: isReviewed,
    },
  ];

  return (
    <nav
      aria-label="Practice Stages"
      className="bg-[#CFCCC6] rounded-xl border border-[#99958E] p-1.5 shadow-xs"
    >
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
        {stages.map((st) => {
          const isActive = currentStage === st.id;

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStage(st.id)}
              aria-current={isActive ? "step" : undefined}
              className={`group flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 py-2 sm:py-2.5 px-2.5 sm:px-3.5 rounded-lg text-left transition-all duration-150 cursor-pointer select-none ${
                isActive
                  ? "bg-[#A34823] text-white shadow-xs"
                  : "text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]/60"
              }`}
            >
              {/* Step indicator circle */}
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold shrink-0 transition-colors ${
                  isActive
                    ? "bg-white text-[#A34823]"
                    : st.isDone
                    ? "bg-[#BBB7B0] text-[#A34823]"
                    : "bg-[#BBB7B0]/80 text-[#383431] group-hover:text-[#272624]"
                }`}
              >
                {st.isDone && !isActive ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  st.number
                )}
              </span>

              {/* Step text labels */}
              <div className="min-w-0">
                <span
                  className={`block text-xs sm:text-sm font-semibold tracking-tight truncate ${
                    isActive ? "text-white" : "text-[#272624]"
                  }`}
                >
                  {st.label}
                </span>
                <span
                  className={`hidden md:block text-[10px] font-mono leading-none truncate ${
                    isActive ? "text-white/80" : "text-[#383431]"
                  }`}
                >
                  {st.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
