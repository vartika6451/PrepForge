"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, Calculator } from "lucide-react";

interface FormattedMarkdownContentProps {
  content?: string | null;
  className?: string;
  defaultLanguage?: string;
}

import { VSCodeCodeBlock } from "./VSCodeCodeBlock";

// Clean math formulas: replaces LaTeX syntax \text{}, \times, etc.
function cleanFormula(raw: string): string {
  return raw
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\times/g, "×")
    .replace(/\\log/g, "log")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\\\/g, "\\")
    .trim();
}

// Inline renderer: transforms `code`, **bold**, *italic*, math, and [link](url)
function renderInlineText(rawText: string): React.ReactNode {
  // First clean stray ### or ''' or math expressions in text
  let text = rawText
    .replace(/#{2,}/g, "")
    .replace(/'''/g, "")
    .replace(/```/g, "");

  // Format inline math: $formula$
  text = text.replace(/\$([^$]+)\$/g, (_, f) => cleanFormula(f));

  // Pattern matching `inline code`, **bold**, *italic*, and [markdown](link)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={idx}
          className="font-mono text-[11px] sm:text-xs px-1.5 py-0.5 rounded bg-[#2D2C2A] text-[#EDEAE4] border border-[#99958E]/40 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-[#272624]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={idx} className="italic text-[#383431]">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return (
          <a
            key={idx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A34823] hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {match[1]}
          </a>
        );
      }
    }

    return part;
  });
}

type ParsedBlock =
  | { type: "code"; language: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "math"; formula: string }
  | { type: "ordered-list"; items: Array<{ num: string; text: string }> }
  | { type: "unordered-list"; items: Array<{ text: string; isNested: boolean }> }
  | { type: "paragraph"; text: string };

function parseMarkdown(rawContent: string, defaultLanguage: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  if (!rawContent) return blocks;

  // Split content by code fences: handles both ``` and ''' (triple backticks or triple quotes)
  const fenceRegex = /(?:```|''')([a-zA-Z0-9_-]*)[ \t]*\r?\n?([\s\S]*?)(?:```|'''|$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(rawContent)) !== null) {
    if (match.index === rawContent.length) break;

    const textBefore = rawContent.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      parseTextBlocks(textBefore, blocks);
    }

    const lang = match[1]?.trim() || defaultLanguage;
    const code = match[2]?.replace(/\r?\n$/, "");
    if (code && code.trim()) {
      blocks.push({
        type: "code",
        language: lang,
        code,
      });
    }

    lastIndex = fenceRegex.lastIndex;
    if (match.index === fenceRegex.lastIndex) {
      fenceRegex.lastIndex++;
    }
  }

  const remainingText = rawContent.substring(lastIndex);
  if (remainingText.trim()) {
    parseTextBlocks(remainingText, blocks);
  }

  return blocks;
}

function parseTextBlocks(textChunk: string, blocks: ParsedBlock[]) {
  const lines = textChunk.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Strip standalone ``` or ''' fences if they remain on a line
    if (trimmed === "```" || trimmed === "'''" || /^(?:```|''')\w*$/.test(trimmed)) {
      i++;
      continue;
    }

    // Math block: $$ ... $$
    const mathMatch = trimmed.match(/^\$\$(.+)\$\$$/);
    if (mathMatch) {
      blocks.push({
        type: "math",
        formula: cleanFormula(mathMatch[1]),
      });
      i++;
      continue;
    }

    // Check for Headings: #, ##, ###, ####
    const headingMatch = trimmed.match(/^(#{1,6})\s*(.+)$/);
    if (headingMatch) {
      const headingText = headingMatch[2].replace(/#+$/, "").trim();
      if (headingText) {
        blocks.push({
          type: "heading",
          level: headingMatch[1].length,
          text: headingText,
        });
      }
      i++;
      continue;
    }

    // Check for Ordered list (e.g., 1. Item or 1) Item)
    const orderedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)$/);
    if (orderedMatch) {
      const items: Array<{ num: string; text: string }> = [];
      while (i < lines.length) {
        const currentLine = lines[i];
        const itemMatch = currentLine.trim().match(/^(\d+)[\.\)]\s+(.+)$/);
        if (itemMatch) {
          items.push({ num: itemMatch[1], text: itemMatch[2] });
          i++;
        } else if (
          items.length > 0 &&
          (currentLine.startsWith("   ") || currentLine.startsWith("\t")) &&
          currentLine.trim()
        ) {
          // Sub-item continuation
          items[items.length - 1].text += "\n" + currentLine.trim();
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    // Check for Unordered list (e.g., - Item or * Item)
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      const items: Array<{ text: string; isNested: boolean }> = [];
      while (i < lines.length) {
        const currentLine = lines[i];
        const subMatch = currentLine.match(/^(\s*)([-*])\s+(.+)$/);
        if (subMatch) {
          const isNested = (subMatch[1] || "").length >= 2;
          items.push({ text: subMatch[3], isNested });
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    // Regular paragraph: collect consecutive non-empty lines that aren't headings or list starters
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const currentTrimmed = lines[i].trim();
      if (!currentTrimmed) break;
      if (
        currentTrimmed.startsWith("#") ||
        currentTrimmed.startsWith("$$") ||
        currentTrimmed === "```" ||
        currentTrimmed === "'''" ||
        /^\d+[\.\)]\s+/.test(currentTrimmed) ||
        /^[-*]\s+/.test(currentTrimmed)
      ) {
        break;
      }
      paragraphLines.push(currentTrimmed);
      i++;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paragraphLines.join(" "),
      });
    }
  }
}

export function FormattedMarkdownContent({
  content,
  className = "",
  defaultLanguage = "typescript",
}: FormattedMarkdownContentProps) {
  if (!content) return null;

  // Fallback: If content has NO markdown formatting, no fences, and looks like raw pure code
  const isPureCode =
    !content.includes("###") &&
    !content.includes("##") &&
    !content.includes("```") &&
    !content.includes("'''") &&
    (content.includes("function") ||
      content.includes("const ") ||
      content.includes("class ") ||
      content.includes("export ") ||
      content.includes("import ") ||
      content.includes("return ") ||
      content.includes("=>"));

  if (isPureCode) {
    return <VSCodeCodeBlock code={content} language={defaultLanguage} />;
  }

  const blocks = parseMarkdown(content, defaultLanguage);

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <VSCodeCodeBlock
              key={idx}
              code={block.code}
              language={block.language}
            />
          );
        }

        if (block.type === "heading") {
          return (
            <div key={idx} className="pt-2 first:pt-0">
              <h4 className="text-xs sm:text-sm font-bold text-[#A34823] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#99958E]/40 mb-2">
                <span>{block.text}</span>
              </h4>
            </div>
          );
        }

        if (block.type === "math") {
          return (
            <div
              key={idx}
              className="my-2.5 p-3 rounded-xl bg-[#BBB7B0]/60 border border-[#99958E] flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#272624]"
            >
              <Calculator className="w-4 h-4 text-[#A34823] shrink-0" />
              <span className="font-semibold">{block.formula}</span>
            </div>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={idx} className="space-y-2.5 my-2">
              {block.items.map((item, itemIdx) => {
                const subLines = item.text.split("\n");
                const mainLine = subLines[0];
                const restLines = subLines.slice(1);

                return (
                  <li key={itemIdx} className="space-y-1">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#272624] leading-relaxed">
                      <span className="font-mono text-xs font-bold text-[#A34823] pt-0.5 select-none w-5 shrink-0">
                        {item.num}.
                      </span>
                      <div className="flex-1 min-w-0">
                        {renderInlineText(mainLine)}
                      </div>
                    </div>

                    {restLines.length > 0 && (
                      <ul className="pl-7 space-y-1 text-xs text-[#383431] leading-relaxed">
                        {restLines.map((sub, sIdx) => {
                          const cleanSub = sub.replace(/^[-*]\s+/, "");
                          return (
                            <li key={sIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] shrink-0 mt-1.5" />
                              <div className="flex-1">
                                {renderInlineText(cleanSub)}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          );
        }

        if (block.type === "unordered-list") {
          return (
            <ul key={idx} className="space-y-1.5 my-2">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className={`flex items-start gap-2.5 text-xs sm:text-sm text-[#272624] leading-relaxed ${
                    item.isNested ? "pl-5 text-xs text-[#383431]" : ""
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A34823] shrink-0 mt-2" />
                  <div className="flex-1 min-w-0">
                    {renderInlineText(item.text)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={idx}
              className="text-xs sm:text-sm text-[#272624] leading-relaxed font-normal"
            >
              {renderInlineText(block.text)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
