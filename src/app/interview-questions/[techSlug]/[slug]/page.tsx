import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Code2
} from "lucide-react";
import {
  getInterviewQuestions,
  getInterviewQuestionBySlug,
  getTechnologyBySlug
} from "@/lib/data";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface PageProps {
  params: Promise<{ techSlug: string; slug: string }>;
}

export async function generateStaticParams() {
  const questions = getInterviewQuestions();
  return questions.map((q) => ({
    techSlug: q.technologySlug,
    slug: q.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { techSlug, slug } = await props.params;
  const question = getInterviewQuestionBySlug(techSlug, slug);

  if (!question) {
    return {
      title: "Question Not Found | PrepForge",
    };
  }

  return {
    title: `${question.title} — Technical Interview Preparation`,
    description: question.explanation.slice(0, 160),
  };
}

export default async function InterviewQuestionDetailPage(props: PageProps) {
  const { techSlug, slug } = await props.params;
  const question = getInterviewQuestionBySlug(techSlug, slug);

  if (!question) {
    notFound();
  }

  const tech = getTechnologyBySlug(techSlug);
  const allQuestions = getInterviewQuestions();

  // Find related questions
  const relatedQuestions = allQuestions.filter(
    (q) =>
      q.id !== question.id &&
      (question.relatedQuestionSlugs?.includes(q.slug) || q.technologySlug === techSlug)
  ).slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-200 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/interview-questions" className="hover:text-slate-200 transition">
          Interview Questions
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        {tech && (
          <>
            <Link href={`/developer/${tech.slug}`} className="hover:text-slate-200 transition">
              {tech.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </>
        )}
        <span className="text-purple-400 font-semibold truncate max-w-xs">{question.topic}</span>
      </nav>

      {/* Question Header Card */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-[#0c1220] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20">
              {tech?.name || question.technologySlug}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">{question.topic}</span>
          </div>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
          {question.title}
        </h1>
      </div>

      {/* Conceptual Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Conceptual Explanation &amp; Rationale</span>
        </div>
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/50 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
          {question.explanation}
        </div>
      </section>

      {/* Code Walkthrough (if present) */}
      {question.codeExample && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Code Example &amp; Implementation Walkthrough</span>
          </div>
          <CodeBlock
            code={question.codeExample}
            language="typescript"
            title={`${question.topic} Code Demonstration`}
          />
        </section>
      )}

      {/* Output Prediction / Execution Trace (if present) */}
      {question.outputPrediction && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Execution Flow &amp; Output Prediction</span>
          </div>
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#070a12] font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {question.outputPrediction}
          </div>
        </section>
      )}

      {/* Key Takeaways Checklist */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Key Interview Takeaways</span>
        </div>
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a]/40 space-y-3">
          {question.keyTakeaways.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-base font-bold text-white">Related Technical Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedQuestions.map((rel) => (
              <Link
                key={rel.id}
                href={`/interview-questions/${rel.technologySlug}/${rel.slug}`}
                className="group p-5 rounded-2xl border border-slate-800 bg-[#0f172a]/40 hover:bg-[#131d33] transition flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-purple-400 uppercase">{rel.topic}</span>
                  <DifficultyBadge difficulty={rel.difficulty} />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                  {rel.title}
                </h4>
                <div className="text-xs text-purple-400 pt-2 flex items-center gap-1 font-medium">
                  <span>View Explanation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Directory */}
      <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-xs">
        <Link
          href="/interview-questions"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Interview Questions</span>
        </Link>
      </div>
    </div>
  );
}
