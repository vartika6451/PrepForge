import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await query(
      `SELECT u.id, u.name, u.email, u.avatar_url, u.provider, u.created_at,
              p.full_name, p.headline, p.target_role, p.target_companies,
              p.education_level, p.experience_level, p.target_date,
              p.daily_study_hours, p.preferred_days, p.focus_areas,
              p.preferred_language, p.onboarding_completed, p.bio
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [user.id]
    );

    return NextResponse.json({ profile: res.rows[0] });
  } catch (error: any) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      fullName,
      headline,
      targetRole,
      targetCompanies,
      educationLevel,
      experienceLevel,
      targetDate,
      dailyStudyHours,
      preferredDays,
      focusAreas,
      preferredLanguage,
      bio
    } = body;

    // Update profile
    await query(
      `UPDATE profiles
       SET full_name = COALESCE($1, full_name),
           headline = COALESCE($2, headline),
           target_role = COALESCE($3, target_role),
           target_companies = COALESCE($4, target_companies),
           education_level = COALESCE($5, education_level),
           experience_level = COALESCE($6, experience_level),
           target_date = COALESCE($7, target_date),
           daily_study_hours = COALESCE($8, daily_study_hours),
           preferred_days = COALESCE($9, preferred_days),
           focus_areas = COALESCE($10, focus_areas),
           preferred_language = COALESCE($11, preferred_language),
           bio = COALESCE($12, bio),
           updated_at = NOW()
       WHERE user_id = $13`,
      [
        fullName,
        headline,
        targetRole,
        targetCompanies,
        educationLevel,
        experienceLevel,
        targetDate || null,
        dailyStudyHours,
        preferredDays,
        focusAreas,
        preferredLanguage,
        bio,
        user.id
      ]
    );

    if (fullName) {
      await query("UPDATE users SET name = $1 WHERE id = $2", [fullName, user.id]);
    }

    return NextResponse.json({ message: "Profile updated successfully." });
  } catch (error: any) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
