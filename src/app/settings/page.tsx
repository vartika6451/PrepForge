"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  Check,
  Save,
  Clock,
  Briefcase,
  Code2,
  Layers,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile: authProfile, refreshUser, theme, toggleTheme, logout, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security" | "data">("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile Fields
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [targetCompanies, setTargetCompanies] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState("");
  const [dailyHours, setDailyHours] = useState(3);
  const [preferredLanguage, setPreferredLanguage] = useState("Python");
  const [bio, setBio] = useState("");

  // Notification Toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const json = await res.json();
        const p = json.profile;
        setProfile(p);
        setFullName(p.full_name || p.name || "");
        setHeadline(p.headline || "");
        setTargetRole(p.target_role || "Software Engineer");
        setTargetCompanies(p.target_companies || ["Google", "Amazon"]);
        setTargetDate(p.target_date ? p.target_date.split("T")[0] : "");
        setDailyHours(p.daily_study_hours || 3);
        setPreferredLanguage(p.preferred_language || "Python");
        setBio(p.bio || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchProfile();
      }
    }
  }, [user, authLoading, router, fetchProfile]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          headline,
          targetRole,
          targetCompanies,
          targetDate: targetDate || null,
          dailyStudyHours: dailyHours,
          preferredLanguage,
          bio
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Profile preferences saved successfully!");
      await refreshUser();
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePreferences() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          emailNotifications: emailNotifs,
          taskReminders,
          streakAlerts
        })
      });
      if (res.ok) {
        setMessage("Notification & UI preferences updated!");
      }
    } catch (err) {
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  }

  async function handleExportData() {
    window.location.href = "/api/profile/export";
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you ABSOLUTELY sure you want to delete your PrepForge account? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch("/api/profile/account", { method: "DELETE" });
      if (res.ok) {
        await logout();
      }
    } catch (err) {
      alert("Failed to delete account.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Account & Preparation Settings
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Manage your personal profile, target goals, security credentials, and export your study history.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "profile", label: "Profile & Targets", icon: User },
          { id: "preferences", label: "Preferences & Theme", icon: Bell },
          { id: "security", label: "Security & Password", icon: Shield },
          { id: "data", label: "Data & Privacy", icon: Download }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setMessage(null);
                setError(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Engineering Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Placement / Interview Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Daily Study Commitment (Hours)</label>
              <input
                type="number"
                min={1}
                max={12}
                value={dailyHours}
                onChange={e => setDailyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Language</label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="Aspiring Backend Engineer | System Design Enthusiast"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about your background and preparation targets..."
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div>
                <div className="text-xs font-semibold text-white">Visual Theme</div>
                <div className="text-[11px] text-slate-400">Toggle between Dark Mode and Light Mode</div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white"
              >
                Current: <span className="capitalize text-orange-400">{theme}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div>
                <div className="text-xs font-semibold text-white">Task Reminders</div>
                <div className="text-[11px] text-slate-400">In-app notifications when scheduled tasks are due</div>
              </div>
              <input
                type="checkbox"
                checked={taskReminders}
                onChange={e => setTaskReminders(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
              <div>
                <div className="text-xs font-semibold text-white">Streak Milestone Alerts</div>
                <div className="text-[11px] text-slate-400">Celebration popups for 7, 14, and 30-day consistency streaks</div>
              </div>
              <input
                type="checkbox"
                checked={streakAlerts}
                onChange={e => setStreakAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <form onSubmit={handleChangePassword} className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-4 max-w-md">
          <h3 className="text-sm font-bold text-white mb-2">Change Account Password</h3>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">New Password (8+ chars, Uppercase, Number)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold mt-2"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {/* Data & Privacy Tab */}
      {activeTab === "data" && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Export Personal Preparation Data</div>
                <div className="text-[11px] text-slate-400">Download all your solved problems, calendar logs, and notes as JSON</div>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-red-300">Delete Account & Progress</div>
                <div className="text-[11px] text-red-400/80">Permanently erase your account, calendar history, and solved progress</div>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
