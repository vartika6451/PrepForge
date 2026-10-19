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

async function PracticeQuestionContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = getWebDevQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  const allQuestions = getAllWebDevQuestions();
  return <PracticeQuestionView question={question} allQuestions={allQuestions} />;
}

export default function PracticeQuestionPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <React.Suspense fallback={<div className="min-h-screen bg-[#AAA7A3]" />}>
        <PracticeQuestionContent params={props.params} />
      </React.Suspense>
    </div>
  );
}
