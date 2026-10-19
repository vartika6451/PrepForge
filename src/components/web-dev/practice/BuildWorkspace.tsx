"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { FileCode, Check, RotateCcw, Copy } from "lucide-react";

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
      const confirmed = window.confirm("Reset code back to the original starter template?");
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

  const getFilename = () => {
    if (programmingLanguage === "tsx" || programmingLanguage === "react") return "Component.tsx";
    if (programmingLanguage === "css") return "styles.css";
    if (programmingLanguage === "javascript") return "solution.js";
    return "solution.ts";
  };

  const codeLines = code.split("\n");

  return (
    <div className="space-y-2">
      {/* Code Editor Surface */}
      <div className="rounded-xl border border-[#333333] bg-[#1E1E1E] overflow-hidden focus-within:border-[#007ACC] transition-colors shadow-md">
        {/* Editor Top Bar (VS Code style) */}
        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-[#333333] bg-[#252526] text-xs font-mono text-[#CCCCCC]">
          {/* File Tab */}
          <div className="flex items-center gap-2 bg-[#1E1E1E] text-[#EDEAE4] px-3 py-1 rounded-t border-t-2 border-[#007ACC] -mb-1.5 z-10">
            <FileCode className="w-3.5 h-3.5 text-[#3178C6]" />
            <span className="font-medium text-xs text-[#CCCCCC]">{getFilename()}</span>
          </div>

          {/* Editor Actions & Status */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#858585] hidden sm:inline">
              {codeLines.length} {codeLines.length === 1 ? "line" : "lines"}
            </span>

            <span className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isSaved ? "bg-[#4EC9B0]" : "bg-[#858585] animate-pulse"
                }`}
              />
              <span className="text-[#858585]">{isSaved ? "Saved" : "Saving..."}</span>
            </span>

            <button
              onClick={handleCopy}
              type="button"
              className="hover:text-white text-[#858585] transition flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {starterCode && (
              <button
                onClick={handleReset}
                type="button"
                className="hover:text-white text-[#858585] transition flex items-center gap-1 cursor-pointer"
                title="Reset to starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Textarea Code Body with Gutter */}
        <div className="flex bg-[#1E1E1E] text-xs sm:text-sm font-mono overflow-hidden min-h-[340px]">
          {/* Line Numbers Gutter */}
          <div
            className="select-none py-4 pl-3 pr-3 text-right border-r border-[#333333] text-[#6E7681] bg-[#1E1E1E] shrink-0 font-mono text-xs"
            style={{ minWidth: codeLines.length >= 100 ? "3.5rem" : "2.75rem" }}
            aria-hidden="true"
          >
            {codeLines.map((_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={16}
            spellCheck={false}
            aria-label="Code implementation editor"
            className="flex-1 p-4 bg-transparent text-xs sm:text-sm font-mono text-[#EDEAE4] placeholder:text-[#6E7681] leading-relaxed focus:outline-none resize-y"
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
