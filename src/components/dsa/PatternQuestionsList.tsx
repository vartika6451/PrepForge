"use client";

import React, { useState, useMemo } from "react";
import { ExternalLink, Search } from "lucide-react";
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
      <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#383431]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter problems in this pattern..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#BBB7B0]/60 border border-[#99958E] text-xs text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823]"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#383431] font-mono font-medium">Difficulty:</span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                selectedDifficulty === d
                  ? "bg-[#A34823] text-white font-medium shadow-xs"
                  : "bg-[#BBB7B0] text-[#272624] hover:bg-[#AAA7A3] border border-[#99958E]"
              }`}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#383431] font-mono font-medium">Platform:</span>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                selectedPlatform === p
                  ? "bg-[#A34823] text-white font-medium shadow-xs"
                  : "bg-[#BBB7B0] text-[#272624] hover:bg-[#AAA7A3] border border-[#99958E]"
              }`}
            >
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Cards List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-[#99958E] bg-[#CFCCC6] text-[#383431] text-xs">
          No problems matched the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((question, index) => (
            <div
              key={question.id}
              className="p-5 rounded-xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[#272624] bg-[#BBB7B0] border border-[#99958E]">
                    Step {question.recommendedOrder || index + 1}
                  </span>
                  <DifficultyBadge difficulty={question.difficulty} />
                  <PlatformBadge platform={question.platform} />
                </div>

                <h4 className="text-base font-bold text-[#272624]">
                  {question.title}
                </h4>

                <p className="text-xs text-[#383431] leading-relaxed">
                  <strong className="text-[#272624] font-mono">Strategy Note: </strong>
                  {question.editorialNote}
                </p>
              </div>

              {/* External Link Button */}
              <a
                href={question.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#A34823] hover:bg-[#8F3D1C] transition shrink-0 shadow-xs"
              >
                <span>Solve on {question.platform}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
