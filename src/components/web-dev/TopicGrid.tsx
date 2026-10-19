"use client";

import React from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { WebDevTopicId } from "@/types/web-dev";
import { WebDevTopicWithCount, getAllWebDevQuestions } from "@/lib/data/web-dev";
import { useUserPracticeStore } from "@/lib/web-dev-progress";

interface TopicGridProps {
  topics: WebDevTopicWithCount[];
  activeTopic: WebDevTopicId | "all";
  onSelectTopic: (topicId: WebDevTopicId | "all") => void;
}

export function TopicGrid({ topics, activeTopic, onSelectTopic }: TopicGridProps) {
  const store = useUserPracticeStore();
  const allQuestions = getAllWebDevQuestions();

  const handleToggle = (topicId: WebDevTopicId | "all") => {
    onSelectTopic(topicId);
  };

  return (
    <section aria-labelledby="topics-heading" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span
          id="topics-heading"
          className="text-[11px] font-mono uppercase tracking-wider text-[#383431] font-semibold"
        >
          Explore By Discipline
        </span>
        {activeTopic !== "all" && (
          <button
            onClick={() => handleToggle("all")}
            type="button"
            className="text-xs font-mono text-[#383431] hover:text-[#A34823] transition cursor-pointer"
          >
            Show all disciplines
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleToggle("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
            activeTopic === "all"
              ? "bg-[#A34823] text-white border-[#A34823] shadow-xs"
              : "bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border-[#99958E]"
          }`}
        >
          All Topics ({allQuestions.length})
        </button>

        {topics.map((topic) => {
          const isSelected = activeTopic === topic.id;
          const questionsInTopic = allQuestions.filter((q) => q.topic === topic.id);
          const completedInTopic = questionsInTopic.filter(
            (q) => store.attempts[q.slug]?.status === "completed"
          ).length;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleToggle(isSelected ? "all" : topic.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                isSelected
                  ? "bg-[#A34823] text-white border-[#A34823] shadow-xs"
                  : "bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border-[#99958E]"
              }`}
            >
              {completedInTopic > 0 && !isSelected && (
                <CheckCircle2 className="w-3 h-3 text-[#A34823]" />
              )}
              {isSelected && <Check className="w-3 h-3 text-white" />}
              <span>{topic.name}</span>
              <span
                className={`text-[10px] font-mono ${
                  isSelected ? "text-white/80" : "text-[#383431]"
                }`}
              >
                ({topic.count})
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
