"use client";

import React, { useState, useMemo } from "react";
import { ExternalLink, Filter, CheckCircle2, ArrowUpRight, Search } from "lucide-react";
import { DSAQuestion } from "@/types";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { PlatformBadge } from "@/components/ui/PlatformBadge";

interface PatternQuestionsListProps {
  questions: DSAQuestion[];
}

export function PatternQuestionsList({ questions }: PatternQuestionsListProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [query, setQuery] = useState("");

  const difficulties = ["all", "Easy", "Medium", "Hard"];
  const platforms = ["all", "LeetCode", "HackerRank", "Codeforces"];

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchDiff =
        selectedDifficulty === "all" ||
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchPlat =
        selectedPlatform === "all" ||
        q.platform.toLowerCase() === selectedPlatform.toLowerCase();
      const matchQuery =
        query.trim() === "" ||
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.editorialNote.toLowerCase().includes(query.toLowerCase());

      return matchDiff && matchPlat && matchQuery;
    });
  }, [questions, selectedDifficulty, selectedPlatform, query]);

  return (
    <div className="space-y-6">
      {/* Question Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1220] flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter problems in this pattern..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-mono">Difficulty:</span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedDifficulty === d
                  ? "bg-orange-500 text-white font-medium shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-mono">Platform:</span>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedPlatform === p
                  ? "bg-slate-700 text-white font-medium"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Cards List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-slate-400 text-xs">
          No problems matched the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((question, index) => (
            <div
              key={question.id}
              className="p-5 rounded-xl border border-slate-800 bg-[#0f172a]/40 hover:bg-[#131d33] hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                    Step {question.recommendedOrder || index + 1}
                  </span>
                  <DifficultyBadge difficulty={question.difficulty} />
                  <PlatformBadge platform={question.platform} />
                </div>

                <h4 className="text-base font-bold text-white">
                  {question.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400 font-mono">Strategy Note: </strong>
                  {question.editorialNote}
                </p>
              </div>

              {/* External Link Button */}
              <a
                href={question.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-orange-500 hover:border-orange-500 border border-slate-700 transition shrink-0 group"
              >
                <span>Solve on {question.platform}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
