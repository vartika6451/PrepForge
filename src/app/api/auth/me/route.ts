import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const profileRes = await query(
    `SELECT full_name, headline, target_role, target_companies, education_level,
            experience_level, target_date, daily_study_hours, preferred_days,
            focus_areas, preferred_language, onboarding_completed, bio
     FROM profiles
     WHERE user_id = $1`,
    [user.id]
  );

  const prefRes = await query(
    `SELECT theme, email_notifications, task_reminders, streak_alerts, weekly_digest
     FROM user_preferences
     WHERE user_id = $1`,
    [user.id]
  );

  return NextResponse.json({
    user,
    profile: profileRes.rows[0] || null,
    preferences: prefRes.rows[0] || null
  });
}
