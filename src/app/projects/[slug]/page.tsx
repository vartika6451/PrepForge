import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Compass,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
  Target,
  Rocket,
  BookmarkCheck,
  BookOpen
} from "lucide-react";
import { getProjects, getProjectBySlug, getTechnologyBySlug } from "@/lib/data";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | PrepForge",
    };
  }

  return {
    title: `${project.title} — Project Lab Blueprint`,
    description: project.description,
  };
}

export default async function ProjectDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) {
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
        <Link href="/projects" className="hover:text-[#272624] transition">
          Project Lab
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
        <span className="text-[#A34823] font-semibold truncate max-w-xs">{project.title}</span>
      </nav>

      {/* Project Banner Header */}
      <div className="p-8 rounded-3xl border border-[#99958E] bg-[#CFCCC6] space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-[#A34823] bg-[#C9A28E]/40 border border-[#A34823]/30">
              {project.category}
            </span>
            <span className="text-[#5A5652]">•</span>
            <span className="text-xs font-mono text-[#383431]">
              {project.milestones.length} Phased Milestones
            </span>
          </div>
          <DifficultyBadge difficulty={project.difficulty} />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#272624] tracking-tight">
            {project.title}
          </h1>
          <p className="text-base text-[#383431] mt-3 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Recommended Tech Stack Pills */}
        <div className="space-y-2 pt-2 border-t border-[#99958E]">
          <span className="text-[11px] font-mono text-[#383431] uppercase tracking-wider font-semibold">
            Recommended Tech Stack:
          </span>
          <div className="flex flex-wrap gap-2">
            {project.technologySlugs.map((t) => {
              const tech = getTechnologyBySlug(t);
              return (
                <Link
                  key={t}
                  href={`/developer/${t}`}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-[#BBB7B0] hover:bg-[#A59B9F] text-[#272624] border border-[#99958E] transition flex items-center gap-1.5"
                >
                  <span>{tech?.name || t}</span>
                  <ExternalLink className="w-3 h-3 text-[#A34823]" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problem Solved Card */}
      <section className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[#A34823]">
          <Target className="w-4 h-4" />
          <span>The Real-World Problem Solved</span>
        </div>
        <p className="text-sm text-[#383431] leading-relaxed">
          {project.problemSolved}
        </p>
      </section>

      {/* Core Features */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[#272624]">
          <BookmarkCheck className="w-5 h-5 text-[#A34823]" />
          <span>Core Features Checklist</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] flex items-start gap-3 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#A34823] mt-0.5 shrink-0" />
              <p className="text-xs text-[#383431] leading-relaxed">{feat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation Milestones */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-base font-bold text-[#272624]">
          <Layers className="w-5 h-5 text-[#A34823]" />
          <span>Suggested Implementation Milestones</span>
        </div>
        <div className="space-y-4">
          {project.milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-[#BBB7B0] text-[#A34823] border border-[#99958E]">
                  {milestone.phase}
                </span>
                <span className="text-xs font-mono text-[#383431]">Step {idx + 1} of {project.milestones.length}</span>
              </div>
              <h3 className="text-base font-bold text-[#272624]">{milestone.title}</h3>
              <ul className="space-y-2 text-xs text-[#383431]">
                {milestone.tasks.map((task, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] mt-1.5 shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Learned & Stretch Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Learned */}
        <section className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#A34823]">
            <Sparkles className="w-4 h-4" />
            <span>Key Skills Demonstrated</span>
          </div>
          <ul className="space-y-2 text-xs text-[#383431]">
            {project.skillsLearned.map((skill, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A34823] mt-0.5 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Stretch Goals */}
        <section className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold text-[#A34823]">
            <Rocket className="w-4 h-4" />
            <span>Optional Stretch Goals</span>
          </div>
          <ul className="space-y-2 text-xs text-[#383431]">
            {project.stretchGoals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] mt-1.5 shrink-0" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Reference Links & Documentation */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-base font-bold text-[#272624]">
          <BookOpen className="w-5 h-5 text-[#A34823]" />
          <span>Relevant Official Documentation &amp; Reference Material</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {project.referenceLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition flex items-center justify-between text-xs text-[#272624] group shadow-sm"
            >
              <span className="font-medium group-hover:text-[#A34823] transition">{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#383431] group-hover:text-[#A34823] transition shrink-0 ml-2" />
            </a>
          ))}
        </div>
      </section>

      {/* Back to Project Lab */}
      <div className="pt-8 border-t border-[#99958E] flex justify-between items-center text-xs">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-[#383431] hover:text-[#272624] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    </div>
  );
}
