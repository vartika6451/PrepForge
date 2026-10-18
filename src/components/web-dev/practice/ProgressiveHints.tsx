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
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Lightbulb className="w-4 h-4" />
          <span id="hints-heading">Progressive Hints</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
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
                  ? "border-amber-500/30 bg-amber-500/[0.03]"
                  : "border-slate-800 bg-[#0f172a]/40"
              }`}
            >
              {isRevealed ? (
                // Revealed hint view
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-amber-400">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>Hint #{idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {hint}
                  </p>
                </div>
              ) : (
                // Locked / reveal trigger view
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>Hint #{idx + 1}</span>
                    <span className="text-slate-400 text-[10px] hidden sm:inline">
                      ({idx === 0 ? "Conceptual guidance" : "Specific clue"})
                    </span>
                  </div>

                  <button
                    onClick={() => onRevealHint(idx)}
                    type="button"
                    disabled={!isPreviousRevealed}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
                      isPreviousRevealed
                        ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20"
                        : "opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-400"
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
