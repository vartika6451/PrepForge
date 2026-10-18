"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Bug, Wrench, Check } from "lucide-react";

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
      {/* Save indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="text-amber-400 font-semibold uppercase tracking-wider">
          Diagnostic Workspace
        </span>
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

      {/* Section 1: Root Cause Analysis */}
      <div className="space-y-1.5">
        <label htmlFor="debug-root-cause" className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
          <Bug className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Root Cause Diagnosis</span>
        </label>
        <textarea
          id="debug-root-cause"
          value={rootCause}
          onChange={(e) => {
            setRootCause(e.target.value);
            scheduleSave(e.target.value, fix);
          }}
          onKeyDown={(e) => handleTabIndent(e, rootCause, setRootCause, true)}
          placeholder="Explain the underlying cause of the bug. Why does this failure occur under specific runtime or network conditions? What invariant was broken?"
          rows={4}
          className="w-full p-3.5 rounded-xl border border-slate-800 bg-[#090d16] text-sm text-slate-200 placeholder:text-slate-400 leading-relaxed font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-y min-h-[100px]"
        />
      </div>

      {/* Section 2: Proposed Fix / Corrected Code */}
      <div className="space-y-1.5">
        <label htmlFor="debug-proposed-fix" className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Proposed Fix & Verification</span>
        </label>
        <textarea
          id="debug-proposed-fix"
          value={fix}
          onChange={(e) => {
            setFix(e.target.value);
            scheduleSave(rootCause, e.target.value);
          }}
          onKeyDown={(e) => handleTabIndent(e, fix, setFix, false)}
          placeholder="Provide the corrected code or configuration fix, and explain how to verify it (e.g. unit test, load test, or reproduction steps)..."
          rows={6}
          className="w-full p-3.5 rounded-xl border border-slate-800 bg-[#090d16] text-sm text-slate-200 placeholder:text-slate-400 leading-relaxed font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-y min-h-[140px]"
        />
      </div>

      <p className="text-[11px] text-slate-400 font-mono">
        Tip: Press Tab to indent code snippets. Drafts autosave continuously.
      </p>
    </div>
  );
}
