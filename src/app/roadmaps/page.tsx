import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Hash, ArrowRight, Layers, Clock, Target, CheckCircle2, Terminal, Sparkles } from "lucide-react";
import { getRoadmaps } from "@/lib/data";

export const metadata: Metadata = {
  title: "Structured Developer Career Roadmaps",
  description:
    "End-to-end curriculum tracks connecting DSA problem-solving patterns, full-stack technologies, interview preparation, and portfolio projects.",
};

export default function RoadmapsPage() {
  const roadmaps = getRoadmaps();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
          <Hash className="w-3.5 h-3.5" />
          <span>Curated Preparation Journeys</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Developer Roadmaps
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Structured, step-by-step learning roadmaps that unify DSA algorithmic patterns, modern runtime technologies, technical interview questions, and real-world project milestones.
        </p>
      </div>

      {/* Grid of Roadmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roadmaps.map((rm) => (
          <Link
            key={rm.id}
            href={`/roadmaps/${rm.slug}`}
            className="group p-8 rounded-3xl border border-slate-800 bg-[#0c1220] hover:bg-[#11192e] hover:border-amber-500/30 transition flex flex-col justify-between space-y-6 shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                  {rm.targetRole}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {rm.estimatedDuration}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-amber-400 transition">
                {rm.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {rm.summary}
              </p>

              {/* Stages Summary */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                  Curriculum Stages ({rm.stages.length} Phases):
                </span>
                <div className="space-y-1.5">
                  {rm.stages.map((st) => (
                    <div key={st.stage} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px]">
                        0{st.stage}
                      </span>
                      <span className="truncate">{st.title}</span>
                      <span className="text-slate-500 text-[10px] ml-auto shrink-0 font-mono">({st.duration})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>View Full Interactive Roadmap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
