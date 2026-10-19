"use client";

import React from "react";
import Link from "next/link";
import { Flame, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#99958E] bg-[#BBB7B0] text-[#383431] text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-[#A34823] shadow-sm">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#272624]">
                Prep
                <span className="text-[#A34823]">
                  Forge
                </span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#383431]">
              Centralized developer preparation platform curating high-signal DSA patterns, full-stack technologies, interview explanations, and portfolio projects.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#383431]">
              <ShieldCheck className="w-4 h-4 text-[#A34823]" />
              <span>Direct official links only</span>
            </div>
          </div>

          {/* DSA Patterns */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 font-mono text-[#272624]">
              DSA Patterns
            </h4>
            <ul className="space-y-2.5 text-xs">
              {["two-pointers", "sliding-window", "binary-search", "trees-and-bst", "graphs-and-traversal", "dynamic-programming"].map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/dsa-patterns/${slug}`}
                    className="transition capitalize text-[#383431] hover:text-[#A34823]"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Hub */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 font-mono text-[#272624]">
              Developer Hub
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: "JavaScript Runtime", href: "/developer/javascript" },
                { label: "TypeScript Generics", href: "/developer/typescript" },
                { label: "React Fiber & Hooks", href: "/developer/react" },
                { label: "Next.js App Router", href: "/developer/nextjs" },
                { label: "Node.js Streams", href: "/developer/nodejs" },
                { label: "PostgreSQL & SQL", href: "/developer/postgresql" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition text-[#383431] hover:text-[#A34823]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice & Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 font-mono text-[#272624]">
              Practice &amp; Roadmaps
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/interview-questions"
                  className="transition text-[#383431] hover:text-[#A34823]"
                >
                  Technical Interview Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition text-[#383431] hover:text-[#A34823]"
                >
                  Project Lab Ideas &amp; Specs
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmaps"
                  className="transition text-[#383431] hover:text-[#A34823]"
                >
                  Structured Learning Roadmaps
                </Link>
              </li>
              <li>
                <a
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition text-[#383431] hover:text-[#A34823]"
                >
                  <span>LeetCode Official</span>
                  <ExternalLink className="w-3 h-3 text-[#383431]" />
                </a>
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition text-[#383431] hover:text-[#A34823]"
                >
                  <span>MDN Web Docs</span>
                  <ExternalLink className="w-3 h-3 text-[#383431]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#99958E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#383431]">
          <p>
            &copy; 2026 PrepForge. Engineered for ambitious software engineers.
          </p>
          <div className="flex items-center gap-1">
            <span>Built with Next.js, TypeScript &amp; Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
