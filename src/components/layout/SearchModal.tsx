"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Search, X, ExternalLink, ArrowRight, BookOpen, Code, Terminal, Layers, Compass, Hash } from "lucide-react";
import { searchGlobal } from "@/lib/data";
import { SearchResultItem } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  }

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchGlobal(query);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "pattern":
        return <Layers className="w-4 h-4 text-[#A34823]" />;
      case "question":
        return <Code className="w-4 h-4 text-[#A34823]" />;
      case "technology":
        return <Terminal className="w-4 h-4 text-[#A34823]" />;
      case "interview":
        return <BookOpen className="w-4 h-4 text-[#A34823]" />;
      case "project":
        return <Compass className="w-4 h-4 text-[#A34823]" />;
      case "roadmap":
        return <Hash className="w-4 h-4 text-[#A34823]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#99958E] bg-[#CFCCC6] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#99958E] gap-3 bg-[#BBB7B0]/40">
          <Search className="w-5 h-5 text-[#383431] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search DSA patterns, interview questions, technologies, projects..."
            className="w-full bg-transparent text-sm text-[#272624] placeholder:text-[#5A5652] focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#272624] bg-[#BBB7B0] rounded border border-[#99958E]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[#99958E]/40">
          {!query.trim() ? (
            <div className="py-12 text-center text-[#383431]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#272624]" />
              <p className="text-sm font-semibold text-[#272624]">Search PrepForge Knowledge Base</p>
              <p className="text-xs text-[#383431] mt-1 max-w-sm mx-auto">
                Type a pattern (e.g. &ldquo;sliding window&rdquo;), technology (&ldquo;nodejs&rdquo;), question (&ldquo;event loop&rdquo;), or project idea.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-[#383431]">
              <p className="text-sm text-[#272624] font-semibold">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#383431] mt-1">Try another keyword or browse the navigation directories above.</p>
            </div>
          ) : (
            <div className="py-1 space-y-1">
              {results.map((item) => {
                const isExternal = item.url.startsWith("http");
                const content = (
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#BBB7B0] transition group cursor-pointer">
                    <div className="flex items-start gap-3 min-w-0 pr-2">
                      <div className="p-2 rounded-lg bg-[#BBB7B0] border border-[#99958E] shrink-0 mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#272624] group-hover:text-[#A34823] transition truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#99958E] bg-[#BBB7B0] text-[#272624]"
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#383431] mt-0.5 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-[#383431] group-hover:text-[#272624]">
                      {isExternal ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                      )}
                    </div>
                  </div>
                );

                return isExternal ? (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={onClose}
                    className="block"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
