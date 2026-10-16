"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Code2, BookOpen, Layers, CheckCircle2, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { DifficultyBadge } from "./DifficultyBadge";
import { PlatformBadge } from "./PlatformBadge";

export function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<"pattern" | "interview" | "project">("pattern");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0b0f19] shadow-2xl shadow-orange-500/5 overflow-hidden">
      {/* Console Top Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0f172a]/70">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-orange-400" />
            prepforge-interactive-workspace
          </span>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("pattern")}
            type="button"
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === "pattern"
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            DSA Pattern
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            type="button"
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === "interview"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Interview Question
          </button>
          <button
            onClick={() => setActiveTab("project")}
            type="button"
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === "project"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Project Spec
          </button>
        </div>
      </div>

      {/* Tab 1: DSA Pattern View */}
      {activeTab === "pattern" && (
        <div className="p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Pattern 03</span>
                <span className="text-slate-600">•</span>
                <DifficultyBadge difficulty="Medium" />
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Sliding Window</h3>
            </div>
            <Link
              href="/dsa-patterns/sliding-window"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              <span>Explore Full Pattern & 5 Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clues */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                How to recognize in interviews
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Problem targets continuous subarrays or contiguous substrings</li>
                <li>Requires finding the maximum/minimum length satisfying condition</li>
                <li>Avoids nested O(N²) scanning by sliding right & left boundaries</li>
              </ul>
            </div>

            {/* Curated Sample Problem */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                Featured LeetCode Problem
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Longest Substring Without Repeating Characters</span>
                <PlatformBadge platform="LeetCode" />
              </div>
              <p className="text-xs text-slate-400">
                Track visited character indices in a Map. Jump left boundary past previous occurrence.
              </p>
              <a
                href="https://leetcode.com/problems/longest-substring-without-repeating-characters/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 pt-1"
              >
                <span>Open problem directly on LeetCode</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Interactive Code Trace Preview */}
          <div className="rounded-xl border border-slate-800 bg-[#070a12] p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <span className="text-slate-500">// Canonical Two-Pointer Sliding Window Template</span>
            <pre className="mt-2 text-slate-300">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">JavaScript • Event Loop</span>
                <span className="text-slate-600">•</span>
                <DifficultyBadge difficulty="Hard" />
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Microtasks vs Macrotasks Execution Order</h3>
            </div>
            <Link
              href="/interview-questions/javascript/event-loop-microtasks-macrotasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              <span>View Deep Dive & Output</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The event loop drains the entire microtask queue (Promise callbacks, queueMicrotask) before picking the next macrotask (setTimeout, I/O). A recursive microtask queue will starve macrotasks indefinitely.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-[#070a12] p-4 font-mono text-xs overflow-x-auto">
              <span className="text-slate-500">// Predict the console output</span>
              <pre className="mt-2 text-slate-300">
{`console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Output Sequence
              </span>
              <div className="font-mono text-xs space-y-1 text-slate-300 bg-[#070a12] p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">1: <span className="text-white">A</span> (Synchronous stack)</div>
                <div className="text-slate-400">2: <span className="text-white">D</span> (Synchronous stack)</div>
                <div className="text-slate-400">3: <span className="text-emerald-400 font-semibold">C</span> (Microtask queue drained first)</div>
                <div className="text-slate-400">4: <span className="text-amber-400">B</span> (Macrotask timer queue)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Project Spec View */}
      {activeTab === "project" && (
        <div className="p-6 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Project Lab</span>
                <span className="text-slate-600">•</span>
                <DifficultyBadge difficulty="Intermediate" />
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Enterprise REST API with Role-Based Access Control</h3>
            </div>
            <Link
              href="/projects/scalable-rest-api-with-jwt-rbac"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>View Milestones & Arch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Phase 1</span>
              <p className="text-xs font-semibold text-white mt-1">JWT Refresh Rotation</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Argon2 + HttpOnly Cookies</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Phase 2</span>
              <p className="text-xs font-semibold text-white mt-1">Zod Middleware Pipeline</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Strict Body & Params validation</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Phase 3</span>
              <p className="text-xs font-semibold text-white mt-1">PostgreSQL Connection Pool</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Prisma ORM & RFC 7807 Errors</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Recommended Tech Stack: <strong className="text-slate-200">Express, Node.js, PostgreSQL, TypeScript, Zod</strong></span>
            <span className="font-mono text-emerald-400">100% Resume Ready</span>
          </div>
        </div>
      )}

      {/* Console Bottom Bar */}
      <div className="px-4 py-2.5 border-t border-slate-800/80 bg-[#090d16] flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live interactive data engine running
        </span>
        <span className="text-slate-400">PrepForge Core v1.0</span>
      </div>
    </div>
  );
}
