"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight } from "lucide-react";
import { useUserPracticeStore, getRevisionQueue } from "@/lib/web-dev-progress";

export function DueRevisionBanner() {
  const store = useUserPracticeStore();
  const queue = getRevisionQueue(store);
  const dueCount = queue.dueNow.length;

  if (dueCount === 0) return null;

  return (
    <div className="p-4 rounded-xl border border-[#99958E] bg-[#CFCCC6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-150">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#BBB7B0] text-[#A34823] flex items-center justify-center shrink-0">
          <RotateCcw className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#A34823] font-semibold">
              Spaced Revision Due
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#A34823] text-white font-semibold">
              {dueCount}
            </span>
          </div>
          <p className="text-xs text-[#383431] leading-relaxed">
            Revisiting questions on spaced intervals solidifies independent recall before real interview rounds.
          </p>
        </div>
      </div>

      <Link
        href="/developer/revision"
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#A34823] hover:bg-[#8F3D1C] text-white transition shrink-0 self-start sm:self-center cursor-pointer"
      >
        <span>Review Queue</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
