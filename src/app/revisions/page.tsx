"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Sparkles,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RevisionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"revisions" | "bookmarks">("revisions");
  const [filter, setFilter] = useState("all"); // all, upcoming, overdue, completed
  const [revisions, setRevisions] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({ overdue_count: 0, upcoming_count: 0, completed_count: 0 });
  const [loading, setLoading] = useState(true);

  const fetchRevisions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/revisions?filter=${filter}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setRevisions(json.revisions || []);
        setCounts(json.counts || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const json = await res.json();
        setBookmarks(json.bookmarks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        if (activeTab === "revisions") fetchRevisions();
        else fetchBookmarks();
      }
    }
  }, [user, authLoading, activeTab, fetchRevisions, fetchBookmarks]);

  async function handleCompleteRevision(id: string) {
    try {
      const res = await fetch(`/api/revisions/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleNext: true })
      });
      if (res.ok) fetchRevisions();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveBookmark(qId: string) {
    try {
      const res = await fetch(`/api/questions/${qId}/bookmark`, { method: "POST" });
      if (res.ok) fetchBookmarks();
    } catch (err) {
      console.error(err);
    }
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Spaced Repetition & Bookmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Revision Queue & Saved Bank
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Cement your problem-solving memory with automated spaced repetition reminders (+3, +7, +14 days) and review bookmarked questions.
        </p>
      </div>

      {/* Tabs Switcher: Revisions vs Bookmarks */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("revisions")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === "revisions"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Spaced Revisions</span>
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmarked ({bookmarks.length})</span>
          </button>
        </div>

        {/* Revisions Filter pills */}
        {activeTab === "revisions" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === "all" ? "bg-slate-800 text-orange-400" : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === "upcoming" ? "bg-slate-800 text-orange-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Upcoming ({counts.upcoming_count})
            </button>
            <button
              onClick={() => setFilter("overdue")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === "overdue" ? "bg-rose-950/40 text-rose-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Overdue ({counts.overdue_count})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === "completed" ? "bg-emerald-950/40 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Done ({counts.completed_count})
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "revisions" ? (
        <div className="space-y-3">
          {revisions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0f172a] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No revisions due in this filter</h3>
              <p className="text-xs text-slate-400">
                When you solve DSA problems or technical questions, schedule a revision to review here!
              </p>
            </div>
          ) : (
            revisions.map(rev => {
              const isOverdue = !rev.is_completed && rev.scheduled_date < todayStr;
              return (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                    rev.is_completed
                      ? "bg-slate-900/40 border-slate-800/60 opacity-75"
                      : isOverdue
                      ? "bg-rose-950/20 border-rose-900/40"
                      : "bg-[#0f172a] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {rev.question_title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                        {rev.question_type}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          rev.question_difficulty === "Easy"
                            ? "bg-emerald-950 text-emerald-400"
                            : rev.question_difficulty === "Medium"
                            ? "bg-amber-950 text-amber-400"
                            : "bg-rose-950 text-rose-400"
                        }`}
                      >
                        {rev.question_difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
                      <span className={isOverdue ? "text-rose-400 font-bold" : ""}>
                        Due: {rev.scheduled_date}
                      </span>
                      <span>•</span>
                      <span>Repetition #{rev.repetition_number || 1}</span>
                      {rev.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-xs text-slate-400">{rev.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {rev.question_url && (
                      <a
                        href={rev.question_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                        title="Open external problem link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {!rev.is_completed && (
                      <button
                        onClick={() => handleCompleteRevision(rev.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Reviewed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Bookmarks Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.length === 0 ? (
            <div className="col-span-2 p-12 text-center rounded-2xl border border-slate-800 bg-[#0f172a] space-y-2">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No bookmarked questions yet</h3>
              <p className="text-xs text-slate-400">
                Click the bookmark icon on any DSA pattern or interview question to save it to your personal library.
              </p>
            </div>
          ) : (
            bookmarks.map(b => (
              <div
                key={b.bookmark_id}
                className="p-4 rounded-xl border border-slate-800 bg-[#0f172a] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 uppercase">
                      {b.type} • {b.category}
                    </span>
                    <button
                      onClick={() => handleRemoveBookmark(b.id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                      title="Remove bookmark"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white">{b.title}</h4>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 capitalize">Status: {b.user_status}</span>
                  {b.external_url ? (
                    <a
                      href={b.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline flex items-center gap-1"
                    >
                      <span>Problem Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link href="/core-cs" className="text-orange-400 hover:underline">
                      View in Core CS
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
