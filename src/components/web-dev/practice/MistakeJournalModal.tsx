"use client";

import React, { useState } from "react";
import {
  BookOpen,
  X,
  Plus,
  Trash2,
  Calendar,
  Lightbulb,
  Check,
} from "lucide-react";
import { MistakeCategory, MistakeEntry } from "@/types/web-dev";
import { addMistakeEntry, deleteMistakeEntry } from "@/lib/web-dev-progress";

interface MistakeJournalModalProps {
  questionSlug: string;
  questionTitle: string;
  mistakes: MistakeEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CONFIG: Record<
  MistakeCategory,
  { label: string; bg: string; text: string; border: string }
> = {
  conceptual: {
    label: "Conceptual Misunderstanding",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  approach: {
    label: "Incorrect Approach",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  edge_case: {
    label: "Missed Edge Case",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  bug: {
    label: "Implementation Bug",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
  explanation: {
    label: "Incomplete Explanation",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  other: {
    label: "Other",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  },
};

export function MistakeJournalModal({
  questionSlug,
  questionTitle,
  mistakes,
  isOpen,
  onClose,
}: MistakeJournalModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState<MistakeCategory>("conceptual");
  const [mistakeText, setMistakeText] = useState("");
  const [misunderstandingText, setMisunderstandingText] = useState("");
  const [takeawayText, setTakeawayText] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const relevantMistakes = mistakes.filter((m) => m.questionSlug === questionSlug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mistakeText.trim()) return;

    addMistakeEntry({
      questionSlug,
      questionTitle,
      category,
      mistake: mistakeText.trim(),
      misunderstanding: misunderstandingText.trim(),
      keyTakeaway: takeawayText.trim(),
    });

    setMistakeText("");
    setMisunderstandingText("");
    setTakeawayText("");
    setIsAdding(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    deleteMistakeEntry(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Mistake Journal
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                {questionTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Mistake entry saved to your personal journal.</span>
            </div>
          )}

          {/* Add Entry Form or Button */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              type="button"
              className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 hover:border-orange-500/50 hover:bg-orange-500/5 text-slate-300 hover:text-orange-400 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record a Mistake or Learning Point</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-orange-400 font-semibold">
                  New Journal Entry
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Category Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(CATEGORY_CONFIG) as MistakeCategory[]).map(
                    (cat) => {
                      const cfg = CATEGORY_CONFIG[cat];
                      const selected = category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-2 rounded-lg text-left text-xs border transition ${
                            selected
                              ? `${cfg.bg} ${cfg.border} ${cfg.text} font-semibold ring-1 ring-orange-500/50`
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {cfg.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Mistake description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  What mistake did you make?
                </label>
                <textarea
                  rows={2}
                  required
                  value={mistakeText}
                  onChange={(e) => setMistakeText(e.target.value)}
                  placeholder="e.g. Assumed setTimeout runs before microtasks, or forgot to debounce resize handler..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Misunderstanding */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  What was the underlying misunderstanding? (Optional)
                </label>
                <input
                  type="text"
                  value={misunderstandingText}
                  onChange={(e) => setMisunderstandingText(e.target.value)}
                  placeholder="e.g. Confused Macrotask queue with Promise microtask priority..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Key takeaway */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  What should you remember next time?
                </label>
                <input
                  type="text"
                  required
                  value={takeawayText}
                  onChange={(e) => setTakeawayText(e.target.value)}
                  placeholder="e.g. Always check the microtask queue drain rule after current synchronous execution."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow transition"
                >
                  Save Entry
                </button>
              </div>
            </form>
          )}

          {/* Existing Mistakes */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Recorded Mistakes for this question ({relevantMistakes.length})
            </h3>

            {relevantMistakes.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No mistakes recorded for this question yet. Use this journal when you miss an edge case or get tripped up by a concept.
              </p>
            ) : (
              <div className="space-y-3">
                {relevantMistakes.map((entry) => {
                  const cfg = CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG.other;
                  const dateStr = new Date(entry.createdAt).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" }
                  );

                  return (
                    <div
                      key={entry.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${cfg.bg} ${cfg.border} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {dateStr}
                          </span>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            type="button"
                            title="Delete entry"
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-semibold text-slate-200">Mistake:</span>
                        <p className="text-slate-300 leading-relaxed">
                          {entry.mistake}
                        </p>
                      </div>

                      {entry.misunderstanding && (
                        <div className="space-y-1">
                          <span className="text-slate-400">Misunderstanding:</span>
                          <p className="text-slate-300 leading-relaxed">
                            {entry.misunderstanding}
                          </p>
                        </div>
                      )}

                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-slate-200">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-amber-300">Remember: </span>
                          <span>{entry.keyTakeaway}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center text-xs text-slate-400">
          <span>Entries persist in your browser across sessions.</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
