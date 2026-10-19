"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Bug, Wrench } from "lucide-react";

interface DebugWorkspaceProps {
  initialRootCause: string;
  initialFix: string;
  onSaveDraft: (drafts: { rootCauseDraft: string; fixDraft: string }) => void;
}

export function DebugWorkspace({
  initialRootCause,
  initialFix,
  onSaveDraft,
}: DebugWorkspaceProps) {
  const [rootCause, setRootCause] = useState(initialRootCause);
  const [fix, setFix] = useState(initialFix);
  const [isSaved, setIsSaved] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSave = (newRootCause: string, newFix: string) => {
    setIsSaved(false);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSaveDraft({ rootCauseDraft: newRootCause, fixDraft: newFix });
      setIsSaved(true);
    }, 600);
  };

  const handleTabIndent = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    currentText: string,
    setter: (val: string) => void,
    isRootCauseField: boolean
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextValue = currentText.substring(0, start) + "  " + currentText.substring(end);
      setter(nextValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);

      if (isRootCauseField) {
        scheduleSave(nextValue, fix);
      } else {
        scheduleSave(rootCause, nextValue);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Workspace Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#383431]">
        <span className="font-semibold text-[#272624]">
          Diagnostic Workspace
        </span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isSaved ? "bg-[#A34823]" : "bg-[#99958E] animate-pulse"
            }`}
          />
          <span className="text-[#383431]">{isSaved ? "Saved" : "Saving..."}</span>
        </span>
      </div>

      {/* Section 1: Root Cause Analysis */}
      <div className="space-y-1.5">
        <label
          htmlFor="debug-root-cause"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#272624]"
        >
          <Bug className="w-3.5 h-3.5 text-[#A34823]" />
          <span>1. Root Cause Diagnosis</span>
        </label>
        <div className="rounded-xl border border-[#99958E] bg-[#2D2C2A] overflow-hidden focus-within:border-[#A34823] transition-colors shadow-xs">
          <textarea
            id="debug-root-cause"
            value={rootCause}
            onChange={(e) => {
              setRootCause(e.target.value);
              scheduleSave(e.target.value, fix);
            }}
            onKeyDown={(e) => handleTabIndent(e, rootCause, setRootCause, true)}
            placeholder="Explain the underlying cause of the bug. Why does this failure occur under specific runtime or state conditions? What invariant was broken?"
            rows={4}
            className="w-full p-4 bg-transparent text-[#EDEAE4] placeholder:text-[#99958E] leading-relaxed font-sans text-sm focus:outline-none resize-y min-h-[100px]"
          />
        </div>
      </div>

      {/* Section 2: Proposed Fix / Corrected Code */}
      <div className="space-y-1.5">
        <label
          htmlFor="debug-proposed-fix"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#272624]"
        >
          <Wrench className="w-3.5 h-3.5 text-[#A34823]" />
          <span>2. Corrective Fix &amp; Verification</span>
        </label>
        <div className="rounded-xl border border-[#99958E] bg-[#2D2C2A] overflow-hidden focus-within:border-[#A34823] transition-colors shadow-xs">
          <textarea
            id="debug-proposed-fix"
            value={fix}
            onChange={(e) => {
              setFix(e.target.value);
              scheduleSave(rootCause, e.target.value);
            }}
            onKeyDown={(e) => handleTabIndent(e, fix, setFix, false)}
            placeholder="Provide the corrected code, and outline the verification steps (unit test case, edge cases, reproduction checks)..."
            rows={6}
            className="w-full p-4 bg-transparent text-[#EDEAE4] placeholder:text-[#99958E] leading-relaxed font-mono text-xs sm:text-sm focus:outline-none resize-y min-h-[140px]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#383431]">
        <span>Press Tab to indent 2 spaces.</span>
        <span>Autosaves to local storage</span>
      </div>
    </div>
  );
}
