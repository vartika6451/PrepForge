"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { MessageSquareText } from "lucide-react";

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
    <div className="space-y-2.5">
      {/* Workspace Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#383431]">
        <div className="flex items-center gap-2 text-[#272624] font-semibold">
          <MessageSquareText className="w-3.5 h-3.5 text-[#A34823]" />
          <span>Technical Explanation</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isSaved ? "bg-[#A34823]" : "bg-[#99958E] animate-pulse"
              }`}
            />
            <span className="text-[#383431]">{isSaved ? "Saved" : "Saving..."}</span>
          </span>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="rounded-xl border border-[#99958E] bg-[#2D2C2A] overflow-hidden focus-within:border-[#A34823] transition-colors shadow-xs">
        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="State the core concept, describe runtime mechanics, step through execution order, and highlight important trade-offs or edge cases..."
          rows={11}
          aria-label="Your technical explanation"
          className="w-full p-5 bg-transparent text-[#EDEAE4] placeholder:text-[#99958E] leading-relaxed font-sans text-[15px] focus:outline-none resize-y min-h-[260px]"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#383431]">
        <span>Press Tab to indent 2 spaces.</span>
        <span>Autosaves to local storage</span>
      </div>
    </div>
  );
}
