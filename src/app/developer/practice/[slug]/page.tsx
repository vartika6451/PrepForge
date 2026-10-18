import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllWebDevQuestions,
  getWebDevQuestionBySlug,
} from "@/lib/data/web-dev";
import { PracticeQuestionView } from "@/components/web-dev/PracticeQuestionView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const questions = getAllWebDevQuestions();
  return questions.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const question = getWebDevQuestionBySlug(slug);

  if (!question) {
    return {
      title: "Challenge Not Found | PrepForge Web Dev",
    };
  }

  return {
    title: `${question.title} | PrepForge Web Dev Hub`,
    description: question.summary,
  };
}

export default async function PracticeQuestionPage(props: PageProps) {
  const { slug } = await props.params;
  const question = getWebDevQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  const allQuestions = getAllWebDevQuestions();
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#090d16]" />}>
      <PracticeQuestionView question={question} allQuestions={allQuestions} />
    </React.Suspense>
  );
}
