import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    // Fetch user profile
    const profileRes = await query("SELECT * FROM profiles WHERE user_id = $1", [user.id]);
    const profile = profileRes.rows[0];

    if (!profile) {
      return NextResponse.json(
        { error: "Please complete onboarding first before generating a plan." },
        { status: 400 }
      );
    }

    const preferredDays = profile.preferred_days || [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    const focusAreas = profile.focus_areas || ["DSA", "Development"];
    const dailyStudyHours = body.dailyStudyHours || profile.daily_study_hours || 3;
    const planDurationDays = body.planDurationDays || 30;

    // 1. CRITICAL: Never overwrite completed historical tasks!
    // Delete only FUTURE incomplete tasks from today onwards
    const todayStr = new Date().toISOString().split("T")[0];
    await query(
      `DELETE FROM tasks
       WHERE user_id = $1 AND due_date >= $2 AND is_completed = FALSE`,
      [user.id, todayStr]
    );

    // 2. Fetch fresh questions not yet solved
    const dsaQuestions = await query(
      `SELECT q.id, q.title, q.difficulty, q.pattern_or_topic 
       FROM questions q
       LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1
       WHERE q.type = 'dsa' AND (uqp.status IS NULL OR uqp.status NOT IN ('solved', 'mastered'))
       ORDER BY q.id ASC
       LIMIT 40`,
      [user.id]
    );

    const devQuestions = await query(
      `SELECT q.id, q.title, q.difficulty, q.pattern_or_topic
       FROM questions q
       LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1
       WHERE q.type = 'development' AND (uqp.status IS NULL OR uqp.status NOT IN ('solved', 'mastered'))
       ORDER BY q.id ASC
       LIMIT 25`,
      [user.id]
    );

    const csQuestions = await query(
      `SELECT q.id, q.title, q.difficulty, q.pattern_or_topic
       FROM questions q
       LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1
       WHERE q.type IN ('core_cs', 'sql') AND (uqp.status IS NULL OR uqp.status NOT IN ('solved', 'mastered'))
       ORDER BY q.id ASC
       LIMIT 20`,
      [user.id]
    );

    // 3. Create or update preparation_plans record
    const planRes = await query(
      `INSERT INTO preparation_plans (
        user_id, title, description, target_role, target_date, total_days, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING id`,
      [
        user.id,
        `${profile.target_role || "Software Engineer"} Blueprint`,
        `Customized ${planDurationDays}-day plan targeting ${profile.target_companies?.slice(0, 3).join(", ") || "Tech Interviews"}.`,
        profile.target_role,
        profile.target_date,
        planDurationDays
      ]
    );
    const planId = planRes.rows[0].id;

    // 4. Schedule tasks
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    let scheduledDays = 0;
    let dsaIdx = 0;
    let devIdx = 0;
    let csIdx = 0;
    let totalScheduledTasks = 0;

    for (let offset = 0; offset < 45 && scheduledDays < planDurationDays; offset++) {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + offset);
      const dayName = dayNames[taskDate.getDay()];

      if (!preferredDays.includes(dayName)) continue;
      scheduledDays++;
      const dateStr = taskDate.toISOString().split("T")[0];

      // Schedule DSA task
      if (focusAreas.includes("DSA") && dsaQuestions.rows[dsaIdx]) {
        const q = dsaQuestions.rows[dsaIdx];
        await query(
          `INSERT INTO tasks (
            user_id, plan_id, title, description, category, priority, estimated_minutes, due_date, related_question_id
          ) VALUES ($1, $2, $3, $4, 'dsa', 'high', $5, $6, $7)`,
          [
            user.id,
            planId,
            `Master ${q.pattern_or_topic}: ${q.title} (${q.difficulty})`,
            `Analyze edge cases, optimal data structures, and write clean production code.`,
            Math.min(60, dailyStudyHours * 30),
            dateStr,
            q.id
          ]
        );
        dsaIdx = (dsaIdx + 1) % dsaQuestions.rows.length;
        totalScheduledTasks++;
      }

      // Schedule Dev or CS task
      if (focusAreas.includes("Development") && devQuestions.rows[devIdx]) {
        const q = devQuestions.rows[devIdx];
        await query(
          `INSERT INTO tasks (
            user_id, plan_id, title, description, category, priority, estimated_minutes, due_date, related_question_id
          ) VALUES ($1, $2, $3, $4, 'development', 'medium', 45, $5, $6)`,
          [
            user.id,
            planId,
            `Review: ${q.title}`,
            `Analyze architecture, implementation trade-offs, and interview explanation.`,
            dateStr,
            q.id
          ]
        );
        devIdx = (devIdx + 1) % devQuestions.rows.length;
        totalScheduledTasks++;
      } else if (focusAreas.includes("Core CS Subjects") && csQuestions.rows[csIdx]) {
        const q = csQuestions.rows[csIdx];
        await query(
          `INSERT INTO tasks (
            user_id, plan_id, title, description, category, priority, estimated_minutes, due_date, related_question_id
          ) VALUES ($1, $2, $3, $4, 'core_cs', 'medium', 40, $5, $6)`,
          [
            user.id,
            planId,
            `Core CS Deep Dive: ${q.title}`,
            `Understand fundamentals, system-level tradeoffs, and exam questions.`,
            dateStr,
            q.id
          ]
        );
        csIdx = (csIdx + 1) % csQuestions.rows.length;
        totalScheduledTasks++;
      }
    }

    return NextResponse.json({
      message: `Plan generated successfully! Scheduled ${totalScheduledTasks} tasks across ${scheduledDays} study days while preserving all historical completions.`,
      planId,
      totalScheduledTasks
    });
  } catch (error: any) {
    console.error("Plan Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate study plan." }, { status: 500 });
  }
}
