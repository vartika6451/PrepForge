import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  educationLevel: z.string().default("Undergraduate"),
  targetRole: z.string().default("Software Engineer"),
  targetCompanies: z.array(z.string()).min(1, "Select at least one target company"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
  targetDate: z.string(), // ISO date e.g. "2026-12-01"
  dailyStudyHours: z.number().min(1).max(12).default(3),
  preferredDays: z.array(z.string()).min(1, "Select at least one study day"),
  focusAreas: z.array(z.string()).min(1, "Select at least one focus area"),
  preferredLanguage: z.enum(["C++", "Java", "Python", "JavaScript"]).default("Python"),
  bio: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      fullName,
      educationLevel,
      targetRole,
      targetCompanies,
      experienceLevel,
      targetDate,
      dailyStudyHours,
      preferredDays,
      focusAreas,
      preferredLanguage,
      bio
    } = parsed.data;

    // 1. Update Profile
    await query(
      `UPDATE profiles
       SET full_name = $1, education_level = $2, target_role = $3,
           target_companies = $4, experience_level = $5, target_date = $6,
           daily_study_hours = $7, preferred_days = $8, focus_areas = $9,
           preferred_language = $10, bio = $11, onboarding_completed = TRUE,
           updated_at = NOW()
       WHERE user_id = $12`,
      [
        fullName,
        educationLevel,
        targetRole,
        targetCompanies,
        experienceLevel,
        targetDate,
        dailyStudyHours,
        preferredDays,
        focusAreas,
        preferredLanguage,
        bio || "",
        user.id
      ]
    );

    // 2. Also ensure User name is synced
    await query("UPDATE users SET name = $1 WHERE id = $2", [fullName, user.id]);

    // 3. Create Personalized Preparation Plan
    const planResult = await query(
      `INSERT INTO preparation_plans (
        user_id, title, description, target_role, target_date, total_days, status
      ) VALUES ($1, $2, $3, $4, $5, 30, 'active')
      RETURNING id`,
      [
        user.id,
        `${targetRole} Intensive Roadmap (${preferredLanguage})`,
        `Personalized 30-day curriculum focusing on ${focusAreas.join(", ")} targeting ${targetCompanies.slice(0, 3).join(", ")}.`,
        targetRole,
        targetDate
      ]
    );
    const planId = planResult.rows[0].id;

    // 4. Fetch canonical questions to populate real daily tasks
    const dsaQuestions = await query(
      `SELECT id, title, difficulty, pattern_or_topic FROM questions WHERE type = 'dsa' ORDER BY id ASC LIMIT 20`
    );
    const devQuestions = await query(
      `SELECT id, title, difficulty, pattern_or_topic FROM questions WHERE type = 'development' ORDER BY id ASC LIMIT 10`
    );
    const csQuestions = await query(
      `SELECT id, title, difficulty, pattern_or_topic FROM questions WHERE type IN ('core_cs', 'sql') ORDER BY id ASC LIMIT 10`
    );

    // 5. Generate 14-day study tasks based on preferred study days
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    let scheduledDaysCount = 0;
    let dsaIndex = 0;
    let devIndex = 0;
    let csIndex = 0;

    for (let offset = 0; offset < 21 && scheduledDaysCount < 14; offset++) {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + offset);
      const dayName = dayNames[taskDate.getDay()];

      if (!preferredDays.includes(dayName)) continue;
      scheduledDaysCount++;
      const dateStr = taskDate.toISOString().split("T")[0];

      // Schedule DSA task if in focus areas
      if (focusAreas.includes("DSA") && dsaQuestions.rows[dsaIndex]) {
        const q = dsaQuestions.rows[dsaIndex];
        await query(
          `INSERT INTO tasks (
            user_id, plan_id, title, description, category, priority, estimated_minutes, due_date, related_question_id
          ) VALUES ($1, $2, $3, $4, 'dsa', 'high', $5, $6, $7)`,
          [
            user.id,
            planId,
            `Master ${q.pattern_or_topic}: ${q.title} (${q.difficulty})`,
            `Solve and analyze time/space complexity using ${preferredLanguage}.`,
            Math.min(60, dailyStudyHours * 30),
            dateStr,
            q.id
          ]
        );
        dsaIndex = (dsaIndex + 1) % dsaQuestions.rows.length;
      }

      // Schedule Development or CS task
      if (focusAreas.includes("Development") && devQuestions.rows[devIndex]) {
        const q = devQuestions.rows[devIndex];
        await query(
          `INSERT INTO tasks (
            user_id, plan_id, title, description, category, priority, estimated_minutes, due_date, related_question_id
          ) VALUES ($1, $2, $3, $4, 'development', 'medium', 45, $5, $6)`,
          [
            user.id,
            planId,
            `Review: ${q.title}`,
            `Deep dive into explanation, architectural decisions, and code walkthrough.`,
            dateStr,
            q.id
          ]
        );
        devIndex = (devIndex + 1) % devQuestions.rows.length;
      } else if (focusAreas.includes("Core CS Subjects") && csQuestions.rows[csIndex]) {
        const q = csQuestions.rows[csIndex];
        await query(
          `INSERT INTO tasks (
            user_id, plan_id, title, description, category, priority, estimated_minutes, due_date, related_question_id
          ) VALUES ($1, $2, $3, $4, 'core_cs', 'medium', 40, $5, $6)`,
          [
            user.id,
            planId,
            `Core CS Deep Dive: ${q.title}`,
            `Understand fundamental OS/DBMS/Network concepts and interview tradeoffs.`,
            dateStr,
            q.id
          ]
        );
        csIndex = (csIndex + 1) % csQuestions.rows.length;
      }
    }

    // 6. Create completion notification
    await query(
      `INSERT INTO notifications (user_id, title, message, type, link_url)
       VALUES ($1, 'Study Plan Generated! 🎯', 'Your personalized 30-day interview blueprint has been forged. Check your dashboard to begin today''s tasks.', 'system', '/dashboard')`,
      [user.id]
    );

    return NextResponse.json({
      message: "Onboarding completed successfully",
      planId
    });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding preferences." },
      { status: 500 }
    );
  }
}
