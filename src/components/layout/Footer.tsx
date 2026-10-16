import React from "react";
import Link from "next/link";
import { Flame, ExternalLink, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060910] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Prep<span className="text-orange-400">Forge</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centralized developer preparation platform curating high-signal DSA patterns, full-stack technologies, interview explanations, and portfolio projects.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct official links only</span>
            </div>
          </div>

          {/* DSA Patterns */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              DSA Patterns
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dsa-patterns/two-pointers" className="hover:text-orange-400 transition">
                  Two Pointers
                </Link>
              </li>
              <li>
                <Link href="/dsa-patterns/sliding-window" className="hover:text-orange-400 transition">
                  Sliding Window
                </Link>
              </li>
              <li>
                <Link href="/dsa-patterns/binary-search" className="hover:text-orange-400 transition">
                  Binary Search
                </Link>
              </li>
              <li>
                <Link href="/dsa-patterns/trees-and-bst" className="hover:text-orange-400 transition">
                  Trees & Binary Search Trees
                </Link>
              </li>
              <li>
                <Link href="/dsa-patterns/graphs-and-traversal" className="hover:text-orange-400 transition">
                  Graphs & Graph Traversal
                </Link>
              </li>
              <li>
                <Link href="/dsa-patterns/dynamic-programming" className="hover:text-orange-400 transition">
                  Dynamic Programming
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Hub */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Developer Hub
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/developer/javascript" className="hover:text-orange-400 transition">
                  JavaScript Runtime & Event Loop
                </Link>
              </li>
              <li>
                <Link href="/developer/typescript" className="hover:text-orange-400 transition">
                  TypeScript Generics & Types
                </Link>
              </li>
              <li>
                <Link href="/developer/react" className="hover:text-orange-400 transition">
                  React Fiber & Hooks
                </Link>
              </li>
              <li>
                <Link href="/developer/nextjs" className="hover:text-orange-400 transition">
                  Next.js App Router & RSC
                </Link>
              </li>
              <li>
                <Link href="/developer/nodejs" className="hover:text-orange-400 transition">
                  Node.js Streams & Libuv
                </Link>
              </li>
              <li>
                <Link href="/developer/postgresql" className="hover:text-orange-400 transition">
                  PostgreSQL & Relational SQL
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice & Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
              Practice & Roadmaps
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/interview-questions" className="hover:text-orange-400 transition">
                  Technical Interview Directory
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-orange-400 transition">
                  Project Lab Ideas & Specs
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="hover:text-orange-400 transition">
                  Structured Learning Roadmaps
                </Link>
              </li>
              <li>
                <a
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-orange-400 transition"
                >
                  <span>LeetCode Official</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-orange-400 transition"
                >
                  <span>MDN Web Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 PrepForge. Engineered for ambitious software engineers.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with Next.js, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
