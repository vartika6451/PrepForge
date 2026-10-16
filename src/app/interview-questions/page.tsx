import React from "react";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getInterviewQuestions, getTechnologies } from "@/lib/data";
import { InterviewDirectory } from "@/components/interview/InterviewDirectory";

export const metadata: Metadata = {
  title: "Technical Interview Questions & Detailed Explanations",
  description:
    "Explore high-frequency software engineering interview questions with rigorous explanations, execution diagrams, output predictions, and practical code examples.",
};

export default function InterviewQuestionsPage() {
  const questions = getInterviewQuestions();
  const technologies = getTechnologies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Technical Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Technical Interview Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Master deep technical concepts frequently evaluated by tech companies. Each question features original explanations, output predictions, code examples, and architectural reasoning.
        </p>
      </div>

      {/* Directory with live filtering */}
      <InterviewDirectory questions={questions} technologies={technologies} />
    </div>
  );
}
