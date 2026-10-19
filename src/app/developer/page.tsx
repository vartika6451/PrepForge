import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAllWebDevQuestions, getWebDevTopicsWithCounts } from "@/lib/data/web-dev";
import { WebDevHubClient } from "@/components/web-dev/WebDevHubClient";

export const metadata: Metadata = {
  title: "Web Development Interview Preparation Hub | PrepForge",
  description:
    "Practice real frontend, backend, and full-stack technical interview questions. Explain core concepts, debug tricky bugs, and build practical components.",
};

function WebDevHubSkeleton() {
  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 animate-pulse">
        <div className="h-16 bg-[#BBB7B0] rounded-xl" />
        <div className="h-24 bg-[#CFCCC6] rounded-2xl border border-[#99958E]" />
        <div className="h-44 bg-[#CFCCC6] rounded-2xl border border-[#99958E]" />
        <div className="h-12 bg-[#CFCCC6] rounded-xl border border-[#99958E]" />
        <div className="h-64 bg-[#CFCCC6] rounded-xl border border-[#99958E]" />
      </div>
    </div>
  );
}

export default function DeveloperPage() {
  const questions = getAllWebDevQuestions();
  const topicsWithCounts = getWebDevTopicsWithCounts();

  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <Suspense fallback={<WebDevHubSkeleton />}>
        <WebDevHubClient
          initialQuestions={questions}
          topicsWithCounts={topicsWithCounts}
        />
      </Suspense>
    </div>
  );
}
