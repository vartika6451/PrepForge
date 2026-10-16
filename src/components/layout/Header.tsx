"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Search,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Calendar,
  LayoutDashboard,
  CheckCircle2,
  BookmarkCheck,
  BrainCircuit,
  BarChart2
} from "lucide-react";
import { SearchModal } from "./SearchModal";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const { user, profile, theme, toggleTheme, notifications, unreadCount, markAllNotificationsRead, logout } =
    useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for search toggle shortcut
  useEffect(() => {
    const handleToggle = () => setSearchModalOpen(prev => !prev);
    window.addEventListener("toggle-search-modal", handleToggle);
    return () => window.removeEventListener("toggle-search-modal", handleToggle);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [pathname]);

  const navItems = user
    ? [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Calendar", href: "/calendar", icon: Calendar },
        { label: "Planner", href: "/planner", icon: CheckCircle2 },
        { label: "DSA Patterns", href: "/dsa-patterns" },
        { label: "Interview Prep", href: "/interview-questions" },
        { label: "Core CS & SQL", href: "/core-cs", icon: BrainCircuit },
        { label: "Analytics", href: "/analytics", icon: BarChart2 },
        { label: "Revisions", href: "/revisions", icon: BookmarkCheck }
      ]
    : [
        { label: "Home", href: "/" },
        { label: "DSA Patterns", href: "/dsa-patterns" },
        { label: "Developer Hub", href: "/developer" },
        { label: "Interview Questions", href: "/interview-questions" },
        { label: "Core CS & SQL", href: "/core-cs" },
        { label: "Project Lab", href: "/projects" },
        { label: "Roadmaps", href: "/roadmaps" }
      ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition transform">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  Prep<span className="text-orange-400">Forge</span>
                </span>
                <span className="hidden sm:block text-[9px] uppercase font-mono tracking-wider text-slate-400 -mt-1">
                  Learn • Practice • Build
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 ml-2" aria-label="Main Navigation">
              {navItems.slice(0, user ? 8 : 7).map(item => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <button
              onClick={() => setSearchModalOpen(true)}
              type="button"
              aria-label="Open search"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-[#0f172a] text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent hover:border-slate-800"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    type="button"
                    aria-label="Notifications"
                    className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-[#0f172a] shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="text-sm font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-orange-400 hover:text-orange-300"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No notifications right now. Keep up the great work!
                          </div>
                        ) : (
                          notifications.map(n => (
                            <Link
                              key={n.id}
                              href={n.link_url || "/dashboard"}
                              className={`block p-2.5 rounded-lg border transition text-xs ${
                                n.is_read
                                  ? "bg-slate-900/40 border-slate-800/60 text-slate-400"
                                  : "bg-orange-950/20 border-orange-800/40 text-slate-200"
                              }`}
                            >
                              <div className="font-medium text-slate-200">{n.title}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{n.message}</div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    type="button"
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {user.name ? user.name[0] : "U"}
                    </div>
                    <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate hidden sm:inline">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-[#0f172a] shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                        <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                        {profile?.target_role && (
                          <div className="mt-1 inline-block px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-mono">
                            {profile.target_role}
                          </div>
                        )}
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/calendar"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      >
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Preparation Calendar</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>

                      <div className="my-1 border-t border-slate-800/80" />

                      <button
                        onClick={logout}
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-slate-800 bg-[#090d16] px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {navItems.map(item => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "text-orange-400 bg-orange-500/10 border border-orange-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!user && (
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2 rounded-xl text-sm font-medium text-slate-300 bg-slate-900 border border-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
