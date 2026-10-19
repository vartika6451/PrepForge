import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDifficultyColor(difficulty: "Easy" | "Medium" | "Hard" | string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
    case "medium":
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
    case "hard":
      return "text-[#A34823] bg-[#C9A28E]/50 border-[#A34823]/40 font-semibold";
    default:
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
  }
}

export function formatPlatformBadge(platform: string) {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
    case "hackerrank":
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
    case "codeforces":
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
    case "interviewbit":
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
    default:
      return "text-[#272624] bg-[#BBB7B0] border-[#99958E]";
  }
}
