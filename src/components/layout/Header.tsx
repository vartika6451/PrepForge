"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Search, Menu, X, ArrowUpRight } from "lucide-react";
import { SearchModal } from "./SearchModal";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "DSA Patterns", href: "/dsa-patterns" },
  { label: "Developer Hub", href: "/developer" },
  { label: "Interview Questions", href: "/interview-questions" },
  { label: "Project Lab", href: "/projects" },
  { label: "Roadmaps", href: "/roadmaps" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setSearchModalOpen((prev) => !prev);
    window.addEventListener("toggle-search-modal", handleToggle);
    return () => window.removeEventListener("toggle-search-modal", handleToggle);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition transform">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Prep<span className="text-orange-400">Forge</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-mono tracking-wider text-slate-400 -mt-1">
                  Learn • Practice • Build
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Main Navigation">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "text-orange-400 bg-orange-500/10 border border-orange-500/20"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              type="button"
              aria-label="Open search"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0f172a] text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search PrepForge...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* GitHub / External Resource Link */}
            <a
              href="https://github.com/topics/interview-preparation"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition"
            >
              <span>Resources</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#090d16] px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "text-orange-400 bg-orange-500/10 border border-orange-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
