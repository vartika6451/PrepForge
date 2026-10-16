"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowRight,
  BookOpen,
  Code2,
  BrainCircuit,
  Database,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskUpdating, setTaskUpdating] = useState<string | null>(null);

  // Quick Add Task Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("dsa");
  const [newPriority, setNewPriority] = useState("medium");
  const [newMinutes, setNewMinutes] = useState(45);
  const [addingTask, setAddingTask] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load dashboard data");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (!user.onboardingCompleted) {
        router.push("/onboarding");
      } else {
        fetchDashboard();
      }
    }
  }, [user, authLoading, router, fetchDashboard]);

  async function handleToggleTask(taskId: string, currentStatus: boolean) {
    setTaskUpdating(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus })
      });
      if (res.ok) {
        // Optimistic refresh
        fetchDashboard();
      }
    } catch (err) {
      console.error("Toggle task error:", err);
    } finally {
      setTaskUpdating(null);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddingTask(true);
    const todayStr = new Date().toISOString().split("T")[0];

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          priority: newPriority,
          estimatedMinutes: newMinutes,
          dueDate: todayStr
        })
      });
      if (res.ok) {
        setNewTitle("");
        setShowAddModal(false);
        fetchDashboard();
      }
    } catch (err) {
      console.error("Create task error:", err);
    } finally {
      setAddingTask(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-900 rounded-2xl border border-slate-800" />
            <div className="h-96 bg-slate-900 rounded-2xl border border-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-sm text-red-300 mb-4">
          {error || "Unable to display dashboard"}
        </div>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const { today, stats, profile: userProfile, weeklyChartData, upcomingRevisions, daysUntilInterview } = data;
  const studyHours = Math.floor(stats.totalStudyMinutes / 60);
  const studyMins = stats.totalStudyMinutes % 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900/90 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
            <span>{today.displayDate}</span>
            <span>•</span>
            <span className="capitalize">{userProfile.target_role || "Software Engineer"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {data.user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {today.completedCount === today.totalCount && today.totalCount > 0
              ? "All today's tasks completed! You're building unbeatable momentum."
              : `You have ${today.totalCount - today.completedCount} task${
                  today.totalCount - today.completedCount !== 1 ? "s" : ""
                } scheduled for today.`}
          </p>
        </div>

        {/* Quick Actions & Countdown */}
        <div className="flex items-center gap-3 relative z-10">
          {daysUntilInterview !== null && (
            <div className="px-3.5 py-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-center">
              <div className="text-[10px] uppercase font-mono tracking-wider text-orange-400">Interview In</div>
              <div className="text-lg font-black text-white font-mono">{daysUntilInterview} Days</div>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Daily Streak</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {stats.currentStreak} <span className="text-xs font-normal text-slate-400 font-sans">days</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-0.5">
              Longest: {stats.longestStreak} days
            </div>
          </div>
        </div>

        {/* Overall Completion */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Plan Progress</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {stats.completionPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.completedTasks} of {stats.totalTasks} tasks done
            </div>
          </div>
        </div>

        {/* DSA Solved */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">DSA Problems</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {stats.dsa.solved} <span className="text-xs font-normal text-slate-400 font-sans">solved</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5">
              <span className="text-emerald-400">E: {stats.dsa.easy}</span>
              <span className="text-amber-400">M: {stats.dsa.medium}</span>
              <span className="text-rose-400">H: {stats.dsa.hard}</span>
            </div>
          </div>
        </div>

        {/* Total Study Time */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Study Time</div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {studyHours}h {studyMins}m
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Goal: {userProfile.daily_study_hours || 3}h / day
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Today's Tasks & Study Plan vs Visual Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <h2 className="text-base font-bold text-white">Today&apos;s Focus Tasks</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {today.completedCount}/{today.totalCount}
                </span>
              </div>
              <Link
                href="/planner"
                className="text-xs font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>Study Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {today.tasks.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white">No tasks scheduled for today</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Take a scheduled rest day or generate a personalized study plan for this week.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition"
                  >
                    Add a Task
                  </button>
                  <Link
                    href="/planner"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition"
                  >
                    Open Planner
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {today.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border transition flex items-start gap-3 ${
                      task.is_completed
                        ? "bg-slate-900/30 border-slate-800/60 opacity-75"
                        : "bg-slate-900/70 border-slate-700/80 hover:border-slate-600"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id, task.is_completed)}
                      disabled={taskUpdating === task.id}
                      aria-label="Toggle task completion"
                      className="mt-0.5 text-slate-400 hover:text-orange-400 transition"
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-medium ${
                            task.is_completed
                              ? "line-through text-slate-400"
                              : "text-slate-100"
                          }`}
                        >
                          {task.title}
                        </span>

                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            task.category === "dsa"
                              ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                              : task.category === "development"
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                              : "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                          }`}
                        >
                          {task.category}
                        </span>

                        {task.question_difficulty && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              task.question_difficulty === "Easy"
                                ? "text-emerald-400 bg-emerald-950/40"
                                : task.question_difficulty === "Medium"
                                ? "text-amber-400 bg-amber-950/40"
                                : "text-rose-400 bg-rose-950/40"
                            }`}
                          >
                            {task.question_difficulty}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.estimated_minutes}m</span>
                        </span>

                        {task.question_url && (
                          <a
                            href={task.question_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-orange-400 hover:underline"
                          >
                            <span>Open on {task.question_platform || "LeetCode"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continue Learning Pathways */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Continue Learning</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/dsa-patterns"
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-orange-500/40 hover:bg-slate-900 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">18 DSA Patterns</div>
                <div className="text-[11px] text-slate-400 mt-1">Master algorithmic templates</div>
              </Link>

              <Link
                href="/core-cs"
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/40 hover:bg-slate-900 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Core CS & SQL</div>
                <div className="text-[11px] text-slate-400 mt-1">OS, DBMS, Networks & Queries</div>
              </Link>

              <Link
                href="/interview-questions"
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/40 hover:bg-slate-900 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Tech Questions</div>
                <div className="text-[11px] text-slate-400 mt-1">Output predictions & architecture</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Activity & Upcoming Revisions */}
        <div className="space-y-6">
          {/* Weekly Activity Bar Chart */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Weekly Activity</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Last 7 Days</span>
            </div>

            <div className="flex items-end justify-between gap-2 h-44 pt-6 px-1">
              {weeklyChartData.map((d: any) => {
                const heightPercent = Math.min(100, Math.max(12, (d.tasks / 5) * 100));
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                      {d.tasks}
                    </div>
                    <div className="w-full bg-slate-800/60 rounded-t-lg h-28 flex items-end p-0.5 overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-orange-600 to-amber-500 rounded-t transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{d.day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Spaced Revisions */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Upcoming Revisions</h3>
              </div>
              <Link
                href="/revisions"
                className="text-xs text-orange-400 hover:text-orange-300"
              >
                View all
              </Link>
            </div>

            {upcomingRevisions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No revisions scheduled yet. Mark questions for revision while solving!
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingRevisions.map((rev: any) => (
                  <Link
                    key={rev.id}
                    href="/revisions"
                    className="block p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition"
                  >
                    <div className="text-xs font-medium text-slate-200 truncate">
                      {rev.title}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>Due: {rev.scheduled_date}</span>
                      <span className="text-orange-400 capitalize">{rev.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Focus Task for Today</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Solve 3 Binary Search Mediums"
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="dsa">DSA</option>
                    <option value="development">Development</option>
                    <option value="core_cs">Core CS</option>
                    <option value="sql">SQL</option>
                    <option value="system_design">System Design</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estimated Minutes: {newMinutes}m
                </label>
                <input
                  type="range"
                  min={15}
                  max={180}
                  step={15}
                  value={newMinutes}
                  onChange={e => setNewMinutes(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingTask}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
                >
                  {addingTask ? "Saving..." : "Add to Today"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
