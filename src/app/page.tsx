import React from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Code2,
  Terminal,
  BookOpen,
  Compass,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Shield,
  ArrowUpRight
} from "lucide-react";
import { getPatterns, getTechnologies, getInterviewQuestions, getProjects, getQuestionCountForPattern } from "@/lib/data";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { InteractiveConsole } from "@/components/ui/InteractiveConsole";

export default function HomePage() {
  const allPatterns = getPatterns();
  const previewPatterns = allPatterns.slice(0, 8); // Top 8 featured patterns
  const technologies = getTechnologies();
  const sampleInterviewQuestions = getInterviewQuestions().slice(0, 4);
  const sampleProjects = getProjects().slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 shadow-sm">
            <Flame className="w-3.5 h-3.5" />
            <span>Developer Learning &amp; Interview Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Your Roadmap to Becoming{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Interview-Ready.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover the right DSA problems, learn modern developer technologies, prepare for interviews, and build projects that demonstrate your skills.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dsa-patterns"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 transition transform active:scale-95 flex items-center gap-2"
            >
              <span>Explore DSA Patterns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/developer"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition transform active:scale-95 flex items-center gap-2"
            >
              <span>Explore Developer Hub</span>
              <Terminal className="w-4 h-4 text-orange-400" />
            </Link>
          </div>

          {/* Value proposition badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              18 Core DSA Patterns
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Genuine Official Links
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Production Project Blueprints
            </span>
          </div>
        </div>

        {/* Real Application Component Interactive Preview */}
        <div className="mt-14">
          <InteractiveConsole />
        </div>
      </section>

      {/* 2. STATS & ARCHITECTURE BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800 bg-[#0c1220]">
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-white font-mono">18</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">DSA Patterns</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-orange-400 font-mono">9</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Tech Deep Dives</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">16+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Portfolio Projects</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-sky-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Free &amp; Verified Links</div>
          </div>
        </div>
      </section>

      {/* 3. DSA PATTERNS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-orange-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              Pattern-Based Problem Solving
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Master the Patterns, Solve Any Problem
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Stop memorizing solutions. Learn the underlying structural clues that immediately unlock LeetCode and coding interview questions.
            </p>
          </div>
          <Link
            href="/dsa-patterns"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 py-1"
          >
            <span>View All 18 Patterns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewPatterns.map((pat) => {
            const count = getQuestionCountForPattern(pat.slug);
            return (
              <Link
                key={pat.id}
                href={`/dsa-patterns/${pat.slug}`}
                className="group p-5 rounded-2xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-orange-500/30 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      #{String(pat.sortOrder).padStart(2, "0")}
                    </span>
                    <DifficultyBadge difficulty={pat.difficultyLevel} />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition">
                    {pat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {pat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{count} Curated Problems</span>
                  <span className="text-orange-400 font-medium group-hover:translate-x-1 transition flex items-center gap-1">
                    Study <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. DEVELOPER HUB PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              Full-Stack Architecture &amp; Runtimes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Developer Hub: Modern Engineering
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              From JavaScript event loops and React fiber internals to PostgreSQL indexing and distributed system design.
            </p>
          </div>
          <Link
            href="/developer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 py-1"
          >
            <span>Explore All Technologies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech) => (
            <Link
              key={tech.id}
              href={`/developer/${tech.slug}`}
              className="group p-5 rounded-2xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${tech.colorClass}`}>
                  {tech.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                {tech.name}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {tech.tagline}
              </p>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {tech.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. INTERVIEW PREPARATION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              High-Frequency Technical Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Interview Questions with Conceptual Rationale
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Original technical explanations, code walkthroughs, execution sequence diagrams, and common pitfalls.
            </p>
          </div>
          <Link
            href="/interview-questions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 py-1"
          >
            <span>View All Interview Questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleInterviewQuestions.map((q) => (
            <Link
              key={q.id}
              href={`/interview-questions/${q.technologySlug}/${q.slug}`}
              className="group p-5 rounded-2xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-purple-500/30 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-purple-400 uppercase">{q.topic}</span>
                  <span className="text-slate-600">•</span>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{q.keyTakeaways.length} Key Takeaways</span>
                <span className="text-purple-400 group-hover:translate-x-1 transition flex items-center gap-1 font-sans font-medium">
                  Read breakdown <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. PROJECT LAB PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Build to Demonstrate Competence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Project Lab: Production-Grade Ideas
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Curated projects solving real engineering challenges. Each blueprint includes phase-by-phase implementation milestones, tech stack choices, and reference documentation.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1"
          >
            <span>Browse All 16 Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleProjects.map((proj) => (
            <Link
              key={proj.id}
              href={`/projects/${proj.slug}`}
              className="group p-5 rounded-2xl border border-slate-800 bg-[#0f172a]/50 hover:bg-[#131d33] hover:border-emerald-500/30 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-medium">
                    {proj.category}
                  </span>
                  <DifficultyBadge difficulty={proj.difficulty} />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {proj.technologySlugs.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{proj.milestones.length} Phased Milestones</span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition flex items-center gap-1 font-medium">
                    View Blueprint <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. ROADMAPS PREVIEW BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-10 rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0c1220] to-[#131b2e] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Structured Career Tracks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Connect Patterns, Hubs, Questions &amp; Projects
            </h2>
            <p className="text-sm text-slate-300">
              Follow comprehensive step-by-step roadmaps for Full-Stack Engineering, Frontend Specialization, Backend Systems, and Algorithmic Interviews.
            </p>
          </div>
          <Link
            href="/roadmaps"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition shrink-0 flex items-center gap-2"
          >
            <span>Explore Roadmaps</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="max-w-3xl mx-auto space-y-6 p-10 rounded-3xl border border-slate-800 bg-[#090d16] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
            <Flame className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Level Up Your Engineering Preparation Today
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            No fluff, no paywalls for basic knowledge, and no fake hype. Just curated, verified resources designed to make you technically exceptional.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dsa-patterns"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition"
            >
              Start with DSA Patterns
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
