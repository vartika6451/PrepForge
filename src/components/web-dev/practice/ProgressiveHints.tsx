"use client";

import React from "react";
import { Lightbulb, Eye } from "lucide-react";

interface ProgressiveHintsProps {
  hints: string[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
}

export function ProgressiveHints({
  hints,
  revealedHints,
  onRevealHint,
}: ProgressiveHintsProps) {
  if (!hints || hints.length === 0) return null;

  return (
    <section aria-labelledby="hints-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-[#A34823]" />
          <span id="hints-heading">Progressive Hints</span>
        </div>
        <span className="text-[11px] font-mono text-[#383431]">
          {revealedHints.length} of {hints.length} revealed
        </span>
      </div>

      <div className="space-y-2">
        {hints.map((hint, idx) => {
          const isRevealed = revealedHints.includes(idx);
          const isPreviousRevealed = idx === 0 || revealedHints.includes(idx - 1);

          return (
            <div
              key={idx}
              className={`rounded-xl border transition overflow-hidden ${
                isRevealed
                  ? "border-[#99958E] bg-[#CFCCC6] shadow-xs"
                  : "border-[#99958E] bg-[#CFCCC6]/60"
              }`}
            >
              {isRevealed ? (
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#A34823]">
                    <span className="w-4 h-4 rounded-full bg-[#BBB7B0] text-[#A34823] text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>Hint #{idx + 1}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#272624] leading-relaxed pl-6">
                    {hint}
                  </p>
                </div>
              ) : (
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#383431] font-mono">
                    <span className="w-4 h-4 rounded-full bg-[#BBB7B0] text-[#383431] text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>Hint #{idx + 1}</span>
                  </div>

                  <button
                    onClick={() => onRevealHint(idx)}
                    type="button"
                    disabled={!isPreviousRevealed}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isPreviousRevealed
                        ? "bg-[#A34823] hover:bg-[#8F3D1C] text-white"
                        : "opacity-40 cursor-not-allowed bg-[#BBB7B0] text-[#383431]"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Reveal Hint #{idx + 1}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
