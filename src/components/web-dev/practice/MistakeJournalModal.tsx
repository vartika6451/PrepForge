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

const CATEGORY_LABELS: Record<MistakeCategory, string> = {
  conceptual: "Conceptual Misunderstanding",
  approach: "Incorrect Approach",
  edge_case: "Missed Edge Case",
  bug: "Implementation Bug",
  explanation: "Incomplete Explanation",
  other: "Other",
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

  const relevantMistakes = mistakes.filter(
    (m) => m.questionSlug === questionSlug
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mistakeText.trim() || !takeawayText.trim()) return;

    addMistakeEntry({
      questionSlug,
      questionTitle,
      category,
      mistake: mistakeText.trim(),
      misunderstanding: misunderstandingText.trim() || undefined,
      keyTakeaway: takeawayText.trim(),
    });

    setMistakeText("");
    setMisunderstandingText("");
    setTakeawayText("");
    setIsAdding(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    deleteMistakeEntry(id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#272624]/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-[#99958E] bg-[#CFCCC6] flex flex-col shadow-xl overflow-hidden text-[#272624]">
        {/* Header */}
        <div className="p-5 border-b border-[#99958E] bg-[#BBB7B0]/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A34823] text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="journal-modal-title" className="text-base font-bold text-[#272624]">
                Mistake Journal
              </h2>
              <p className="text-xs text-[#383431] truncate max-w-sm sm:max-w-md">
                {questionTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-[#383431] hover:text-[#272624] hover:bg-[#BBB7B0] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-[#BBB7B0] border border-[#A34823] text-[#272624] text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-[#A34823]" />
              <span>Mistake entry recorded in your personal journal.</span>
            </div>
          )}

          {/* Add Entry Form or Button */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              type="button"
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[#99958E] hover:border-[#A34823] hover:bg-[#BBB7B0]/50 text-[#272624] text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#A34823]" />
              <span>Record a Mistake or Learning Point</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-[#99958E] bg-[#BBB7B0]/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#A34823] font-semibold">
                  New Journal Entry
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-[#383431] hover:text-[#272624] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Category Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#272624]">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(Object.keys(CATEGORY_LABELS) as MistakeCategory[]).map(
                    (cat) => {
                      const selected = category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-2 rounded-lg text-left text-xs border transition cursor-pointer ${
                            selected
                              ? "bg-[#A34823] border-[#A34823] text-white font-medium shadow-xs"
                              : "bg-[#CFCCC6] border-[#99958E] text-[#272624] hover:bg-[#BBB7B0]"
                          }`}
                        >
                          {CATEGORY_LABELS[cat]}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Mistake description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#272624]">
                  What mistake did you make?
                </label>
                <textarea
                  rows={2}
                  required
                  value={mistakeText}
                  onChange={(e) => setMistakeText(e.target.value)}
                  placeholder="e.g. Assumed setTimeout runs before microtasks, or forgot cleanup on unmount..."
                  className="w-full p-2.5 rounded-lg bg-[#CFCCC6] border border-[#99958E] text-xs text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823] resize-none"
                />
              </div>

              {/* Misunderstanding */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#272624]">
                  What was the underlying misunderstanding? (Optional)
                </label>
                <input
                  type="text"
                  value={misunderstandingText}
                  onChange={(e) => setMisunderstandingText(e.target.value)}
                  placeholder="e.g. Confused Macrotask queue with Promise microtask priority..."
                  className="w-full p-2.5 rounded-lg bg-[#CFCCC6] border border-[#99958E] text-xs text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823]"
                />
              </div>

              {/* Key takeaway */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#272624]">
                  What should you remember next time?
                </label>
                <input
                  type="text"
                  required
                  value={takeawayText}
                  onChange={(e) => setTakeawayText(e.target.value)}
                  placeholder="e.g. Always check the microtask queue drain rule after synchronous execution."
                  className="w-full p-2.5 rounded-lg bg-[#CFCCC6] border border-[#99958E] text-xs text-[#272624] placeholder:text-[#5A5652] focus:outline-none focus:border-[#A34823]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#383431] hover:text-[#272624] cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#A34823] hover:bg-[#8F3D1C] text-white transition cursor-pointer shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          )}

          {/* Existing Mistakes */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#383431] font-semibold">
              Recorded Mistakes for this question ({relevantMistakes.length})
            </h3>

            {relevantMistakes.length === 0 ? (
              <p className="text-xs text-[#383431] italic py-1">
                No mistakes recorded for this question yet. Use this journal when you miss an edge case or get tripped up by a concept.
              </p>
            ) : (
              <div className="space-y-2.5">
                {relevantMistakes.map((entry) => {
                  const dateStr = new Date(entry.createdAt).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" }
                  );

                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl border border-[#99958E] bg-[#CFCCC6] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#99958E] bg-[#BBB7B0] text-[#272624] font-semibold">
                          {CATEGORY_LABELS[entry.category] || entry.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#383431] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#99958E]" />
                            {dateStr}
                          </span>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            type="button"
                            title="Delete entry"
                            className="text-[#383431] hover:text-[#A34823] transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#272624]">Mistake:</span>
                        <p className="text-[#272624] leading-relaxed">
                          {entry.mistake}
                        </p>
                      </div>

                      {entry.misunderstanding && (
                        <div className="space-y-0.5">
                          <span className="text-[#383431]">Misunderstanding:</span>
                          <p className="text-[#383431] leading-relaxed">
                            {entry.misunderstanding}
                          </p>
                        </div>
                      )}

                      <div className="p-2.5 rounded-lg bg-[#BBB7B0]/60 border border-[#99958E] flex items-start gap-2 text-[#272624]">
                        <Lightbulb className="w-3.5 h-3.5 text-[#A34823] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#A34823]">Remember: </span>
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
        <div className="px-5 py-3 border-t border-[#99958E] bg-[#BBB7B0]/50 flex justify-between items-center text-xs text-[#383431]">
          <span>Entries persist in your browser across sessions.</span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#A34823] hover:bg-[#8F3D1C] text-white transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
