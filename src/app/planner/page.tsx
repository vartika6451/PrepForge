"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  RotateCcw,
  Plus,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Play,
  Layers,
  Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PlannerPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, completed
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Plan customization options
  const [customHours, setCustomHours] = useState(profile?.daily_study_hours || 3);
  const [customDuration, setCustomDuration] = useState(30);

  // Add Task modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("dsa");
  const [priority, setPriority] = useState("medium");
  const [minutes, setMinutes] = useState(45);
  const [todayStr, setTodayStr] = useState("2026-10-17");
  const [dueDate, setDueDate] = useState("2026-10-17");

  useEffect(() => {
    const dStr = new Date().toISOString().split("T")[0];
    setTodayStr(dStr);
    setDueDate(dStr);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/tasks?status=${statusFilter}&category=${categoryFilter}`
      );
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setTasks(json.tasks || []);
      }
    } catch (err) {
      console.error("Fetch planner tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchTasks();
      }
    }
  }, [user, authLoading, router, fetchTasks]);

  // Regenerate plan (Preserves all historical completed tasks!)
  async function handleRegeneratePlan() {
    if (!confirm("Regenerate study schedule? Completed tasks will remain preserved.")) return;
    setRegenerating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dailyStudyHours: customHours,
          planDurationDays: customDuration
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(data.message);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to regenerate plan");
    } finally {
      setRegenerating(false);
    }
  }

  // Reschedule missed / overdue tasks to today
  async function handleRescheduleMissed() {
    setRescheduling(true);
    setMessage(null);

    try {
      const res = await fetch("/api/planner/reschedule-missed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(data.message);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to reschedule missed tasks");
    } finally {
      setRescheduling(false);
    }
  }

  // Toggle complete
  async function handleToggleTask(taskId: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  // Delete task
  async function handleDeleteTask(taskId: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  // Create Custom Task
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          priority,
          estimatedMinutes: minutes,
          dueDate
        })
      });
      if (res.ok) {
        setTitle("");
        setShowAddModal(false);
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Task metrics
  const completedCount = tasks.filter(t => t.is_completed).length;
  const overdueCount = tasks.filter(t => !t.is_completed && t.due_date < todayStr).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Personalized Study Planner
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Intelligently balances daily time blocks across DSA patterns, full-stack technologies, and systems topics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {overdueCount > 0 && (
            <button
              onClick={handleRescheduleMissed}
              disabled={rescheduling}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reschedule Overdue ({overdueCount})</span>
            </button>
          )}

          <button
            onClick={handleRegeneratePlan}
            disabled={regenerating}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-600 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{regenerating ? "Regenerating..." : "Regenerate Plan"}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* 2. Status & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "all" ? "bg-orange-500 text-white" : "bg-slate-900 text-slate-400"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "pending" ? "bg-orange-500 text-white" : "bg-slate-900 text-slate-400"
            }`}
          >
            Pending ({tasks.length - completedCount})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "completed" ? "bg-orange-500 text-white" : "bg-slate-900 text-slate-400"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "dsa", "development", "core_cs", "sql", "system_design", "custom"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition ${
                categoryFilter === cat
                  ? "bg-slate-800 text-orange-400 border border-orange-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Task List Table / Cards */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl p-4 sm:p-6 space-y-3">
        {tasks.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No tasks match your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Regenerate Plan&quot; to populate your study blocks, or add custom interview milestones.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => {
              const isPast = task.due_date < todayStr;
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                    task.is_completed
                      ? "bg-slate-900/40 border-slate-800/60 opacity-75"
                      : isPast
                      ? "bg-rose-950/20 border-rose-900/40"
                      : "bg-slate-900/80 border-slate-700/80 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id, task.is_completed)}
                      className="mt-0.5 text-slate-400 hover:text-orange-400"
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            task.is_completed ? "line-through text-slate-400" : "text-white"
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

                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded capitalize ${
                            task.priority === "urgent"
                              ? "bg-red-500/15 text-red-400 border border-red-500/20"
                              : task.priority === "high"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{task.estimated_minutes}m</span>
                    </span>

                    <span
                      className={`flex items-center gap-1 ${
                        isPast && !task.is_completed ? "text-rose-400 font-bold" : ""
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{task.due_date}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Custom Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Implement LRU Cache from scratch"
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
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
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Duration: {minutes}m
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={360}
                    step={15}
                    value={minutes}
                    onChange={e => setMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
