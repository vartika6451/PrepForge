"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, ArrowRight, X, Code2 } from "lucide-react";
import { InterviewQuestion, Technology } from "@/types";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

interface InterviewDirectoryProps {
  questions: InterviewQuestion[];
  technologies: Technology[];
}

export function InterviewDirectory({ questions, technologies }: InterviewDirectoryProps) {
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Extract unique topics from questions
  const topics = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (selectedTech === "all" || q.technologySlug === selectedTech) {
        set.add(q.topic);
      }
    });
    return ["all", ...Array.from(set)];
  }, [questions, selectedTech]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        search.trim() === "" ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.explanation.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase());

      const matchTech = selectedTech === "all" || q.technologySlug === selectedTech;
      const matchDiff =
        selectedDifficulty === "all" ||
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchTopic = selectedTopic === "all" || q.topic === selectedTopic;

      return matchSearch && matchTech && matchDiff && matchTopic;
    });
  }, [questions, search, selectedTech, selectedDifficulty, selectedTopic]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTech("all");
    setSelectedDifficulty("all");
    setSelectedTopic("all");
  };

  const hasActiveFilters =
    search !== "" || selectedTech !== "all" || selectedDifficulty !== "all" || selectedTopic !== "all";

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-[#0c1220] space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interview questions by title, keyword, or concept..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Technology Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-mono shrink-0">Tech:</span>
            <button
              onClick={() => {
                setSelectedTech("all");
                setSelectedTopic("all");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
                selectedTech === "all"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              All Tech
            </button>
            {technologies.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTech(t.slug);
                  setSelectedTopic("all");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
                  selectedTech === t.slug
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Topics & Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Topic Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono">Topic:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                {topics.map((top) => (
                  <option key={top} value={top}>
                    {top === "all" ? "All Topics" : top}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono">Difficulty:</span>
              {["all", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2.5 py-0.5 rounded-md transition ${
                    selectedDifficulty === d
                      ? "text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-500">
              Showing {filteredQuestions.length} of {questions.length} questions
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

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-[#0f172a]/30">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-slate-300">No interview questions matched</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing technology and topic filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredQuestions.map((q) => (
            <Link
              key={q.id}
              href={`/interview-questions/${q.technologySlug}/${q.slug}`}
              className="group p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/40 hover:bg-[#131d33] hover:border-purple-500/30 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-400 border border-slate-700">
                      {q.technologySlug}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{q.topic}</span>
                  </div>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                  {q.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {q.explanation}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{q.codeExample ? "Code walkthrough included" : "Conceptual explanation"}</span>
                </span>
                <span className="text-purple-400 group-hover:translate-x-1 transition flex items-center gap-1 font-sans font-medium">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
