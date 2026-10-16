import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, ArrowRight, ArrowUpRight, Code2, Layers, BookOpen, Compass } from "lucide-react";
import { getTechnologies, getResourcesForTech, getPaidCoursesForTech, getInterviewQuestionsForTech, getProjectsForTech } from "@/lib/data";

export const metadata: Metadata = {
  title: "Developer Hub — Technologies, Roadmaps & Resources",
  description:
    "Curated developer guides for modern full-stack technologies: JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Git, and System Design.",
};

export default function DeveloperHubPage() {
  const technologies = getTechnologies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20">
          <Terminal className="w-3.5 h-3.5" />
          <span>Curated Technology Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Developer Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comprehensive guides covering core runtime architecture, official documentation, verified video courses, high-frequency interview questions, and real-world projects for modern engineering stacks.
        </p>
      </div>

      {/* Grid of 9 Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((tech) => {
          const freeCount = getResourcesForTech(tech.slug).length;
          const paidCount = getPaidCoursesForTech(tech.slug).length;
          const iqCount = getInterviewQuestionsForTech(tech.slug).length;
          const projCount = getProjectsForTech(tech.slug).length;

          return (
            <Link
              key={tech.id}
              href={`/developer/${tech.slug}`}
              className="group p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-slate-700 transition flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${tech.colorClass}`}>
                    {tech.category}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    {tech.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {tech.description}
                </p>
              </div>

              {/* Counts metrics */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>{freeCount + paidCount} Resources</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-purple-400" />
                    <span>{iqCount} Interview Qs</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-orange-400 pt-1 font-medium">
                  <span>Explore Masterclass</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
