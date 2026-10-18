"use client";

import React from "react";
import {
  Code2,
  Layers,
  Globe,
  Server,
  Database,
  Gauge,
  ArrowRight,
  Check,
  CheckCircle2,
} from "lucide-react";
import { WebDevTopicId } from "@/types/web-dev";
import { WebDevTopicWithCount, getAllWebDevQuestions } from "@/lib/data/web-dev";
import { useUserPracticeStore } from "@/lib/web-dev-progress";

interface TopicGridProps {
  topics: WebDevTopicWithCount[];
  activeTopic: WebDevTopicId | "all";
  onSelectTopic: (topicId: WebDevTopicId | "all") => void;
}

function getTopicIcon(iconName: string) {
  switch (iconName) {
    case "Code2":
      return Code2;
    case "Layers":
      return Layers;
    case "Globe":
      return Globe;
    case "Server":
      return Server;
    case "Database":
      return Database;
    case "Gauge":
      return Gauge;
    default:
      return Code2;
  }
}

export function TopicGrid({ topics, activeTopic, onSelectTopic }: TopicGridProps) {
  const store = useUserPracticeStore();
  const allQuestions = getAllWebDevQuestions();

  const handleClick = (topicId: WebDevTopicId) => {
    onSelectTopic(activeTopic === topicId ? "all" : topicId);

    // Scroll smoothly to question library section
    const target = document.getElementById("question-library");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section aria-labelledby="topics-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="topics-heading" className="text-sm font-mono uppercase tracking-wider text-slate-400">
            Explore By Topic
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Target key disciplines across the modern web development stack with real progress tracking.
          </p>
        </div>

        {activeTopic !== "all" && (
          <button
            onClick={() => onSelectTopic("all")}
            type="button"
            className="text-xs font-mono text-slate-400 hover:text-orange-400 transition"
          >
            Clear topic filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {topics.map((topic) => {
          const Icon = getTopicIcon(topic.iconName);
          const isSelected = activeTopic === topic.id;

          // Real completion calculation for this specific topic
          const questionsInTopic = allQuestions.filter((q) => q.topic === topic.id);
          const completedInTopic = questionsInTopic.filter(
            (q) => store.attempts[q.slug]?.status === "completed"
          ).length;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleClick(topic.id)}
              aria-pressed={isSelected}
              className={`group text-left p-4 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-orange-500/10 border-orange-500 shadow-sm shadow-orange-500/10"
                  : "bg-[#0f172a]/50 hover:bg-[#131d33] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-2.5 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition ${
                        isSelected
                          ? "text-orange-400 bg-orange-500/20 border-orange-500/40"
                          : "text-slate-400 bg-slate-800/80 border-slate-700/60 group-hover:text-orange-400 group-hover:border-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm font-semibold text-white group-hover:text-orange-300 transition">
                      {topic.name}
                    </h3>
                  </div>

                  {isSelected ? (
                    <span className="p-1 rounded-full bg-orange-500/20 text-orange-400">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {topic.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  {completedInTopic > 0 ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">
                        {completedInTopic} of {topic.count} completed
                      </span>
                    </>
                  ) : (
                    <span>
                      {topic.count} {topic.count === 1 ? "question" : "questions"}
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-orange-400 transition">
                  {isSelected ? "Filtering library" : "Filter by topic"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
