"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  Bookmark,
  BookmarkCheck,
  Search,
  RotateCcw,
  Check,
  Calendar
} from "lucide-react";
import { DSAQuestion } from "@/types";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { useAuth } from "@/context/AuthContext";

interface PatternQuestionsListProps {
  questions: DSAQuestion[];
}

export function PatternQuestionsList({ questions }: PatternQuestionsListProps) {
  const { user } = useAuth();

  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, solved, not_started
  const [query, setQuery] = useState("");

  // User state map: questionId -> { status, isBookmarked }
  const [userProgressMap, setUserProgressMap] = useState<Record<string, any>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/questions?type=dsa")
        .then(res => res.json())
        .then(data => {
          if (data.questions) {
            const map: Record<string, any> = {};
            for (const q of data.questions) {
              map[q.id] = {
                status: q.user_status,
                isBookmarked: q.is_bookmarked
              };
            }
            setUserProgressMap(map);
          }
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  async function handleToggleSolved(qId: string, currentStatus: string) {
    if (!user) {
      alert("Please sign in to track your solving progress.");
      return;
    }
    setUpdatingId(qId);
    const newStatus = currentStatus === "solved" ? "not_started" : "solved";

    try {
      const res = await fetch(`/api/questions/${qId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          scheduleRevision: newStatus === "solved"
        })
      });
      if (res.ok) {
        setUserProgressMap(prev => ({
          ...prev,
          [qId]: {
            ...prev[qId],
            status: newStatus
          }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleBookmark(qId: string) {
    if (!user) {
      alert("Please sign in to bookmark questions.");
      return;
    }
    try {
      const res = await fetch(`/api/questions/${qId}/bookmark`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setUserProgressMap(prev => ({
          ...prev,
          [qId]: {
            ...prev[qId],
            isBookmarked: data.isBookmarked
          }
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const difficulties = ["all", "Easy", "Medium", "Hard"];
  const platforms = ["all", "LeetCode", "HackerRank", "Codeforces"];

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchDiff =
        selectedDifficulty === "all" ||
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchPlat =
        selectedPlatform === "all" ||
        q.platform.toLowerCase() === selectedPlatform.toLowerCase();
      const matchQuery =
        query.trim() === "" ||
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.editorialNote.toLowerCase().includes(query.toLowerCase());

      const progress = userProgressMap[q.id];
      const isSolved = progress?.status === "solved" || progress?.status === "mastered";

      let matchStatus = true;
      if (selectedStatus === "solved") matchStatus = isSolved;
      else if (selectedStatus === "not_started") matchStatus = !isSolved;

      return matchDiff && matchPlat && matchQuery && matchStatus;
    });
  }, [questions, selectedDifficulty, selectedPlatform, selectedStatus, query, userProgressMap]);

  return (
    <div className="space-y-6">
      {/* Question Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1220] flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter problems in this pattern..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-mono">Status:</span>
          {[
            { id: "all", label: "All" },
            { id: "solved", label: "Solved" },
            { id: "not_started", label: "To Solve" }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStatus(s.id)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedStatus === s.id
                  ? "bg-orange-500 text-white font-medium"
                  : "bg-slate-900 text-slate-400 border border-slate-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-mono">Difficulty:</span>
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedDifficulty === d
                  ? "bg-orange-500 text-white font-medium shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Cards List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-slate-400 text-xs">
          No problems matched the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((question, index) => {
            const userP = userProgressMap[question.id];
            const isSolved = userP?.status === "solved" || userP?.status === "mastered";
            const isBookmarked = userP?.isBookmarked;

            return (
              <div
                key={question.id}
                className={`p-5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSolved
                    ? "bg-emerald-950/10 border-emerald-800/40"
                    : "bg-[#0f172a]/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 max-w-3xl">
                  {/* Solved Toggle Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleSolved(question.id, userP?.status || "not_started")}
                    disabled={updatingId === question.id}
                    title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                    className="mt-1 text-slate-400 hover:text-emerald-400 transition"
                  >
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                        Step {question.recommendedOrder || index + 1}
                      </span>
                      <DifficultyBadge difficulty={question.difficulty} />
                      <PlatformBadge platform={question.platform} />
                      {isSolved && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                          Solved
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {question.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-400 font-mono">Strategy Note: </strong>
                      {question.editorialNote}
                    </p>
                  </div>
                </div>

                {/* Actions: Bookmark & External Link */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleBookmark(question.id)}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-orange-400 hover:border-slate-700 transition"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={question.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-orange-500 hover:border-orange-500 border border-slate-700 transition group"
                  >
                    <span>Solve on {question.platform}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
