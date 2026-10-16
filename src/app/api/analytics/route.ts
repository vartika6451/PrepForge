import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 1. Total preparation days (days where user was created to today, and days with recorded activity)
    const activeDaysRes = await query(
      `SELECT COUNT(DISTINCT activity_date)::int as active_days
       FROM daily_activity
       WHERE user_id = $1 AND (tasks_completed > 0 OR study_minutes > 0 OR dsa_solved > 0)`,
      [userId]
    );
    const activeDays = activeDaysRes.rows[0]?.active_days || 0;

    // 2. Planned vs Completed tasks
    const tasksRes = await query(
      `SELECT 
        COUNT(*)::int as total_planned,
        COUNT(*) FILTER (WHERE is_completed = TRUE)::int as total_completed
       FROM tasks
       WHERE user_id = $1`,
      [userId]
    );
    const totalPlanned = tasksRes.rows[0]?.total_planned || 0;
    const totalCompleted = tasksRes.rows[0]?.total_completed || 0;
    const overallCompletionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

    // 3. DSA Solved by difficulty
    const dsaDiffRes = await query(
      `SELECT 
        q.difficulty,
        COUNT(DISTINCT q.id)::int as solved_count
       FROM user_question_progress uqp
       JOIN questions q ON q.id = uqp.question_id
       WHERE uqp.user_id = $1 AND q.type = 'dsa' AND uqp.status IN ('solved', 'mastered')
       GROUP BY q.difficulty`,
      [userId]
    );

    const dsaByDifficulty = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
    for (const row of dsaDiffRes.rows) {
      if (row.difficulty in dsaByDifficulty) {
        (dsaByDifficulty as any)[row.difficulty] = row.solved_count;
      }
    }

    // 4. DSA Solved by topic / pattern
    const dsaTopicsRes = await query(
      `SELECT 
        q.category as topic,
        COUNT(DISTINCT q.id)::int as solved_count,
        (SELECT COUNT(*)::int FROM questions q2 WHERE q2.category = q.category AND q2.type = 'dsa') as total_in_topic
       FROM questions q
       LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1 AND uqp.status IN ('solved', 'mastered')
       WHERE q.type = 'dsa'
       GROUP BY q.category
       ORDER BY solved_count DESC, topic ASC`,
      [userId]
    );

    // 5. Development questions by category
    const devCatsRes = await query(
      `SELECT 
        q.category,
        COUNT(DISTINCT q.id)::int as total,
        COUNT(DISTINCT uqp.question_id)::int as completed
       FROM questions q
       LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1 AND uqp.status IN ('solved', 'mastered')
       WHERE q.type = 'development'
       GROUP BY q.category
       ORDER BY completed DESC, q.category ASC`,
      [userId]
    );

    // 6. Study hours by week (last 4 weeks)
    const weeklyHours = [];
    for (let w = 3; w >= 0; w--) {
      const startW = new Date();
      startW.setDate(startW.getDate() - (w * 7 + 6));
      const endW = new Date();
      endW.setDate(endW.getDate() - (w * 7));

      const sStr = startW.toISOString().split("T")[0];
      const eStr = endW.toISOString().split("T")[0];

      const weekRes = await query(
        `SELECT COALESCE(SUM(study_minutes), 0)::int as minutes,
                COALESCE(SUM(tasks_completed), 0)::int as tasks
         FROM daily_activity
         WHERE user_id = $1 AND activity_date >= $2 AND activity_date <= $3`,
        [userId, sStr, eStr]
      );

      const hours = Math.round(((weekRes.rows[0]?.minutes || 0) / 60) * 10) / 10;
      weeklyHours.push({
        label: w === 0 ? "This Week" : `${w}w Ago`,
        hours,
        tasks: weekRes.rows[0]?.tasks || 0
      });
    }

    // 7. Activity Heatmap (Last 90 days)
    const heatmap = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split("T")[0];

      const dayAct = await query(
        `SELECT tasks_completed, study_minutes, dsa_solved
         FROM daily_activity
         WHERE user_id = $1 AND activity_date = $2`,
        [userId, dStr]
      );

      const row = dayAct.rows[0];
      const tasks = row?.tasks_completed || 0;
      const mins = row?.study_minutes || 0;
      const dsa = row?.dsa_solved || 0;

      let level = 0;
      const score = tasks + dsa + Math.floor(mins / 30);
      if (score >= 5) level = 4;
      else if (score >= 3) level = 3;
      else if (score >= 1) level = 2;
      else if (score > 0) level = 1;

      heatmap.push({
        date: dStr,
        level,
        tasks,
        studyMinutes: mins,
        dsaSolved: dsa
      });
    }

    // 8. Strongest and Weakest topics
    const strongestTopics = dsaTopicsRes.rows.filter(t => t.solved_count > 0).slice(0, 3);
    const weakestTopics = dsaTopicsRes.rows.filter(t => t.solved_count === 0).slice(0, 3);

    return NextResponse.json({
      activeDays,
      tasks: {
        totalPlanned,
        totalCompleted,
        overallCompletionRate
      },
      dsaByDifficulty,
      dsaTopics: dsaTopicsRes.rows,
      devCategories: devCatsRes.rows,
      weeklyHours,
      heatmap,
      insights: {
        strongestTopics,
        weakestTopics
      }
    });
  } catch (error: any) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to generate analytics." }, { status: 500 });
  }
}
