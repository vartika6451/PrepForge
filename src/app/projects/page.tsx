import React from "react";
import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { getProjects } from "@/lib/data";
import { ProjectDirectory } from "@/components/projects/ProjectDirectory";

export const metadata: Metadata = {
  title: "Project Lab — Production-Grade Developer Project Blueprints",
  description:
    "Curated software project ideas organized by technology and difficulty with core features, phased milestones, architecture notes, and documentation references.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-[#272624] bg-[#BBB7B0] border border-[#99958E]">
          <Compass className="w-3.5 h-3.5 text-[#A34823]" />
          <span>Practical Portfolio Blueprints</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#272624] tracking-tight">
          Project Lab
        </h1>
        <p className="text-sm sm:text-base text-[#383431] leading-relaxed">
          Move beyond toy tutorials. Build projects that solve real architectural problems, demonstrate concurrency control, adhere to accessibility standards, and showcase engineering depth on your resume.
        </p>
      </div>

      {/* Directory with live filtering */}
      <ProjectDirectory projects={projects} />
    </div>
  );
}
