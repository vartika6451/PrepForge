import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronRight
} from "lucide-react";
import { getPatterns, getPatternBySlug, getQuestionsForPattern } from "@/lib/data";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { PatternQuestionsList } from "@/components/dsa/PatternQuestionsList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const patterns = getPatterns();
  return patterns.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    return {
      title: "Pattern Not Found | PrepForge",
    };
  }

  return {
    title: `${pattern.name} — DSA Pattern Deep Dive`,
    description: pattern.description,
  };
}

export default async function PatternDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  const questions = getQuestionsForPattern(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#383431]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#272624] transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#99958E]" />
        <Link href="/dsa-patterns" className="hover:text-[#272624] transition">
          DSA Patterns
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#99958E]" />
        <span className="text-[#A34823] font-semibold">{pattern.name}</span>
      </nav>

      {/* Pattern Header Banner */}
      <div className="p-8 rounded-3xl border border-[#99958E] bg-[#CFCCC6] relative overflow-hidden space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium text-[#272624] bg-[#BBB7B0] border border-[#99958E]">
              Pattern #{String(pattern.sortOrder).padStart(2, "0")}
            </span>
            <span className="text-[#99958E]">•</span>
            <span className="text-xs font-mono text-[#383431] uppercase tracking-wider font-semibold">
              {pattern.category}
            </span>
          </div>
          <DifficultyBadge difficulty={pattern.difficultyLevel} />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#272624] tracking-tight">
            {pattern.name}
          </h1>
          <p className="text-base text-[#383431] mt-3 max-w-4xl leading-relaxed">
            {pattern.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#99958E]/60">
          {pattern.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#BBB7B0] text-[#272624] border border-[#99958E]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Structured Conceptual Grid: Recognition, Approaches, Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Recognition Clues */}
        <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#A34823]">
            <Sparkles className="w-4 h-4" />
            <span>How to Recognize This Pattern</span>
          </div>
          <p className="text-xs text-[#383431] leading-relaxed">
            Watch for these specific cues and problem phrasings in interview statements:
          </p>
          <ul className="space-y-2.5 text-xs text-[#383431] leading-relaxed">
            {pattern.recognitionHints.map((hint, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] mt-1.5 shrink-0" />
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Common Approaches */}
        <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#272624]">
            <Lightbulb className="w-4 h-4 text-[#A34823]" />
            <span>Standard Approaches &amp; Templates</span>
          </div>
          <p className="text-xs text-[#383431] leading-relaxed">
            Proven algorithms and invariants to structure your solution:
          </p>
          <ul className="space-y-2.5 text-xs text-[#383431] leading-relaxed">
            {pattern.commonApproaches.map((approach, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A34823] mt-0.5 shrink-0" />
                <span>{approach}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Common Mistakes & Pitfalls */}
        <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#272624]">
            <AlertTriangle className="w-4 h-4 text-[#A34823]" />
            <span>Common Pitfalls &amp; Edge Cases</span>
          </div>
          <p className="text-xs text-[#383431] leading-relaxed">
            Mistakes candidates commonly make during coding interviews:
          </p>
          <ul className="space-y-2.5 text-xs text-[#383431] leading-relaxed">
            {pattern.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] mt-1.5 shrink-0" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Curated Questions Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#99958E]/60 pb-4">
          <div>
            <span className="text-xs font-mono text-[#A34823] uppercase font-semibold tracking-wider">
              Practice Progression
            </span>
            <h2 className="text-2xl font-bold text-[#272624] mt-1">
              Curated LeetCode &amp; Platform Problems ({questions.length})
            </h2>
            <p className="text-xs text-[#383431] mt-1 leading-relaxed">
              Solve in the recommended order. Each problem reinforces a specific nuance of the {pattern.name} pattern.
            </p>
          </div>
        </div>

        <PatternQuestionsList questions={questions} />
      </section>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-[#99958E]/60 flex justify-between items-center text-xs">
        <Link
          href="/dsa-patterns"
          className="inline-flex items-center gap-1.5 text-[#383431] hover:text-[#A34823] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Patterns</span>
        </Link>
      </div>
    </div>
  );
}
