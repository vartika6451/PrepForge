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
      <nav className="flex items-center gap-2 text-xs font-mono text-[#383431]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#272624] transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
        <Link href="/roadmaps" className="hover:text-[#272624] transition">
          Roadmaps
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
        <span className="text-[#A34823] font-semibold truncate max-w-xs">{roadmap.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl border border-[#99958E] bg-[#CFCCC6] space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium text-[#A34823] bg-[#C9A28E]/40 border border-[#A34823]/30">
            {roadmap.targetRole}
          </span>
          <span className="text-xs font-mono text-[#383431] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#5A5652]" />
            Estimated: {roadmap.estimatedDuration}
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#272624] tracking-tight">
            {roadmap.title}
          </h1>
          <p className="text-base text-[#383431] mt-3 leading-relaxed max-w-3xl">
            {roadmap.summary}
          </p>
        </div>
      </div>

      {/* Timeline Stages */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-[#272624] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#A34823]" />
          <span>Stage-by-Stage Curriculum Plan</span>
        </h2>

        <div className="space-y-6">
          {roadmap.stages.map((stage) => (
            <div
              key={stage.stage}
              className="p-6 sm:p-8 rounded-3xl border border-[#99958E] bg-[#CFCCC6] space-y-6 shadow-sm relative overflow-hidden"
            >
              {/* Stage header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#99958E] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#BBB7B0] border border-[#99958E] text-[#A34823] flex items-center justify-center font-mono font-bold text-sm">
                    {stage.stage}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#272624]">{stage.title}</h3>
                    <p className="text-xs text-[#383431] mt-0.5">{stage.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#A34823] font-medium px-2.5 py-1 rounded-md bg-[#BBB7B0] border border-[#99958E] shrink-0">
                  {stage.duration}
                </span>
              </div>

              {/* Focus items */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-[#383431] uppercase tracking-wider font-semibold">
                  Core Competency Milestones:
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#383431]">
                  {stage.focusItems.map((item, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 p-2 rounded-lg bg-[#BBB7B0]/60 border border-[#99958E]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A34823] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Linked Platform Assets (Technologies, Patterns, Projects) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#99958E] text-xs">
                {/* Target Technologies */}
                {stage.targetTechnologies && stage.targetTechnologies.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-[#383431] font-semibold flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-[#A34823]" />
                      Technologies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.targetTechnologies.map((slug) => {
                        const tech = getTechnologyBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            href={`/developer/${slug}`}
                            className="px-2 py-0.5 rounded bg-[#BBB7B0] text-[#272624] hover:text-[#A34823] border border-[#99958E] font-mono text-[11px] transition"
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
                    <span className="font-mono text-[#383431] font-semibold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#A34823]" />
                      DSA Patterns:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.targetPatterns.map((slug) => {
                        const pat = getPatternBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            href={`/dsa-patterns/${slug}`}
                            className="px-2 py-0.5 rounded bg-[#BBB7B0] text-[#272624] hover:text-[#A34823] border border-[#99958E] font-mono text-[11px] transition"
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
                    <span className="font-mono text-[#383431] font-semibold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#A34823]" />
                      Portfolio Projects:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.targetProjects.map((slug) => {
                        const proj = getProjectBySlug(slug);
                        return (
                          <Link
                            key={slug}
                            href={`/projects/${slug}`}
                            className="px-2 py-0.5 rounded bg-[#BBB7B0] text-[#272624] hover:text-[#A34823] border border-[#99958E] font-mono text-[11px] transition"
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
      <div className="pt-8 border-t border-[#99958E] flex justify-between items-center text-xs">
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1.5 text-[#383431] hover:text-[#272624] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Roadmaps</span>
        </Link>
      </div>
    </div>
  );
}
