"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Filter,
  Flame,
  FileText,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Save
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type ViewMode = "month" | "week" | "day";

export default function CalendarPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [currentDate, setCurrentDate] = useState<Date>(new Date("2026-10-17T00:00:00Z"));
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Selected Date state
  const [selectedDateStr, setSelectedDateStr] = useState("2026-10-17");
  const [todayStr, setTodayStr] = useState("2026-10-17");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    const dStr = now.toISOString().split("T")[0];
    setTodayStr(dStr);
    setSelectedDateStr(dStr);
  }, []);

  // Reflection notes for selected date
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // Add Task Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("dsa");
  const [newPriority, setNewPriority] = useState("medium");
  const [newMinutes, setNewMinutes] = useState(45);
  const [addingTask, setAddingTask] = useState(false);

  // Calculate start and end date for current view
  const getViewRange = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (viewMode === "month") {
      // First day of month
      const firstDay = new Date(year, month, 1);
      // Last day of month
      const lastDay = new Date(year, month + 1, 0);

      // Pad to beginning of week (Sunday)
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - firstDay.getDay());

      // Pad to end of week (Saturday)
      const endDate = new Date(lastDay);
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

      return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0]
      };
    } else if (viewMode === "week") {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0]
      };
    } else {
      // Day view
      const dStr = currentDate.toISOString().split("T")[0];
      return { startDate: dStr, endDate: dStr };
    }
  }, [currentDate, viewMode]);

  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getViewRange();
      const res = await fetch(
        `/api/calendar/summary?startDate=${startDate}&endDate=${endDate}&category=${selectedCategory}`
      );
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCalendarData(data);
      }
    } catch (err) {
      console.error("Fetch calendar error:", err);
    } finally {
      setLoading(false);
    }
  }, [getViewRange, selectedCategory, router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchCalendar();
      }
    }
  }, [user, authLoading, router, fetchCalendar]);

  // Sync reflection notes when selected date changes
  useEffect(() => {
    if (calendarData?.days && calendarData.days[selectedDateStr]) {
      setReflectionNotes(calendarData.days[selectedDateStr].reflectionNotes || "");
    } else {
      setReflectionNotes("");
    }
  }, [selectedDateStr, calendarData]);

  // Navigation handlers
  function handlePrev() {
    setCurrentDate(prev => {
      const next = new Date(prev);
      if (viewMode === "month") next.setMonth(next.getMonth() - 1);
      else if (viewMode === "week") next.setDate(next.getDate() - 7);
      else next.setDate(next.getDate() - 1);
      return next;
    });
  }

  function handleNext() {
    setCurrentDate(prev => {
      const next = new Date(prev);
      if (viewMode === "month") next.setMonth(next.getMonth() + 1);
      else if (viewMode === "week") next.setDate(next.getDate() + 7);
      else next.setDate(next.getDate() + 1);
      return next;
    });
  }

  function handleToday() {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  }

  // Toggle task complete / incomplete
  async function handleToggleTask(taskId: string, currentCompleted: boolean) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentCompleted })
      });
      if (res.ok) {
        fetchCalendar();
      }
    } catch (err) {
      console.error("Task toggle error:", err);
    }
  }

  // Delete task
  async function handleDeleteTask(taskId: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCalendar();
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  }

  // Save Daily Reflection
  async function handleSaveReflection() {
    setSavingNotes(true);
    try {
      const res = await fetch("/api/calendar/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDateStr,
          notes: reflectionNotes
        })
      });
      if (res.ok) {
        setNotesSavedAlert(true);
        setTimeout(() => setNotesSavedAlert(false), 2500);
        fetchCalendar();
      }
    } catch (err) {
      console.error("Save reflection error:", err);
    } finally {
      setSavingNotes(false);
    }
  }

  // Create new task for selected date
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddingTask(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          priority: newPriority,
          estimatedMinutes: newMinutes,
          dueDate: selectedDateStr
        })
      });
      if (res.ok) {
        setNewTitle("");
        setShowAddModal(false);
        fetchCalendar();
      }
    } catch (err) {
      console.error("Add task error:", err);
    } finally {
      setAddingTask(false);
    }
  }

  const selectedDayInfo = calendarData?.days?.[selectedDateStr] || {
    date: selectedDateStr,
    planned: 0,
    completed: 0,
    remaining: 0,
    studyMinutes: 0,
    tasks: [],
    status: "rest"
  };

  const selectedStudyHours = Math.floor(selectedDayInfo.studyMinutes / 60);
  const selectedStudyMins = selectedDayInfo.studyMinutes % 60;

  // Render day cells for month view
  const daysList: string[] = [];
  if (calendarData?.days) {
    const keys = Object.keys(calendarData.days).sort();
    daysList.push(...keys);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Preparation Calendar
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Track daily study consistency, historical milestones, and schedule upcoming problem-solving.
          </p>
        </div>

        {/* View Mode & Month Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "month" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "week" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "day" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Day
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrev}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              type="button"
              className="px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm font-bold text-white px-3 font-mono">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* 2. Category Filter & Status Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {["all", "dsa", "development", "core_cs", "sql", "system_design", "custom"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase font-mono transition ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> All Done
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Missed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600" /> Scheduled
          </span>
        </div>
      </div>

      {/* 3. Main Grid: Calendar Matrix & Date Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Calendar Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl overflow-hidden p-4 sm:p-6">
            {/* Day Header row */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2 font-mono uppercase">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Dates Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {daysList.map(dStr => {
                const dayData = calendarData?.days?.[dStr];
                const dateObj = new Date(dStr + "T00:00:00");
                const dayNum = dateObj.getDate();
                const isSelected = selectedDateStr === dStr;
                const isToday = dStr === todayStr;

                // Status border and badge colors
                let statusBadge = null;
                if (dayData?.planned > 0) {
                  if (dayData.status === "completed") {
                    statusBadge = (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    );
                  } else if (dayData.status === "partial") {
                    statusBadge = (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    );
                  } else if (dayData.status === "missed") {
                    statusBadge = (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    );
                  } else {
                    statusBadge = (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    );
                  }
                }

                return (
                  <button
                    key={dStr}
                    type="button"
                    onClick={() => setSelectedDateStr(dStr)}
                    className={`min-h-[75px] sm:min-h-[90px] p-2 rounded-xl border text-left flex flex-col justify-between transition group ${
                      isSelected
                        ? "bg-orange-500/15 border-orange-500 shadow-md shadow-orange-500/20"
                        : isToday
                        ? "bg-slate-900 border-orange-500/60"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-bold font-mono ${
                          isToday
                            ? "w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center -ml-1 -mt-1"
                            : isSelected
                            ? "text-orange-400 font-bold"
                            : "text-slate-300"
                        }`}
                      >
                        {dayNum}
                      </span>
                      {statusBadge}
                    </div>

                    {/* Task Count & Study Time */}
                    {dayData?.planned > 0 ? (
                      <div className="mt-1 space-y-0.5">
                        <div className="text-[10px] font-mono text-slate-300">
                          {dayData.completed}/{dayData.planned} done
                        </div>
                        {dayData.studyMinutes > 0 && (
                          <div className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{dayData.studyMinutes}m</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 font-mono">Rest</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Activity Inspector */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-6">
            {/* Date Header & Summary Badge */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-orange-400 uppercase">
                    {selectedDateStr === todayStr ? "TODAY" : "SELECTED DATE"}
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Task</span>
                </button>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Progress</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedDayInfo.completed}/{selectedDayInfo.planned}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    {selectedDayInfo.completionRate || 0}% Complete
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Study Time</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedStudyHours}h {selectedStudyMins}m
                  </div>
                  <div className="text-[10px] text-purple-400">
                    {selectedDayInfo.dsaSolved || 0} DSA Solved
                  </div>
                </div>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>Day Tasks ({selectedDayInfo.tasks?.length || 0})</span>
              </div>

              {selectedDayInfo.tasks?.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No tasks recorded for this date.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {selectedDayInfo.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border transition flex items-start justify-between gap-2.5 ${
                        task.is_completed
                          ? "bg-slate-900/40 border-slate-800 text-slate-400"
                          : "bg-slate-900 border-slate-700/80 text-slate-100"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id, task.is_completed)}
                          className="mt-0.5 text-slate-400 hover:text-orange-400 transition"
                        >
                          {task.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-medium truncate ${
                              task.is_completed ? "line-through text-slate-400" : "text-white"
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span className="uppercase">{task.category}</span>
                            <span>•</span>
                            <span>{task.estimated_minutes}m</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-400 hover:text-red-400 p-1"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Reflection & Notes */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span>Daily Reflection & Notes</span>
                </label>
                {notesSavedAlert && (
                  <span className="text-[11px] text-emerald-400 animate-in fade-in">Saved!</span>
                )}
              </div>

              <textarea
                rows={3}
                value={reflectionNotes}
                onChange={e => setReflectionNotes(e.target.value)}
                placeholder="What went well today? What concepts or edge cases tripped you up? Notes persist across devices..."
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
              />

              <button
                type="button"
                onClick={handleSaveReflection}
                disabled={savingNotes}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingNotes ? "Saving..." : "Save Reflection"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Task for {selectedDateStr}</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Monotonic Stack Pattern"
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
                  {addingTask ? "Saving..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
