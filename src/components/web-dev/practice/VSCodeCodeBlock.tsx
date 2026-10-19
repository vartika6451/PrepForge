"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface VSCodeCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

interface Token {
  text: string;
  color: string;
  bold?: boolean;
}

// Exact VS Code Dark+ Theme Palette
const THEME = {
  bg: "#1E1E1E",
  gutterBg: "#1E1E1E",
  gutterText: "#6E7681",
  gutterBorder: "#333333",
  headerBg: "#252526",
  headerBorder: "#333333",
  defaultText: "#D4D4D4",
  
  // Syntax tokens
  controlKeyword: "#C586C0",    // purple (return, if, else, import, export, from)
  storageKeyword: "#569CD6",    // blue (const, let, function, class, type, interface)
  type: "#4EC9B0",              // teal (Promise, Parameters, string, number, boolean)
  constant: "#569CD6",          // blue (true, false, null, undefined)
  functionName: "#DCDCAA",      // yellow (debounce, setTimeout, log)
  property: "#9CDCFE",          // light blue (timerId, delayMs, immediate, state)
  string: "#CE9178",            // warm terracotta ('...', "...", `...`)
  number: "#B5CEA8",            // light green (300, 1000, 0, 0.4)
  comment: "#6A9955",           // olive green (// ..., /* ... */)
  tag: "#569CD6",               // blue (<div, </div, <button)
  componentTag: "#4EC9B0",      // teal (<Modal, <CartSummary)
  attribute: "#9CDCFE",         // light blue (className, onClick, type)
  cssSelector: "#D7BA7D",       // amber (.container, #id)
  operator: "#D4D4D4",          // punctuation and operators
};

// Language configuration
const CONTROL_KEYWORDS = new Set([
  "return", "if", "else", "switch", "case", "default", "break", "continue",
  "for", "while", "do", "try", "catch", "finally", "throw", "import", "export",
  "from", "yield", "with"
]);

const STORAGE_KEYWORDS = new Set([
  "const", "let", "var", "function", "class", "interface", "type", "enum",
  "extends", "implements", "new", "typeof", "instanceof", "as", "in", "of",
  "await", "async", "void", "public", "private", "protected", "readonly",
  "static", "get", "set", "override", "declare", "abstract", "keyof"
]);

const CONSTANT_KEYWORDS = new Set([
  "true", "false", "null", "undefined", "NaN", "Infinity"
]);

const PRIMITIVE_TYPES = new Set([
  "string", "number", "boolean", "any", "unknown", "never", "symbol", "bigint", "void", "object"
]);

const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON",
  "GROUP", "BY", "ORDER", "DESC", "ASC", "LIMIT", "OFFSET", "CREATE", "INDEX",
  "TABLE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "AND", "OR",
  "NOT", "IN", "EXISTS", "FILTER", "COALESCE", "COUNT", "SUM", "AVG", "MAX", "MIN",
  "HAVING", "UNION", "ALL", "AS", "DISTINCT", "CASE", "WHEN", "THEN", "END", "NULL"
]);

function getLanguageMeta(lang: string) {
  const normalized = (lang || "").toLowerCase().trim();
  switch (normalized) {
    case "tsx":
    case "react":
      return { badge: "TSX", color: "bg-[#3178C6] text-white", name: "Component.tsx", lang: "typescript" };
    case "typescript":
    case "ts":
      return { badge: "TS", color: "bg-[#3178C6] text-white", name: "solution.ts", lang: "typescript" };
    case "javascript":
    case "js":
      return { badge: "JS", color: "bg-[#F7DF1E] text-black", name: "solution.js", lang: "javascript" };
    case "jsx":
      return { badge: "JSX", color: "bg-[#61DAFB] text-black", name: "Component.jsx", lang: "javascript" };
    case "html":
      return { badge: "HTML", color: "bg-[#E44D26] text-white", name: "index.html", lang: "html" };
    case "css":
      return { badge: "CSS", color: "bg-[#264DE4] text-white", name: "styles.css", lang: "css" };
    case "sql":
    case "postgresql":
    case "postgres":
      return { badge: "SQL", color: "bg-[#336791] text-white", name: "query.sql", lang: "sql" };
    case "bash":
    case "sh":
    case "shell":
      return { badge: "SH", color: "bg-[#4EAA25] text-white", name: "terminal.sh", lang: "bash" };
    case "json":
      return { badge: "JSON", color: "bg-[#292929] text-[#E0E0E0]", name: "data.json", lang: "json" };
    default:
      return { badge: (lang || "CODE").toUpperCase().slice(0, 4), color: "bg-[#383431] text-[#EDEAE4]", name: "code.txt", lang: "typescript" };
  }
}

// Line Tokenizer
function tokenizeLine(
  line: string,
  lang: string,
  state: { inBlockComment: boolean; inTemplateString: boolean }
): { tokens: Token[]; nextState: { inBlockComment: boolean; inTemplateString: boolean } } {
  const tokens: Token[] = [];
  let pos = 0;
  const len = line.length;

  let inBlockComment = state.inBlockComment;
  let inTemplateString = state.inTemplateString;

  while (pos < len) {
    // 1. Ongoing multi-line comment /* ... */
    if (inBlockComment) {
      const endComment = line.indexOf("*/", pos);
      if (endComment !== -1) {
        tokens.push({ text: line.substring(pos, endComment + 2), color: THEME.comment });
        pos = endComment + 2;
        inBlockComment = false;
        continue;
      } else {
        tokens.push({ text: line.substring(pos), color: THEME.comment });
        pos = len;
        break;
      }
    }

    // 2. Ongoing template literal ` ... `
    if (inTemplateString) {
      const endTick = line.indexOf("`", pos);
      if (endTick !== -1) {
        tokens.push({ text: line.substring(pos, endTick + 1), color: THEME.string });
        pos = endTick + 1;
        inTemplateString = false;
        continue;
      } else {
        tokens.push({ text: line.substring(pos), color: THEME.string });
        pos = len;
        break;
      }
    }

    // 3. Single-line comment // or -- (SQL)
    if (line.startsWith("//", pos) || (lang === "sql" && line.startsWith("--", pos))) {
      tokens.push({ text: line.substring(pos), color: THEME.comment });
      pos = len;
      break;
    }

    // 4. Block comment start /*
    if (line.startsWith("/*", pos)) {
      const endComment = line.indexOf("*/", pos + 2);
      if (endComment !== -1) {
        tokens.push({ text: line.substring(pos, endComment + 2), color: THEME.comment });
        pos = endComment + 2;
        continue;
      } else {
        tokens.push({ text: line.substring(pos), color: THEME.comment });
        pos = len;
        inBlockComment = true;
        break;
      }
    }

    // HTML comment <!-- ... -->
    if (line.startsWith("<!--", pos)) {
      const endComment = line.indexOf("-->", pos + 4);
      if (endComment !== -1) {
        tokens.push({ text: line.substring(pos, endComment + 3), color: THEME.comment });
        pos = endComment + 3;
        continue;
      } else {
        tokens.push({ text: line.substring(pos), color: THEME.comment });
        pos = len;
        inBlockComment = true;
        break;
      }
    }

    // 5. String Literals: single quotes '...' or double quotes "..."
    const char = line[pos];
    if (char === '"' || char === "'") {
      const quote = char;
      let endQuote = pos + 1;
      while (endQuote < len) {
        if (line[endQuote] === "\\" && endQuote + 1 < len) {
          endQuote += 2;
        } else if (line[endQuote] === quote) {
          endQuote++;
          break;
        } else {
          endQuote++;
        }
      }
      tokens.push({ text: line.substring(pos, endQuote), color: THEME.string });
      pos = endQuote;
      continue;
    }

    // 6. Template string start `...`
    if (char === "`") {
      let endTick = pos + 1;
      let closed = false;
      while (endTick < len) {
        if (line[endTick] === "\\" && endTick + 1 < len) {
          endTick += 2;
        } else if (line[endTick] === "`") {
          endTick++;
          closed = true;
          break;
        } else {
          endTick++;
        }
      }
      tokens.push({ text: line.substring(pos, endTick), color: THEME.string });
      pos = endTick;
      if (!closed) {
        inTemplateString = true;
      }
      continue;
    }

    // 7. HTML / JSX Tags: <tag, </tag, <Component
    if (char === "<") {
      const tagMatch = line.substring(pos).match(/^<\/?[a-zA-Z][a-zA-Z0-9_-]*/);
      if (tagMatch) {
        const fullMatch = tagMatch[0];
        const isClosing = fullMatch.startsWith("</");
        const tagName = isClosing ? fullMatch.substring(2) : fullMatch.substring(1);
        const isComponent = /^[A-Z]/.test(tagName);

        tokens.push({ text: isClosing ? "</" : "<", color: "#808080" });
        tokens.push({ text: tagName, color: isComponent ? THEME.componentTag : THEME.tag });
        pos += fullMatch.length;
        continue;
      }
    }

    // 8. Numbers (Hex, Floats, Integers)
    const numMatch = line.substring(pos).match(/^(0x[0-9a-fA-F]+|0b[01]+|\d+(\.\d+)?([eE][+-]?\d+)?)\b/);
    if (numMatch && (pos === 0 || !/[a-zA-Z0-9_$]/.test(line[pos - 1]))) {
      tokens.push({ text: numMatch[0], color: THEME.number });
      pos += numMatch[0].length;
      continue;
    }

    // 9. Identifiers & Keywords
    const wordMatch = line.substring(pos).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      const restAfterWord = line.substring(pos + word.length);

      // Check if keyword
      if (CONTROL_KEYWORDS.has(word)) {
        tokens.push({ text: word, color: THEME.controlKeyword });
      } else if (STORAGE_KEYWORDS.has(word)) {
        tokens.push({ text: word, color: THEME.storageKeyword });
      } else if (CONSTANT_KEYWORDS.has(word)) {
        tokens.push({ text: word, color: THEME.constant });
      } else if (PRIMITIVE_TYPES.has(word)) {
        tokens.push({ text: word, color: THEME.type });
      } else if (SQL_KEYWORDS.has(word.toUpperCase())) {
        tokens.push({ text: word, color: THEME.storageKeyword });
      } else {
        // Peek if it is a function call: e.g. fn(...) or fn<T>(...)
        const isFunctionCall = /^\s*(\([^\)]*|\<[^\>]*\>\s*\()/.test(restAfterWord);
        // Peek if it is preceded by function keyword: "function name"
        const isPrecededByFunction = tokens.length > 0 && tokens[tokens.length - 1].text.trim() === "function";

        if (isFunctionCall || isPrecededByFunction) {
          tokens.push({ text: word, color: THEME.functionName });
        } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(word)) {
          // Types, Classes, Interfaces start with uppercase
          tokens.push({ text: word, color: THEME.type });
        } else {
          // Variables, properties, arguments
          tokens.push({ text: word, color: THEME.property });
        }
      }

      pos += word.length;
      continue;
    }

    // 10. Multi-character operators
    const opMatch = line.substring(pos).match(/^(=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?|\+=|-=|\*=|\/=|\.\.\.)/);
    if (opMatch) {
      tokens.push({ text: opMatch[0], color: THEME.operator });
      pos += opMatch[0].length;
      continue;
    }

    // 11. Single characters (whitespace, punctuation, brackets)
    tokens.push({ text: char, color: THEME.defaultText });
    pos++;
  }

  return {
    tokens,
    nextState: { inBlockComment, inTemplateString },
  };
}

export function VSCodeCodeBlock({
  code,
  language = "typescript",
  filename,
  className = "",
  showLineNumbers = true,
  maxHeight = "500px",
}: VSCodeCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const meta = getLanguageMeta(language);
  const displayFilename = filename || meta.name;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  // Split lines and tokenize
  const lines = (code || "").replace(/\r\n/g, "\n").split("\n");
  let tokenizerState = { inBlockComment: false, inTemplateString: false };

  const tokenizedLines = lines.map((line) => {
    const result = tokenizeLine(line, meta.lang, tokenizerState);
    tokenizerState = result.nextState;
    return result.tokens;
  });

  return (
    <div
      className={`my-3 rounded-xl border border-[#333333] overflow-hidden shadow-md font-mono ${className}`}
      style={{ backgroundColor: THEME.bg }}
    >
      {/* 1. VS Code Tab Header */}
      <div
        className="flex items-center justify-between px-3.5 py-1.5 border-b select-none text-xs"
        style={{
          backgroundColor: THEME.headerBg,
          borderColor: THEME.headerBorder,
        }}
      >
        {/* Active Tab */}
        <div className="flex items-center gap-2 px-3 py-1 -mb-1.5 rounded-t border-t-2 border-[#007ACC] bg-[#1E1E1E] text-[#EDEAE4]">
          <span
            className={`px-1 py-0.2 rounded text-[10px] font-bold tracking-wider ${meta.color}`}
          >
            {meta.badge}
          </span>
          <span className="text-xs font-medium text-[#CCCCCC]">{displayFilename}</span>
        </div>

        {/* Header Right: Line Count & Copy Button */}
        <div className="flex items-center gap-3 text-xs text-[#858585]">
          <span className="text-[11px] font-mono hidden sm:inline">
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>

          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy code to clipboard"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[#CCCCCC] hover:text-white hover:bg-[#383431] transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#4EC9B0]" />
                <span className="text-[#4EC9B0] font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#858585]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Code Body with Line Numbers Gutter */}
      <div
        className="overflow-x-auto text-xs sm:text-[13px] leading-[1.65]"
        style={{ maxHeight }}
      >
        <div className="flex min-w-full">
          {/* Line Numbers Gutter */}
          {showLineNumbers && (
            <div
              className="select-none py-3.5 pl-3 pr-3.5 text-right border-r font-mono text-xs shrink-0"
              style={{
                color: THEME.gutterText,
                backgroundColor: THEME.gutterBg,
                borderColor: THEME.gutterBorder,
                minWidth: lines.length >= 100 ? "3.5rem" : "2.75rem",
              }}
              aria-hidden="true"
            >
              {lines.map((_, idx) => (
                <div key={idx} className="leading-[1.65]">
                  {idx + 1}
                </div>
              ))}
            </div>
          )}

          {/* Syntax Highlighted Lines */}
          <div className="py-3.5 px-4 font-mono overflow-x-auto flex-1 whitespace-pre">
            {tokenizedLines.map((tokens, lineIdx) => (
              <div key={lineIdx} className="leading-[1.65]">
                {tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  tokens.map((token, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        color: token.color,
                        fontWeight: token.bold ? "bold" : "normal",
                      }}
                    >
                      {token.text}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
