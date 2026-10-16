"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via global event or custom dispatch
          window.dispatchEvent(new CustomEvent("toggle-search-modal"));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = searchGlobal(query);
    setResults(res);
  }, [query]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "pattern":
        return <Layers className="w-4 h-4 text-orange-400" />;
      case "question":
        return <Code className="w-4 h-4 text-emerald-400" />;
      case "technology":
        return <Terminal className="w-4 h-4 text-blue-400" />;
      case "interview":
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case "project":
        return <Compass className="w-4 h-4 text-pink-400" />;
      case "roadmap":
        return <Hash className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0c1220] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search DSA patterns, interview questions, technologies, projects..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/40">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium text-slate-400">Search PrepForge Knowledge Base</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Type a pattern (e.g. &ldquo;sliding window&rdquo;), technology (&ldquo;nodejs&rdquo;), question (&ldquo;event loop&rdquo;), or project idea.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm text-slate-400 font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or browse the navigation directories above.</p>
            </div>
          ) : (
            <div className="py-1 space-y-1">
              {results.map((item) => {
                const isExternal = item.url.startsWith("http");
                const content = (
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 transition group cursor-pointer">
                    <div className="flex items-start gap-3 min-w-0 pr-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200 group-hover:text-orange-400 transition truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-slate-500 group-hover:text-slate-300">
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
                  <Link key={item.id} href={item.url} onClick={onClose} className="block">
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-[#090d16] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <span className="text-slate-400">↑↓ to navigate</span>
            <span>•</span>
            <span className="text-slate-400">ESC to close</span>
          </div>
          <span className="font-mono text-orange-400/80">PrepForge Search</span>
        </div>
      </div>
    </div>
  );
}
