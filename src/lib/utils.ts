import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDifficultyColor(difficulty: "Easy" | "Medium" | "Hard" | string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "medium":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "hard":
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-400 bg-zinc-800 border-zinc-700";
  }
}

export function formatPlatformBadge(platform: string) {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return "text-amber-300 bg-amber-950/40 border-amber-800/40";
    case "hackerrank":
      return "text-emerald-300 bg-emerald-950/40 border-emerald-800/40";
    case "codeforces":
      return "text-blue-300 bg-blue-950/40 border-blue-800/40";
    case "interviewbit":
      return "text-purple-300 bg-purple-950/40 border-purple-800/40";
    default:
      return "text-zinc-300 bg-zinc-800/60 border-zinc-700";
  }
}
