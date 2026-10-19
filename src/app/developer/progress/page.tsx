import React from "react";
import type { Metadata } from "next";
import { ProgressInsightsView } from "@/components/web-dev/insights/ProgressInsightsView";

export const metadata: Metadata = {
  title: "Learning Insights & Progress | PrepForge Web Dev",
  description:
    "Transparent analytics on your web development interview practice, topic coverage, and spaced revision readiness.",
};

export default function ProgressInsightsPage() {
  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <React.Suspense fallback={<div className="min-h-screen bg-[#AAA7A3]" />}>
        <ProgressInsightsView />
      </React.Suspense>
    </div>
  );
}
