"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BrainCircuit,
  Database,
  Server,
  Network,
  Cpu,
  Code2,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  FileCode,
  Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CoreCSPage() {
  const { user } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected question modal / detail
  const [activeQuestion, setActiveQuestion] = useState<any | null>(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [savingProgress, setSavingProgress] = useState(false);

  // SQL Runner state
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState<any | null>(null);
  const [runningSql, setRunningSql] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/questions?type=core_cs&category=${activeSubject}&difficulty=${activeDifficulty}&search=${encodeURIComponent(searchQuery)}`);
      const sqlRes = await fetch(`/api/questions?type=sql&difficulty=${activeDifficulty}&search=${encodeURIComponent(searchQuery)}`);

      let combined: any[] = [];
      if (res.ok) {
        const d = await res.json();
        combined.push(...(d.questions || []));
      }
      if (sqlRes.ok && (activeSubject === "all" || activeSubject === "SQL")) {
        const d = await sqlRes.json();
        combined.push(...(d.questions || []));
      }

      setQuestions(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeSubject, activeDifficulty, searchQuery]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function openQuestion(q: any) {
    setActiveQuestion(q);
    setPersonalNotes(q.personal_notes || "");
    if (q.type === "sql") {
      setSqlQuery(q.solution_query ? "-- Write your SQL query here:\nSELECT * FROM " : "");
      setSqlResult(null);
    }
  }

  async function handleToggleBookmark(qId: string) {
    if (!user) return;
    try {
      const res = await fetch(`/api/questions/${qId}/bookmark`, { method: "POST" });
      if (res.ok) {
        fetchQuestions();
        if (activeQuestion?.id === qId) {
          setActiveQuestion((prev: any) => ({ ...prev, is_bookmarked: !prev.is_bookmarked }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateStatus(status: string) {
    if (!user || !activeQuestion) return;
    setSavingProgress(true);

    try {
      const res = await fetch(`/api/questions/${activeQuestion.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          personalNotes,
          scheduleRevision: status === "solved"
        })
      });

      if (res.ok) {
        fetchQuestions();
        setActiveQuestion((prev: any) => ({
          ...prev,
          user_status: status,
          personal_notes: personalNotes
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProgress(false);
    }
  }

  async function handleRunSQL() {
    if (!activeQuestion) return;
    setRunningSql(true);
    setSqlResult(null);

    try {
      const res = await fetch("/api/questions/sql-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          userQuery: sqlQuery
        })
      });
      const data = await res.json();
      setSqlResult(data);

      if (data.success) {
        // Automatically mark as solved
        handleUpdateStatus("solved");
      }
    } catch (err) {
      setSqlResult({ success: false, error: "Execution test failed" });
    } finally {
      setRunningSql(false);
    }
  }

  const subjects = [
    { id: "all", label: "All Subjects", icon: BrainCircuit },
    { id: "Operating Systems", label: "Operating Systems", icon: Cpu },
    { id: "DBMS", label: "DBMS", icon: Database },
    { id: "Computer Networks", label: "Computer Networks", icon: Network },
    { id: "OOP", label: "OOP & SOLID", icon: Code2 },
    { id: "System Design", label: "System Design", icon: Server },
    { id: "SQL", label: "SQL Queries", icon: Database }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Computer Science Engineering Foundations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Core CS & SQL Playground
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Master the theoretical underpinnings and query optimizations tested in technical rounds: OS, DBMS, Networks, OOP, System Design, and sandboxed SQL exercises.
        </p>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjects.map(s => {
          const Icon = s.icon;
          const isActive = activeSubject === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSubject(s.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search concepts, questions, or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5">
          {["all", "Easy", "Medium", "Hard"].map(diff => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                activeDifficulty === diff
                  ? "bg-slate-800 text-orange-400 border border-orange-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map(q => {
          const isSolved = q.user_status === "solved" || q.user_status === "mastered";
          return (
            <div
              key={q.id}
              onClick={() => openQuestion(q)}
              className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] hover:border-slate-700 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {q.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        q.difficulty === "Easy"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                          : q.difficulty === "Medium"
                          ? "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                          : "bg-rose-950/40 text-rose-400 border border-rose-800/40"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSolved && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleBookmark(q.id);
                      }}
                      className="p-1 text-slate-400 hover:text-orange-400"
                    >
                      {q.is_bookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-orange-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {q.explanation}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-400">
                  Topic: {q.pattern_or_topic || q.category}
                </span>
                <span className="text-orange-400 group-hover:translate-x-0.5 transition flex items-center gap-1 text-[11px] font-semibold">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail & Practice Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    {activeQuestion.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {activeQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {activeQuestion.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveQuestion(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Question / Explanation */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Concept & Architectural Breakdown
                </h4>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {activeQuestion.explanation}
                </div>
              </div>

              {/* Code Example if available */}
              {activeQuestion.code_example && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>Implementation Example</span>
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 overflow-x-auto font-mono">
                    <code>{activeQuestion.code_example}</code>
                  </pre>
                </div>
              )}

              {/* SQL Practice Playground (if SQL Question) */}
              {activeQuestion.type === "sql" && (
                <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-4 h-4" />
                      <span>Sandboxed SQL Playground</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Simulated Safe Environment</span>
                  </div>

                  {activeQuestion.sample_schema && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-300 mb-1">Target Schema:</div>
                      <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto">
                        <code>{activeQuestion.sample_schema}</code>
                      </pre>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Write Your Query:
                    </label>
                    <textarea
                      rows={5}
                      value={sqlQuery}
                      onChange={e => setSqlQuery(e.target.value)}
                      placeholder="SELECT ... FROM ..."
                      className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white font-mono placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleRunSQL}
                      disabled={runningSql}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{runningSql ? "Evaluating..." : "Run Query"}</span>
                    </button>

                    {activeQuestion.solution_query && (
                      <button
                        type="button"
                        onClick={() => setSqlQuery(activeQuestion.solution_query)}
                        className="text-xs text-orange-400 hover:underline"
                      >
                        Load Reference Solution
                      </button>
                    )}
                  </div>

                  {sqlResult && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs ${
                        sqlResult.success
                          ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                          : "bg-red-950/40 border-red-800 text-red-300"
                      }`}
                    >
                      <div className="font-semibold">{sqlResult.message || sqlResult.error}</div>
                      {sqlResult.hint && (
                        <div className="text-[11px] mt-1 text-slate-400">{sqlResult.hint}</div>
                      )}

                      {sqlResult.rows && (
                        <div className="mt-3 overflow-x-auto">
                          <table className="w-full text-left font-mono text-[11px]">
                            <thead>
                              <tr className="border-b border-emerald-800/60">
                                {sqlResult.columns.map((col: string) => (
                                  <th key={col} className="pb-1 pr-3">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sqlResult.rows.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-emerald-900/30">
                                  {sqlResult.columns.map((col: string) => (
                                    <td key={col} className="py-1 pr-3">
                                      {row[col]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Personal Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Personal Revision Notes
                </label>
                <textarea
                  rows={2}
                  value={personalNotes}
                  onChange={e => setPersonalNotes(e.target.value)}
                  placeholder="Note key interview tricks, edge cases, or trade-offs..."
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer: Status controls */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Mark Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("solved")}
                  disabled={savingProgress}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                    activeQuestion.user_status === "solved" || activeQuestion.user_status === "mastered"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("attempted")}
                  disabled={savingProgress}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeQuestion.user_status === "attempted"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  Attempted
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(activeQuestion.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{activeQuestion.is_bookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuestion(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
