"use client";

import React from "react";
import {
  MessageSquareText,
  Bug,
  Code2,
  Layers,
  RotateCcw,
} from "lucide-react";
import { PracticeMode } from "@/types/web-dev";

interface PracticeModeSelectorProps {
  activeMode: PracticeMode | "all";
  onSelectMode: (mode: PracticeMode | "all") => void;
}

const MODES = [
  {
    id: "all" as const,
    label: "All Modes",
    icon: Layers,
    description: "Browse all curated interview questions across all formats.",
  },
  {
    id: "explain" as const,
    label: "Explain",
    icon: MessageSquareText,
    description: "Reason through concepts, lifecycles, and architectural trade-offs.",
  },
  {
    id: "debug" as const,
    label: "Debug",
    icon: Bug,
    description: "Diagnose subtle runtime bugs, race conditions, and memory leaks.",
  },
  {
    id: "build" as const,
    label: "Build",
    icon: Code2,
    description: "Construct accessible components and resilient production utilities.",
  },
];

export function PracticeModeSelector({
  activeMode,
  onSelectMode,
}: PracticeModeSelectorProps) {
  const currentModeInfo = MODES.find((m) => m.id === activeMode) || MODES[0];

  return (
    <section
      aria-labelledby="practice-mode-heading"
      className="bg-[#CFCCC6] border border-[#99958E] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span
            id="practice-mode-heading"
            className="text-[11px] font-mono uppercase tracking-wider text-[#383431] font-semibold"
          >
            Practice Format
          </span>
          <p className="text-xs text-[#272624] mt-0.5">
            {currentModeInfo.description}
          </p>
        </div>

        {activeMode !== "all" && (
          <button
            onClick={() => onSelectMode("all")}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#383431] hover:text-[#A34823] transition self-start sm:self-center cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Show all</span>
          </button>
        )}
      </div>

      {/* Compact Interactive Segmented Switcher */}
      <div
        role="tablist"
        aria-label="Practice Mode Switcher"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1"
      >
        {MODES.map((item) => {
          const isSelected = activeMode === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectMode(item.id)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                isSelected
                  ? "bg-[#A34823] text-white shadow-xs"
                  : "bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border border-[#99958E]"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isSelected ? "text-white" : "text-[#A34823]"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
