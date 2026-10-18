"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { MessageSquareText, Check } from "lucide-react";

interface ExplainWorkspaceProps {
  initialDraft: string;
  onSaveDraft: (draft: string) => void;
}

export function ExplainWorkspace({
  initialDraft,
  onSaveDraft,
}: ExplainWorkspaceProps) {
  const [text, setText] = useState(initialDraft);
  const [isSaved, setIsSaved] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setIsSaved(false);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSaveDraft(val);
      setIsSaved(true);
    }, 600);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key inserts 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextValue = text.substring(0, start) + "  " + text.substring(end);
      setText(nextValue);
      setIsSaved(false);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        onSaveDraft(nextValue);
        setIsSaved(true);
      }, 600);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-sky-400">
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>Your Technical Explanation</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            {isSaved ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Saved locally</span>
              </>
            ) : (
              <span className="text-amber-400">Saving...</span>
            )}
          </span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your explanation as if answering an interviewer. State the core concept, describe the runtime/event loop mechanics, identify key trade-offs, and mention common pitfalls..."
        rows={10}
        aria-label="Your technical explanation"
        className="w-full p-4 rounded-xl border border-slate-800 bg-[#090d16] text-sm text-slate-200 placeholder:text-slate-400 leading-relaxed font-sans focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition resize-y min-h-[220px]"
      />
      <p className="text-[11px] text-slate-400 font-mono">
        Tip: Press Tab to indent. Answer autosaves automatically to your browser.
      </p>
    </div>
  );
}
