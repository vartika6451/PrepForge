"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Building2,
  Calendar as CalendarIcon,
  Clock,
  Layers,
  Code2,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const TARGET_ROLES = [
  "Software Engineer",
  "SDE Intern",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Systems & DevOps Engineer"
];

const PRESET_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Stripe",
  "Atlassian",
  "Adobe",
  "Goldman Sachs",
  "Early-Stage High Growth Startups"
];

const EDUCATION_LEVELS = [
  "Undergraduate (CS / Eng)",
  "Master's Degree (CS / Eng)",
  "Bootcamp Graduate",
  "Self-Taught Developer",
  "Working Professional / Transitioning"
];

const EXPERIENCE_LEVELS = [
  { id: "Beginner", label: "Beginner", desc: "Starting interview prep or refreshing foundational DSA" },
  { id: "Intermediate", label: "Intermediate", desc: "Solved 50-100 questions, comfortable with core patterns" },
  { id: "Advanced", label: "Advanced", desc: "Cracking FAANG / hard algorithmic & distributed systems rounds" }
];

const STUDY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const FOCUS_AREAS = [
  { id: "DSA", label: "DSA Patterns", desc: "18 algorithmic patterns with LeetCode deep-dives" },
  { id: "Development", label: "Full-Stack Development", desc: "React, Next.js, Node.js, REST & Databases" },
  { id: "Core CS Subjects", label: "Core CS Fundamentals", desc: "OS, DBMS, Computer Networks & OOP" },
  { id: "SQL", label: "SQL Queries & Schema Design", desc: "Complex joins, window functions, and analytics" },
  { id: "System Design", label: "System Design & Distributed Systems", desc: "Scaling, caching, rate limiting, and architectures" },
  { id: "Interview Practice", label: "Technical Interview Questions", desc: "Output predictions, execution flow, and tradeoffs" }
];

const LANGUAGES = [
  { id: "Python", label: "Python", ext: "py" },
  { id: "Java", label: "Java", ext: "java" },
  { id: "C++", label: "C++", ext: "cpp" },
  { id: "JavaScript", label: "JavaScript / TypeScript", ext: "ts" }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [educationLevel, setEducationLevel] = useState("Undergraduate (CS / Eng)");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["Google", "Microsoft", "Amazon"]);
  const [customCompanyInput, setCustomCompanyInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  const [targetDate, setTargetDate] = useState("2026-12-31");

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    setTargetDate(d.toISOString().split("T")[0]);
  }, []);

  const [dailyStudyHours, setDailyStudyHours] = useState(3);
  const [preferredDays, setPreferredDays] = useState<string[]>([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]);
  const [focusAreas, setFocusAreas] = useState<string[]>(["DSA", "Development", "Core CS Subjects"]);
  const [preferredLanguage, setPreferredLanguage] = useState<"C++" | "Java" | "Python" | "JavaScript">("Python");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (profile?.full_name) setFullName(profile.full_name);
    if (profile?.target_role) setTargetRole(profile.target_role);
  }, [user, profile]);

  function toggleCompany(company: string) {
    if (selectedCompanies.includes(company)) {
      if (selectedCompanies.length > 1) {
        setSelectedCompanies(selectedCompanies.filter(c => c !== company));
      }
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  }

  function addCustomCompany() {
    if (customCompanyInput.trim() && !selectedCompanies.includes(customCompanyInput.trim())) {
      setSelectedCompanies([...selectedCompanies, customCompanyInput.trim()]);
      setCustomCompanyInput("");
    }
  }

  function toggleDay(day: string) {
    if (preferredDays.includes(day)) {
      if (preferredDays.length > 1) {
        setPreferredDays(preferredDays.filter(d => d !== day));
      }
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  }

  function toggleFocusArea(area: string) {
    if (focusAreas.includes(area)) {
      if (focusAreas.length > 1) {
        setFocusAreas(focusAreas.filter(a => a !== area));
      }
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  }

  async function handleCompleteOnboarding() {
    setError(null);
    setLoading(true);

    const finalRole = targetRole === "Other" && customRole.trim() ? customRole.trim() : targetRole;

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || user?.name || "Developer",
          educationLevel,
          targetRole: finalRole,
          targetCompanies: selectedCompanies,
          experienceLevel,
          targetDate,
          dailyStudyHours,
          preferredDays,
          focusAreas,
          preferredLanguage,
          bio
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to generate personalized study plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Wizard Header & Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>STEP {step} OF 4</span>
            <span>{Math.round((step / 4) * 100)}% COMPLETED</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: Profile & Target Role */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Target Role & Profile</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  What role are you forging your skills for?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  We use your target role to prioritize core algorithms, system concepts, and development masterclasses.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Current Education Level / Status
                  </label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    {EDUCATION_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl} className="bg-slate-900 text-white">
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Target Engineering Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TARGET_ROLES.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setTargetRole(role)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          targetRole === role
                            ? "bg-orange-500/15 border-orange-500 text-white shadow-sm shadow-orange-500/10"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <span>{role}</span>
                        {targetRole === role && <Check className="w-4 h-4 text-orange-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Companies & Experience & Target Date */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Target Companies & Timeline</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Where do you want to interview and when?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  We calibrate your study milestones according to your interview timeline and experience level.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Target Companies (Select multiple or add your own)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                    {PRESET_COMPANIES.map(company => {
                      const isSelected = selectedCompanies.includes(company);
                      return (
                        <button
                          key={company}
                          type="button"
                          onClick={() => toggleCompany(company)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            isSelected
                              ? "bg-orange-500 text-white border border-orange-400"
                              : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {company}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={customCompanyInput}
                      onChange={e => setCustomCompanyInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomCompany();
                        }
                      }}
                      placeholder="Add custom company (e.g., Jane Street)..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-slate-950/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={addCustomCompany}
                      className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-medium text-slate-200 hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-orange-400" />
                      <span>Target Interview Date</span>
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={e => setTargetDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Experience Level</span>
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={e => setExperienceLevel(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/60 text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      {EXPERIENCE_LEVELS.map(exp => (
                        <option key={exp.id} value={exp.id} className="bg-slate-900 text-white">
                          {exp.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Study Schedule & Language */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Routine & Language</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Design your daily study cadence
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Realistic consistency beats cramming. Choose how much time and which days you want to dedicate.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-300">
                      Daily Study Commitment
                    </label>
                    <span className="text-xs font-bold font-mono text-orange-400">
                      {dailyStudyHours} hour{dailyStudyHours > 1 ? "s" : ""} / day
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map(hours => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setDailyStudyHours(hours)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold font-mono border transition ${
                          dailyStudyHours === hours
                            ? "bg-orange-500 text-white border-orange-400 shadow-sm"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {hours}h
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Preferred Study Days
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {STUDY_DAYS.map(day => {
                      const isSelected = preferredDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`py-2 px-1 rounded-xl text-[11px] font-medium border transition text-center ${
                            isSelected
                              ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Primary Programming Language</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setPreferredLanguage(lang.id as any)}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition ${
                          preferredLanguage === lang.id
                            ? "bg-orange-500/15 border-orange-500 text-white font-semibold"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div>{lang.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">.{lang.ext}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Focus Areas & Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Curriculum & Focus Areas</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  What pillars do you want to focus on?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  We generate your daily tasks according to these subjects. You can customize them anytime in Settings.
                </p>
              </div>

              <div className="space-y-2.5">
                {FOCUS_AREAS.map(area => {
                  const isSelected = focusAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => toggleFocusArea(area.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-orange-500/10 border-orange-500/60 text-white"
                          : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                          <span>{area.label}</span>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{area.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-slate-700 bg-slate-900"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 transition flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{loading ? "Forging Your Study Plan..." : "Generate Study Plan & Launch"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
