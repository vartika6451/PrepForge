"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Code2, ArrowRight, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { DifficultyBadge } from "./DifficultyBadge";
import { PlatformBadge } from "./PlatformBadge";

export function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<"pattern" | "interview" | "project">("pattern");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[#99958E] bg-[#CFCCC6] shadow-xl overflow-hidden">
      {/* Console Top Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#99958E] bg-[#BBB7B0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#99958E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#99958E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#99958E] inline-block" />
          </div>
          <span className="text-xs font-mono text-[#272624] ml-2 flex items-center gap-1.5 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-[#A34823]" />
            prepforge-interactive-workspace
          </span>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#AAA7A3] border border-[#99958E] text-xs">
          <button
            onClick={() => setActiveTab("pattern")}
            type="button"
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeTab === "pattern"
                ? "bg-[#A34823] text-white shadow-xs"
                : "text-[#272624] hover:text-[#272624] hover:bg-[#BBB7B0]"
            }`}
          >
            DSA Pattern
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            type="button"
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeTab === "interview"
                ? "bg-[#A34823] text-white shadow-xs"
                : "text-[#272624] hover:text-[#272624] hover:bg-[#BBB7B0]"
            }`}
          >
            Interview Question
          </button>
          <button
            onClick={() => setActiveTab("project")}
            type="button"
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeTab === "project"
                ? "bg-[#A34823] text-white shadow-xs"
                : "text-[#272624] hover:text-[#272624] hover:bg-[#BBB7B0]"
            }`}
          >
            Project Spec
          </button>
        </div>
      </div>

      {/* Tab 1: DSA Pattern View */}
      {activeTab === "pattern" && (
        <div className="p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#99958E]/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#A34823] font-semibold uppercase tracking-wider">Pattern 03</span>
                <span className="text-[#99958E]">•</span>
                <DifficultyBadge difficulty="Medium" />
              </div>
              <h3 className="text-xl font-bold text-[#272624] mt-1">Sliding Window</h3>
            </div>
            <Link
              href="/dsa-patterns/sliding-window"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A34823] hover:underline"
            >
              <span>Explore Full Pattern &amp; 5 Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clues */}
            <div className="p-4 rounded-xl bg-[#BBB7B0] border border-[#99958E] space-y-2.5">
              <span className="text-xs font-mono uppercase text-[#272624] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A34823]" />
                How to recognize in interviews
              </span>
              <ul className="text-xs text-[#383431] space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Problem targets continuous subarrays or contiguous substrings</li>
                <li>Requires finding the maximum/minimum length satisfying condition</li>
                <li>Avoids nested O(N²) scanning by sliding right &amp; left boundaries</li>
              </ul>
            </div>

            {/* Curated Sample Problem */}
            <div className="p-4 rounded-xl bg-[#BBB7B0] border border-[#99958E] space-y-2.5">
              <span className="text-xs font-mono uppercase text-[#272624] font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#A34823]" />
                Featured LeetCode Problem
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#272624]">Longest Substring Without Repeating Characters</span>
                <PlatformBadge platform="LeetCode" />
              </div>
              <p className="text-xs text-[#383431] leading-relaxed">
                Track visited character indices in a Map. Jump left boundary past previous occurrence.
              </p>
              <a
                href="https://leetcode.com/problems/longest-substring-without-repeating-characters/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#A34823] hover:underline pt-1"
              >
                <span>Open problem directly on LeetCode</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Interactive Code Trace Preview */}
          <div className="rounded-xl border border-[#99958E] bg-[#2D2C2A] p-4 font-mono text-xs text-[#EDEAE4] overflow-x-auto">
            <span className="text-[#99958E]">{"// Canonical Two-Pointer Sliding Window Template"}</span>
            <pre className="mt-2 text-[#EDEAE4] leading-relaxed">
{`function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0, maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      left = lastSeen.get(char)! + 1; // Shrink window left boundary
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1); // Expand window
  }
  return maxLength; // O(N) Time • O(min(N, M)) Space
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Interview Question View */}
      {activeTab === "interview" && (
        <div className="p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#99958E]/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#A34823] font-semibold uppercase tracking-wider">JavaScript • Event Loop</span>
                <span className="text-[#99958E]">•</span>
                <DifficultyBadge difficulty="Hard" />
              </div>
              <h3 className="text-xl font-bold text-[#272624] mt-1">Microtasks vs Macrotasks Execution Order</h3>
            </div>
            <Link
              href="/interview-questions/javascript/event-loop-microtasks-macrotasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A34823] hover:underline"
            >
              <span>View Deep Dive &amp; Output</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-[#383431] leading-relaxed">
            The event loop drains the entire microtask queue (Promise callbacks, queueMicrotask) before picking the next macrotask (setTimeout, I/O). A recursive microtask queue will starve macrotasks indefinitely.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#99958E] bg-[#2D2C2A] p-4 font-mono text-xs overflow-x-auto text-[#EDEAE4]">
              <span className="text-[#99958E]">{"// Predict the console output"}</span>
              <pre className="mt-2 text-[#EDEAE4] leading-relaxed">
{`console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-[#BBB7B0] border border-[#99958E] space-y-2">
              <span className="text-xs font-mono uppercase text-[#A34823] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Output Sequence
              </span>
              <div className="font-mono text-xs space-y-1.5 text-[#EDEAE4] bg-[#2D2C2A] p-3 rounded-lg border border-[#99958E]">
                <div>1: <span className="font-bold text-white">A</span> (Synchronous stack)</div>
                <div>2: <span className="font-bold text-white">D</span> (Synchronous stack)</div>
                <div>3: <span className="text-[#C9A28E] font-semibold">C</span> (Microtask queue drained first)</div>
                <div>4: <span className="text-[#C9A28E]">B</span> (Macrotask timer queue)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Project Spec View */}
      {activeTab === "project" && (
        <div className="p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#99958E]/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#A34823] font-semibold uppercase tracking-wider">Project Lab</span>
                <span className="text-[#99958E]">•</span>
                <DifficultyBadge difficulty="Intermediate" />
              </div>
              <h3 className="text-xl font-bold text-[#272624] mt-1">Enterprise REST API with Role-Based Access Control</h3>
            </div>
            <Link
              href="/projects/scalable-rest-api-with-jwt-rbac"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#A34823] hover:underline"
            >
              <span>View Milestones &amp; Arch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#BBB7B0] border border-[#99958E]">
              <span className="text-[11px] font-mono text-[#A34823] font-semibold uppercase">Phase 1</span>
              <p className="text-xs font-semibold text-[#272624] mt-1">JWT Refresh Rotation</p>
              <p className="text-[11px] text-[#383431] mt-0.5 leading-relaxed">Argon2 + HttpOnly Cookies</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#BBB7B0] border border-[#99958E]">
              <span className="text-[11px] font-mono text-[#A34823] font-semibold uppercase">Phase 2</span>
              <p className="text-xs font-semibold text-[#272624] mt-1">Zod Middleware Pipeline</p>
              <p className="text-[11px] text-[#383431] mt-0.5 leading-relaxed">Strict Body &amp; Params validation</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#BBB7B0] border border-[#99958E]">
              <span className="text-[11px] font-mono text-[#A34823] font-semibold uppercase">Phase 3</span>
              <p className="text-xs font-semibold text-[#272624] mt-1">PostgreSQL Connection Pool</p>
              <p className="text-[11px] text-[#383431] mt-0.5 leading-relaxed">Prisma ORM &amp; RFC 7807 Errors</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#383431] pt-2 border-t border-[#99958E]/60">
            <span>Recommended Tech Stack: <strong className="text-[#272624]">Express, Node.js, PostgreSQL, TypeScript, Zod</strong></span>
            <span className="font-mono text-[#A34823] font-medium">100% Resume Ready</span>
          </div>
        </div>
      )}

      {/* Console Bottom Bar */}
      <div className="px-4 py-2.5 border-t border-[#99958E] bg-[#BBB7B0] flex items-center justify-between text-[11px] text-[#383431] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#A34823]" />
          Live interactive data engine running
        </span>
        <span className="text-[#272624] font-medium">PrepForge Core v1.0</span>
      </div>
    </div>
  );
}
