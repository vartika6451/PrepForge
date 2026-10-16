"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart2,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Code2,
  BrainCircuit,
  Calendar,
  AlertCircle,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchAnalytics();
      }
    }
  }, [user, authLoading, router, fetchAnalytics]);

  if (loading || authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
            ))}
          </div>
          <div className="h-64 bg-slate-900 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { activeDays, tasks, dsaByDifficulty, dsaTopics, devCategories, weeklyHours, heatmap, insights } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Real Database Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Performance & Consistency Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Visual statistics calculated directly from your persistent activity logs, solved problems, and preparation schedule.
        </p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a]">
          <div className="text-xs text-slate-400">Total Active Days</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {activeDays} <span className="text-xs font-normal text-slate-400 font-sans">days</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Proven study routine</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a]">
          <div className="text-xs text-slate-400">Task Completion Rate</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {tasks.overallCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {tasks.totalCompleted} of {tasks.totalPlanned} tasks
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a]">
          <div className="text-xs text-slate-400">DSA Solved</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {dsaByDifficulty.Easy + dsaByDifficulty.Medium + dsaByDifficulty.Hard}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            E: {dsaByDifficulty.Easy} • M: {dsaByDifficulty.Medium} • H: {dsaByDifficulty.Hard}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a]">
          <div className="text-xs text-slate-400">Mastered Dev Topics</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {devCategories.reduce((acc: number, c: any) => acc + c.completed, 0)}
          </div>
          <div className="text-[11px] text-blue-400 mt-1">Interview architecture</div>
        </div>
      </div>

      {/* 90-Day Activity Heatmap */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white">90-Day Activity Heatmap</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-950/60" />
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-800/80" />
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-2">
          {heatmap.map((cell: any) => {
            let bgClass = "bg-slate-900/60 border border-slate-800/60";
            if (cell.level === 1) bgClass = "bg-orange-950/80 border border-orange-900/60";
            if (cell.level === 2) bgClass = "bg-orange-800/80 border border-orange-700/60";
            if (cell.level === 3) bgClass = "bg-orange-600 border border-orange-500/80";
            if (cell.level === 4) bgClass = "bg-orange-500 border border-amber-400";

            return (
              <div
                key={cell.date}
                className={`w-3.5 h-3.5 rounded-sm ${bgClass} cursor-pointer transition hover:scale-125`}
                title={`${cell.date}: ${cell.tasks} tasks done, ${cell.dsaSolved} DSA solved, ${cell.studyMinutes}m studied`}
              />
            );
          })}
        </div>
      </div>

      {/* Grid: Study Hours per Week & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Study Hours */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Study Hours by Week</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Last 4 Weeks</span>
          </div>

          <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4">
            {weeklyHours.map((w: any) => {
              const heightPercent = Math.min(100, Math.max(10, (w.hours / 25) * 100));
              return (
                <div key={w.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[11px] font-mono text-slate-300 font-bold">{w.hours}h</div>
                  <div className="w-full bg-slate-800/60 rounded-t-xl h-32 flex items-end p-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-slate-400">{w.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strongest & Weakest Topics Insight */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Pattern Strengths & Areas to Target</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strongest Patterns (Most Practice Logged)</span>
              </div>
              {insights.strongestTopics.length === 0 ? (
                <div className="text-slate-400 pl-5">Solve more DSA problems to populate strength metrics.</div>
              ) : (
                <div className="space-y-1.5 pl-5">
                  {insights.strongestTopics.map((t: any) => (
                    <div key={t.topic} className="flex items-center justify-between text-slate-300 font-mono">
                      <span>{t.topic}</span>
                      <span className="text-emerald-400 font-bold">{t.solved_count} solved</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Recommended Focus (Untackled Topics)</span>
              </div>
              {insights.weakestTopics.length === 0 ? (
                <div className="text-slate-400 pl-5">All core patterns have at least one solved problem!</div>
              ) : (
                <div className="space-y-1.5 pl-5">
                  {insights.weakestTopics.map((t: any) => (
                    <div key={t.topic} className="flex items-center justify-between text-slate-300 font-mono">
                      <span>{t.topic}</span>
                      <span className="text-slate-400">0 of {t.total_in_topic} done</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
