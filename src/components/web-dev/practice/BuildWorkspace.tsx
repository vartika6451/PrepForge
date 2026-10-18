"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Code2, Check, RotateCcw, Copy } from "lucide-react";

interface BuildWorkspaceProps {
  starterCode?: string;
  initialDraft: string;
  programmingLanguage?: string;
  onSaveDraft: (code: string) => void;
}

export function BuildWorkspace({
  starterCode,
  initialDraft,
  programmingLanguage = "typescript",
  onSaveDraft,
}: BuildWorkspaceProps) {
  const initialValue = initialDraft.trim().length > 0 ? initialDraft : starterCode || "";
  const [code, setCode] = useState(initialValue);
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);
    setIsSaved(false);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSaveDraft(val);
      setIsSaved(true);
    }, 600);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 2-space tab indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextValue = code.substring(0, start) + "  " + code.substring(end);
      setCode(nextValue);
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

  const handleReset = () => {
    if (starterCode) {
      const confirmed = window.confirm("Reset code back to the original starter template? Your current edits will be replaced.");
      if (!confirmed) return;
      setCode(starterCode);
      onSaveDraft(starterCode);
      setIsSaved(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-orange-400">
          <Code2 className="w-3.5 h-3.5" />
          <span>Implementation Editor</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {programmingLanguage}
          </span>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            onClick={handleCopy}
            type="button"
            className="hover:text-white transition flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          {starterCode && (
            <button
              onClick={handleReset}
              type="button"
              className="hover:text-rose-400 transition flex items-center gap-1"
              title="Reset to starter template"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="relative rounded-xl border border-slate-800 bg-[#070a12] overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition">
        <textarea
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={14}
          spellCheck={false}
          aria-label="Code implementation editor"
          className="w-full p-4 bg-transparent text-sm font-mono text-slate-100 placeholder:text-slate-400 leading-relaxed focus:outline-none resize-y min-h-[280px]"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Press Tab to indent 2 spaces.</span>
        <span className="text-slate-400">Self-assessment workspace • Code is evaluated via reference comparison</span>
      </div>
    </div>
  );
}
