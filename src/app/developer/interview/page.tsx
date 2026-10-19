import React from "react";
import type { Metadata } from "next";
import { InterviewRoundView } from "@/components/web-dev/interview/InterviewRoundView";

export const metadata: Metadata = {
  title: "Quick Technical Interview Round | PrepForge Web Dev",
  description:
    "Five questions. Different skills. One focused practice session simulating a junior full-stack interview.",
};

export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <React.Suspense fallback={<div className="min-h-screen bg-[#AAA7A3]" />}>
        <InterviewRoundView />
      </React.Suspense>
    </div>
  );
}
