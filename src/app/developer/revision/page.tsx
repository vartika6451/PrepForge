import React from "react";
import type { Metadata } from "next";
import { RevisionQueueView } from "@/components/web-dev/RevisionQueueView";

export const metadata: Metadata = {
  title: "Revision Queue & Mistake Journal | PrepForge Web Dev",
  description:
    "Review scheduled interview questions based on spaced repetition intervals and study recorded mistake takeaways.",
};

export default function RevisionPage() {
  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <React.Suspense fallback={<div className="min-h-screen bg-[#AAA7A3]" />}>
        <RevisionQueueView />
      </React.Suspense>
    </div>
  );
}
