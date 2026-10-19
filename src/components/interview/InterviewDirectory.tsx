"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, ArrowRight, Code2, X } from "lucide-react";
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
      <div className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#383431]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interview questions by title, keyword, or concept..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#BBB7B0]/60 border border-[#99958E] text-sm text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823]"
            />
          </div>

          {/* Technology Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#383431] font-mono shrink-0 font-medium">Tech:</span>
            <button
              onClick={() => {
                setSelectedTech("all");
                setSelectedTopic("all");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition cursor-pointer ${
                selectedTech === "all"
                  ? "bg-[#A34823] text-white shadow-xs"
                  : "bg-[#BBB7B0] border border-[#99958E] text-[#272624] hover:bg-[#AAA7A3]"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition cursor-pointer ${
                  selectedTech === t.slug
                    ? "bg-[#A34823] text-white shadow-xs"
                    : "bg-[#BBB7B0] border border-[#99958E] text-[#272624] hover:bg-[#AAA7A3]"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Topics & Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#99958E]/60 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Topic Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[#383431] font-mono font-medium">Topic:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-[#BBB7B0] border border-[#99958E] rounded-lg px-2.5 py-1 text-[#272624] text-xs focus:outline-none focus:border-[#A34823]"
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
              <span className="text-[#383431] font-mono font-medium">Difficulty:</span>
              {["all", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                    selectedDifficulty === d
                      ? "text-[#A34823] font-bold bg-[#BBB7B0] border border-[#99958E]"
                      : "text-[#383431] hover:text-[#272624]"
                  }`}
                >
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[#383431]">
              Showing {filteredQuestions.length} of {questions.length} questions
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#BBB7B0] border border-[#99958E] text-[#272624] hover:bg-[#AAA7A3] cursor-pointer"
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
        <div className="py-16 text-center rounded-2xl border border-[#99958E] bg-[#CFCCC6]">
          <BookOpen className="w-10 h-10 text-[#383431] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-[#272624]">No interview questions matched</h3>
          <p className="text-xs text-[#383431] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing technology and topic filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#A34823] hover:bg-[#8F3D1C] transition cursor-pointer"
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
              className="group p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#BBB7B0] text-[#272624] border border-[#99958E]">
                      {q.technologySlug}
                    </span>
                    <span className="text-xs font-mono text-[#383431] font-semibold">{q.topic}</span>
                  </div>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>

                <h3 className="text-lg font-bold text-[#272624] group-hover:text-[#A34823] transition">
                  {q.title}
                </h3>

                <p className="text-xs text-[#383431] line-clamp-3 leading-relaxed">
                  {q.explanation}
                </p>
              </div>

              <div className="pt-4 border-t border-[#99958E]/60 flex items-center justify-between text-xs text-[#383431] font-mono">
                <span className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-[#A34823]" />
                  <span>{q.codeExample ? "Code walkthrough included" : "Conceptual explanation"}</span>
                </span>
                <span className="text-[#A34823] group-hover:translate-x-1 transition flex items-center gap-1 font-sans font-semibold">
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
