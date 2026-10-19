"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { WebDevQuestion } from "@/types/web-dev";
import { VSCodeCodeBlock } from "./VSCodeCodeBlock";

interface PracticeUnderstandStageProps {
  question: WebDevQuestion;
  onProceedToAttempt: () => void;
}

export function PracticeUnderstandStage({
  question,
  onProceedToAttempt,
}: PracticeUnderstandStageProps) {

  const getLanguageLabel = () => {
    if (question.programmingLanguage) return question.programmingLanguage;
    if (question.topic.includes("css")) return "css";
    if (question.topic.includes("react")) return "tsx";
    if (question.topic.includes("node") || question.topic.includes("javascript")) return "javascript";
    return "typescript";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Problem Scenario & Context */}
      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-[#272624] tracking-tight">
          Scenario &amp; Context
        </h2>
        <div className="text-[15px] sm:text-base text-[#272624] leading-relaxed whitespace-pre-line font-normal">
          {question.scenario}
        </div>
      </section>

      {/* 2. Key Task Requirements */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-lg font-semibold text-[#272624] tracking-tight">
          Key Requirements
        </h2>
        <ul className="space-y-2.5">
          {question.requirements.map((req, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-[15px] text-[#383431] leading-relaxed"
            >
              <span className="font-mono text-xs font-bold text-[#A34823] pt-0.5 select-none w-5">
                {String(idx + 1).padStart(2, "0")}.
              </span>
              <span className="flex-1">{req}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Problem Code Snippet / Starter Template */}
      {question.starterCode && (
        <section className="space-y-2 pt-2">
          <VSCodeCodeBlock
            code={question.starterCode}
            language={getLanguageLabel()}
            filename={
              question.mode === "build"
                ? `starter.${getLanguageLabel() === "javascript" ? "js" : getLanguageLabel() === "css" ? "css" : getLanguageLabel() === "html" ? "html" : "ts"}`
                : `problem.${getLanguageLabel() === "javascript" ? "js" : getLanguageLabel() === "css" ? "css" : getLanguageLabel() === "html" ? "html" : "ts"}`
            }
          />
        </section>
      )}

      {/* 4. Skills Assessed & Reference Documentation */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-t border-[#99958E]/40">
        {/* Skills */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#383431] block">
            Skills Evaluated
          </span>
          <div className="flex flex-wrap gap-1.5">
            {question.skillsTested.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-xs font-medium text-[#272624] bg-[#BBB7B0]/60 border border-[#99958E]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* References */}
        {question.references && question.references.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#383431] block">
              Official Documentation
            </span>
            <ul className="space-y-1">
              {question.references.map((ref, idx) => (
                <li key={idx}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#A34823] hover:underline font-medium"
                  >
                    <span>{ref.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5. Clear Bottom Action */}
      <div className="pt-6 border-t border-[#99958E]/60 flex items-center justify-between">
        <span className="text-xs text-[#383431]">
          Understood the problem? Formulate your solution in Stage 2.
        </span>

        <button
          onClick={onProceedToAttempt}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A34823] hover:bg-[#8F3D1C] text-white font-medium text-xs sm:text-sm shadow-xs transition cursor-pointer"
        >
          <span>
            {question.mode === "build"
              ? "Start Building"
              : question.mode === "debug"
              ? "Start Debugging"
              : "Start Answering"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
