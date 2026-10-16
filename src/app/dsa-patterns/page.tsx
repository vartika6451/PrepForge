import React from "react";
import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { getPatterns, getQuestionCountForPattern } from "@/lib/data";
import { PatternDirectory } from "@/components/dsa/PatternDirectory";

export const metadata: Metadata = {
  title: "18 DSA Patterns Directory",
  description:
    "Master the 18 essential Data Structures and Algorithms problem-solving patterns. Learn recognition cues, common mistakes, and practice curated LeetCode problems.",
};

export default function DSAPatternsPage() {
  const patterns = getPatterns();

  const questionCounts: Record<string, number> = {};
  for (const pat of patterns) {
    questionCounts[pat.slug] = getQuestionCountForPattern(pat.slug);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Problem-Solving Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          DSA Patterns Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The most effective way to crack technical interviews is pattern recognition. Learn to identify the structural hints in problem statements, avoid common traps, and practice with genuine problem links.
        </p>
      </div>

      {/* Directory with live filtering */}
      <PatternDirectory patterns={patterns} questionCounts={questionCounts} />
    </div>
  );
}
