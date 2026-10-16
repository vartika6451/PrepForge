import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { theme, emailNotifications, taskReminders, streakAlerts, weeklyDigest } = body;

    await query(
      `INSERT INTO user_preferences (
        user_id, theme, email_notifications, task_reminders, streak_alerts, weekly_digest
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        theme = COALESCE($2, user_preferences.theme),
        email_notifications = COALESCE($3, user_preferences.email_notifications),
        task_reminders = COALESCE($4, user_preferences.task_reminders),
        streak_alerts = COALESCE($5, user_preferences.streak_alerts),
        weekly_digest = COALESCE($6, user_preferences.weekly_digest),
        updated_at = NOW()`,
      [
        user.id,
        theme || "dark",
        emailNotifications ?? true,
        taskReminders ?? true,
        streakAlerts ?? true,
        weeklyDigest ?? true
      ]
    );

    return NextResponse.json({ message: "Preferences updated successfully." });
  } catch (error: any) {
    console.error("PUT Preferences Error:", error);
    return NextResponse.json({ error: "Failed to update preferences." }, { status: 500 });
  }
}
