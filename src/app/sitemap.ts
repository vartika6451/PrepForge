import { MetadataRoute } from "next";
import { getPatterns, getTechnologies, getInterviewQuestions, getProjects, getRoadmaps } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prepforge.dev";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/dsa-patterns`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/developer`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/interview-questions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/roadmaps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const patterns = getPatterns().map((p) => ({
    url: `${baseUrl}/dsa-patterns/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const technologies = getTechnologies().map((t) => ({
    url: `${baseUrl}/developer/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const interviewQuestions = getInterviewQuestions().map((iq) => ({
    url: `${baseUrl}/interview-questions/${iq.technologySlug}/${iq.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projects = getProjects().map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const roadmaps = getRoadmaps().map((rm) => ({
    url: `${baseUrl}/roadmaps/${rm.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...patterns, ...technologies, ...interviewQuestions, ...projects, ...roadmaps];
}
