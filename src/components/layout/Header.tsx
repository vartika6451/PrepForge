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
      <header className="sticky top-0 z-40 w-full border-b border-[#99958E] bg-[#A59B9F]/95 backdrop-blur-md text-[#272624] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-[#A34823] shadow-sm transition transform group-hover:scale-105">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-[#272624] flex items-center gap-1.5">
                  Prep
                  <span className="text-[#A34823]">
                    Forge
                  </span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-mono tracking-wider -mt-1 text-[#383431]">
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
                        ? "text-white bg-[#A34823] font-semibold shadow-xs"
                        : "text-[#272624] hover:text-[#272624] hover:bg-[#BBB7B0]/60"
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-[#99958E] bg-[#CFCCC6] text-[#383431] hover:text-[#272624] hover:border-[#272624]/40 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search PrepForge...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#BBB7B0] text-[#272624] border border-[#99958E]">
                ⌘K
              </kbd>
            </button>

            {/* External Resource Link */}
            <a
              href="https://github.com/topics/interview-preparation"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#99958E] bg-[#CFCCC6] text-[#272624] hover:bg-[#BBB7B0] transition"
            >
              <span>Resources</span>
              <ArrowUpRight className="w-3 h-3 text-[#383431]" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg text-[#272624] hover:bg-[#BBB7B0] transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#99958E] bg-[#A59B9F] px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150">
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
                      ? "text-white bg-[#A34823] font-semibold"
                      : "text-[#272624] hover:bg-[#BBB7B0]"
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
