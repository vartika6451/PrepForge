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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 animate-pulse">
      <div className="h-20 bg-slate-800/40 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="h-32 bg-slate-800/40 rounded-xl" />
        <div className="h-32 bg-slate-800/40 rounded-xl" />
        <div className="h-32 bg-slate-800/40 rounded-xl" />
      </div>
      <div className="h-36 bg-slate-800/40 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 bg-slate-800/40 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-800/40 rounded-xl" />
    </div>
  );
}

export default function DeveloperPage() {
  const questions = getAllWebDevQuestions();
  const topicsWithCounts = getWebDevTopicsWithCounts();

  return (
    <Suspense fallback={<WebDevHubSkeleton />}>
      <WebDevHubClient
        initialQuestions={questions}
        topicsWithCounts={topicsWithCounts}
      />
    </Suspense>
  );
}
