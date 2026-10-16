import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Hash,
  ChevronRight,
  ArrowLeft,
  Clock,
  Target,
  CheckCircle2,
  Terminal,
  Layers,
  Compass,
  ArrowRight
} from "lucide-react";
import {
  getRoadmaps,
  getRoadmapBySlug,
  getTechnologyBySlug,
  getPatternBySlug,
  getProjectBySlug
} from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const roadmaps = getRoadmaps();
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const roadmap = getRoadmapBySlug(slug);

  if (!roadmap) {
    return {
      title: "Roadmap Not Found | PrepForge",
    };
  }

  return {
    title: `${roadmap.title} — Career Learning Track`,
    description: roadmap.summary,
  };
}

export default async function RoadmapDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const roadmap = getRoadmapBySlug(slug);

  if (!roadmap) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-200 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/roadmaps" className="hover:text-slate-200 transition">
          Roadmaps
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-amber-400 font-semibold truncate max-w-xs">{roadmap.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-[#0c1220] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
            {roadmap.targetRole}
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Estimated: {roadmap.estimatedDuration}
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {roadmap.title}
          </h1>
          <p className="text-base text-slate-300 mt-3 leading-relaxed max-w-3xl">
            {roadmap.summary}
          </p>
        </div>
      </div>

      {/* Timeline Stages */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>Stage-by-Stage Curriculum Plan</span>
        </h2>

        <div className="space-y-6">
          {roadmap.stages.map((stage) => (
            <div
              key={stage.stage}
              className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0f172a]/50 space-y-6 relative overflow-hidden"
            >
              {/* Stage header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                    {stage.stage}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400/90 font-medium px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 shrink-0">
                  {stage.duration}
                </span>
              </div>

              {/* Focus items */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                  Core Competency Milestones:
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  {stage.focusItems.map((item, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Linked Platform Assets (Technologies, Patterns, Projects) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                {/* Target Technologies */}
                {stage.targetTechnologies && stage.targetTechnologies.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      Technologies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.targetTechnologies.map((slug) => {
                        const tech = getTechnologyBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            href={`/developer/${slug}`}
                            className="px-2 py-0.5 rounded bg-slate-900 text-blue-300 hover:text-white border border-slate-800 font-mono text-[11px] transition"
                          >
                            {tech?.name || slug}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Target Patterns */}
                {stage.targetPatterns && stage.targetPatterns.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-orange-400" />
                      DSA Patterns:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.targetPatterns.map((slug) => {
                        const pat = getPatternBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            href={`/dsa-patterns/${slug}`}
                            className="px-2 py-0.5 rounded bg-slate-900 text-orange-300 hover:text-white border border-slate-800 font-mono text-[11px] transition"
                          >
                            {pat?.name || slug}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Target Projects */}
                {stage.targetProjects && stage.targetProjects.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Portfolio Projects:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.targetProjects.map((slug) => {
                        const proj = getProjectBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            href={`/projects/${slug}`}
                            className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 hover:text-white border border-slate-800 font-mono text-[11px] transition"
                          >
                            {proj?.title || slug}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Roadmaps */}
      <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-xs">
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Roadmaps</span>
        </Link>
      </div>
    </div>
  );
}
