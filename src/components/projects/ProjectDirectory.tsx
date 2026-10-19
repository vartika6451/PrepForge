"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Compass, ArrowRight, X, Layers, CheckCircle2 } from "lucide-react";
import { Project } from "@/types";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

interface ProjectDirectoryProps {
  projects: Project[];
}

export function ProjectDirectory({ projects }: ProjectDirectoryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const categories = [
    "all",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Full Stack",
    "AI Applications"
  ];

  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.problemSolved.toLowerCase().includes(search.toLowerCase()) ||
        p.skillsLearned.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === "all" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchDiff =
        selectedDifficulty === "all" ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchSearch && matchCategory && matchDiff;
    });
  }, [projects, search, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
  };

  const hasActiveFilters =
    search !== "" || selectedCategory !== "all" || selectedDifficulty !== "all";

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#383431]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title, problem solved, or skill learned..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#BBB7B0] border border-[#99958E] text-sm text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823]"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#383431] font-mono shrink-0">Track:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
                  selectedCategory === c
                    ? "bg-[#A34823] text-white shadow-sm"
                    : "bg-[#BBB7B0] border border-[#99958E] text-[#383431] hover:text-[#272624]"
                }`}
              >
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary: Difficulty & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#99958E] text-xs text-[#383431]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#383431]">Difficulty:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedDifficulty === diff
                    ? "text-[#A34823] font-semibold bg-[#C9A28E]/40 border border-[#A34823]/30"
                    : "text-[#383431] hover:text-[#272624]"
                }`}
              >
                {diff === "all" ? "All Levels" : diff}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[#383431]">
              Showing {filteredProjects.length} of {projects.length} blueprints
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[#99958E] bg-[#CFCCC6]">
          <Compass className="w-10 h-10 text-[#383431] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-[#272624]">No project blueprints matched</h3>
          <p className="text-xs text-[#383431] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing category and difficulty filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#A34823] hover:bg-[#8F3D1C] transition"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Link
              key={proj.id}
              href={`/projects/${proj.slug}`}
              className="group p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] hover:border-[#A34823]/50 transition flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A34823] font-medium">
                    {proj.category}
                  </span>
                  <DifficultyBadge difficulty={proj.difficulty} />
                </div>

                <h3 className="text-lg font-bold text-[#272624] group-hover:text-[#A34823] transition">
                  {proj.title}
                </h3>

                <p className="text-xs text-[#383431] leading-relaxed line-clamp-3">
                  {proj.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologySlugs.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#BBB7B0] text-[#272624] border border-[#99958E]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#99958E] flex items-center justify-between text-xs text-[#383431]">
                <span className="font-mono">{proj.milestones.length} Phased Milestones</span>
                <span className="text-[#A34823] group-hover:translate-x-1 transition flex items-center gap-1 font-semibold">
                  View Spec <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
