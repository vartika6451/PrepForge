"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Layers, ArrowRight, Sparkles, Filter, X } from "lucide-react";
import { Pattern } from "@/types";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

interface PatternDirectoryProps {
  patterns: Pattern[];
  questionCounts: Record<string, number>;
}

export function PatternDirectory({ patterns, questionCounts }: PatternDirectoryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const categories = ["all", "Core Patterns", "Data Structure Patterns", "Advanced Techniques"];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredPatterns = useMemo(() => {
    return patterns.filter((pat) => {
      const matchesSearch =
        search.trim() === "" ||
        pat.name.toLowerCase().includes(search.toLowerCase()) ||
        pat.description.toLowerCase().includes(search.toLowerCase()) ||
        pat.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || pat.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "all" || pat.difficultyLevel === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [patterns, search, selectedCategory, selectedDifficulty]);

  const hasActiveFilters = search !== "" || selectedCategory !== "all" || selectedDifficulty !== "all";

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-[#0c1220] space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patterns by name, tag, or recognition cue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <div className="flex gap-1.5 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Filter: Difficulty & Clear button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500">Difficulty:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedDifficulty === diff
                    ? "text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {diff === "all" ? "All Levels" : diff}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-500">
              Showing {filteredPatterns.length} of {patterns.length} patterns
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Patterns */}
      {filteredPatterns.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-[#0f172a]/30">
          <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-slate-300">No patterns matched your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your query or resetting the category and difficulty filters above.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatterns.map((pat) => {
            const count = questionCounts[pat.slug] || 0;
            return (
              <Link
                key={pat.id}
                href={`/dsa-patterns/${pat.slug}`}
                className="group p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-orange-500/30 transition flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">
                      Pattern #{String(pat.sortOrder).padStart(2, "0")}
                    </span>
                    <DifficultyBadge difficulty={pat.difficultyLevel} />
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                      {pat.name}
                    </h3>
                    <span className="text-[11px] font-mono text-orange-400/90 uppercase tracking-wider">
                      {pat.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {pat.description}
                  </p>

                  {/* Recognition Clues Preview */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Recognition Clue</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      &ldquo;{pat.recognitionHints[0]}&rdquo;
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pat.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">
                    <strong className="text-slate-200">{count}</strong> Curated Problems
                  </span>
                  <span className="text-orange-400 font-medium group-hover:translate-x-1 transition flex items-center gap-1">
                    Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
