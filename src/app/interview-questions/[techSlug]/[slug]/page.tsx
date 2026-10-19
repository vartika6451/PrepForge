import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Lightbulb,
  Code2,
  Terminal,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft
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
    title: `${question.title} — Technical Interview Guide`,
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
      <nav className="flex items-center gap-2 text-xs font-mono text-[#383431]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#272624] transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#99958E]" />
        <Link href="/interview-questions" className="hover:text-[#272624] transition">
          Interview Questions
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#99958E]" />
        {tech && (
          <>
            <Link href={`/developer/${tech.slug}`} className="hover:text-[#272624] transition">
              {tech.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#99958E]" />
          </>
        )}
        <span className="text-[#A34823] font-semibold truncate max-w-xs">{question.topic}</span>
      </nav>

      {/* Question Header Card */}
      <div className="p-8 rounded-3xl border border-[#99958E] bg-[#CFCCC6] space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-[#272624] bg-[#BBB7B0] border border-[#99958E]">
              {tech?.name || question.technologySlug}
            </span>
            <span className="text-[#99958E]">•</span>
            <span className="text-xs font-mono text-[#383431] font-semibold">{question.topic}</span>
          </div>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#272624] tracking-tight leading-snug">
          {question.title}
        </h1>
      </div>

      {/* Conceptual Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#272624]">
          <Lightbulb className="w-4 h-4 text-[#A34823]" />
          <span>Conceptual Explanation &amp; Rationale</span>
        </div>
        <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] text-[#383431] text-sm leading-relaxed whitespace-pre-line shadow-xs">
          {question.explanation}
        </div>
      </section>

      {/* Code Walkthrough (if present) */}
      {question.codeExample && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#272624]">
            <Code2 className="w-4 h-4 text-[#A34823]" />
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
          <div className="flex items-center gap-2 text-sm font-bold text-[#272624]">
            <Terminal className="w-4 h-4 text-[#A34823]" />
            <span>Execution Flow &amp; Output Prediction</span>
          </div>
          <div className="p-5 rounded-2xl border border-[#99958E] bg-[#2D2C2A] font-mono text-xs text-[#EDEAE4] leading-relaxed overflow-x-auto whitespace-pre-wrap shadow-xs">
            {question.outputPrediction}
          </div>
        </section>
      )}

      {/* Key Takeaways Checklist */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#272624]">
          <CheckCircle2 className="w-4 h-4 text-[#A34823]" />
          <span>Key Interview Takeaways</span>
        </div>
        <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-3 shadow-xs">
          {question.keyTakeaways.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#383431]">
              <span className="w-5 h-5 rounded-full bg-[#BBB7B0] border border-[#99958E] text-[#272624] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#99958E]/60">
          <h3 className="text-base font-bold text-[#272624]">Related Technical Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedQuestions.map((rel) => (
              <Link
                key={rel.id}
                href={`/interview-questions/${rel.technologySlug}/${rel.slug}`}
                className="group p-5 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition flex flex-col justify-between space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#A34823] font-semibold uppercase">{rel.topic}</span>
                  <DifficultyBadge difficulty={rel.difficulty} />
                </div>
                <h4 className="text-sm font-bold text-[#272624] group-hover:text-[#A34823] transition">
                  {rel.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-[#A34823] font-semibold pt-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-[#99958E]/60 flex justify-between items-center text-xs">
        <Link
          href="/interview-questions"
          className="inline-flex items-center gap-1.5 text-[#383431] hover:text-[#A34823] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Questions</span>
        </Link>
      </div>
    </div>
  );
}
