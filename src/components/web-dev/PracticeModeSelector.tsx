"use client";

import React from "react";
import { MessageSquareText, Bug, Code2, Check, RefreshCw } from "lucide-react";
import { PracticeMode } from "@/types/web-dev";

interface PracticeModeSelectorProps {
  activeMode: PracticeMode | "all";
  onSelectMode: (mode: PracticeMode | "all") => void;
}

const MODES = [
  {
    id: "explain" as PracticeMode,
    label: "EXPLAIN",
    title: "Explain Concepts",
    icon: MessageSquareText,
    accentBorder: "border-sky-500/50 hover:border-sky-400/80",
    activeBg: "bg-sky-500/10 border-sky-500 shadow-sm shadow-sky-500/10",
    badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    description: "Practice explaining technical concepts clearly.",
    example: "Why doesn't await block the entire application?",
  },
  {
    id: "debug" as PracticeMode,
    label: "DEBUG",
    title: "Debug & Diagnose",
    icon: Bug,
    accentBorder: "border-amber-500/50 hover:border-amber-400/80",
    activeBg: "bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    description: "Find the cause of a bug and reason through a fix.",
    example: "Why does a React search show outdated results?",
  },
  {
    id: "build" as PracticeMode,
    label: "BUILD",
    title: "Build Solutions",
    icon: Code2,
    accentBorder: "border-orange-500/50 hover:border-orange-400/80",
    activeBg: "bg-orange-500/10 border-orange-500 shadow-sm shadow-orange-500/10",
    badgeColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    description: "Implement practical components and programming tasks.",
    example: "Build an autocomplete component with keyboard support.",
  },
];

export function PracticeModeSelector({
  activeMode,
  onSelectMode,
}: PracticeModeSelectorProps) {
  return (
    <section aria-labelledby="practice-mode-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="practice-mode-heading" className="text-sm font-mono uppercase tracking-wider text-slate-400">
            Choose Your Practice Mode
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a mode to focus your preparation and filter challenges.
          </p>
        </div>

        {activeMode !== "all" && (
          <button
            onClick={() => onSelectMode("all")}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-orange-400 hover:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/80 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset to all modes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {MODES.map((item) => {
          const isSelected = activeMode === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectMode(isSelected ? "all" : item.id)}
              aria-pressed={isSelected}
              className={`group text-left p-4 rounded-xl border transition flex flex-col justify-between relative cursor-pointer ${
                isSelected
                  ? item.activeBg
                  : "bg-[#0f172a]/60 hover:bg-[#131d33] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${
                        isSelected ? item.badgeColor : "text-slate-400 bg-slate-800/70 border-slate-700/60 group-hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider text-white">
                      {item.label}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/90 text-white border border-slate-700">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Example Quote */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 w-full">
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  <span className="text-slate-400 font-mono text-[10px] uppercase mr-1">e.g.</span>
                  <span className="italic text-slate-300">&ldquo;{item.example}&rdquo;</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
