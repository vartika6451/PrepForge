import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Fetch user profile
    const profileRes = await query(
      `SELECT full_name, target_role, target_companies, target_date,
              daily_study_hours, focus_areas, preferred_language, onboarding_completed
       FROM profiles WHERE user_id = $1`,
      [userId]
    );
    const profile = profileRes.rows[0] || {};

    // 2. Fetch today's tasks
    const todayTasksRes = await query(
      `SELECT t.id, t.title, t.description, t.category, t.priority,
              t.estimated_minutes, t.due_date, t.is_completed, t.completed_at,
              t.related_question_id,
              q.difficulty as question_difficulty,
              q.platform as question_platform,
              q.external_url as question_url
       FROM tasks t
       LEFT JOIN questions q ON q.id = t.related_question_id
       WHERE t.user_id = $1 AND t.due_date = $2
       ORDER BY t.is_completed ASC, 
                CASE t.priority 
                  WHEN 'urgent' THEN 1 
                  WHEN 'high' THEN 2 
                  WHEN 'medium' THEN 3 
                  ELSE 4 
                END ASC,
                t.created_at ASC`,
      [userId, todayStr]
    );

    // 3. Overall tasks statistics
    const tasksStatRes = await query(
      `SELECT 
        COUNT(*)::int as total_tasks,
        COUNT(*) FILTER (WHERE is_completed = TRUE)::int as completed_tasks
       FROM tasks
       WHERE user_id = $1`,
      [userId]
    );
    const totalTasks = tasksStatRes.rows[0]?.total_tasks || 0;
    const completedTasks = tasksStatRes.rows[0]?.completed_tasks || 0;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 4. DSA Solved breakdown from user_question_progress
    const dsaStatRes = await query(
      `SELECT 
        COUNT(*)::int as total_solved,
        COUNT(*) FILTER (WHERE q.difficulty = 'Easy')::int as easy_solved,
        COUNT(*) FILTER (WHERE q.difficulty = 'Medium')::int as medium_solved,
        COUNT(*) FILTER (WHERE q.difficulty = 'Hard')::int as hard_solved
       FROM user_question_progress uqp
       JOIN questions q ON q.id = uqp.question_id
       WHERE uqp.user_id = $1 AND q.type = 'dsa' AND uqp.status IN ('solved', 'mastered')`,
      [userId]
    );
    const dsaStats = dsaStatRes.rows[0] || {
      total_solved: 0,
      easy_solved: 0,
      medium_solved: 0,
      hard_solved: 0
    };

    // Total available DSA questions
    const totalDsaRes = await query(
      `SELECT COUNT(*)::int as count FROM questions WHERE type = 'dsa'`
    );
    const totalDsaCount = totalDsaRes.rows[0]?.count || 69;

    // 5. Development questions completed
    const devStatRes = await query(
      `SELECT COUNT(*)::int as count
       FROM user_question_progress uqp
       JOIN questions q ON q.id = uqp.question_id
       WHERE uqp.user_id = $1 AND q.type = 'development' AND uqp.status IN ('solved', 'mastered')`,
      [userId]
    );
    const devCompleted = devStatRes.rows[0]?.count || 0;

    // 6. Core CS and SQL questions completed
    const csStatRes = await query(
      `SELECT COUNT(*)::int as count
       FROM user_question_progress uqp
       JOIN questions q ON q.id = uqp.question_id
       WHERE uqp.user_id = $1 AND q.type IN ('core_cs', 'sql') AND uqp.status IN ('solved', 'mastered')`,
      [userId]
    );
    const csCompleted = csStatRes.rows[0]?.count || 0;

    // 7. Total study time (from task_completions + study_sessions)
    const studyTimeRes = await query(
      `SELECT 
        (COALESCE((SELECT SUM(actual_minutes) FROM task_completions WHERE user_id = $1), 0) +
         COALESCE((SELECT SUM(duration_minutes) FROM study_sessions WHERE user_id = $1), 0))::int as total_minutes`,
      [userId]
    );
    const totalStudyMinutes = studyTimeRes.rows[0]?.total_minutes || 0;

    // 8. Streak calculation from daily_activity & task_completions
    const activityDatesRes = await query(
      `SELECT DISTINCT activity_date::text as act_date
       FROM (
         SELECT activity_date FROM daily_activity WHERE user_id = $1 AND (tasks_completed > 0 OR study_minutes > 0 OR dsa_solved > 0)
         UNION
         SELECT completion_date as activity_date FROM task_completions WHERE user_id = $1
       ) acts
       ORDER BY act_date DESC`,
      [userId]
    );

    const activeDates = new Set(activityDatesRes.rows.map(r => r.act_date));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check from today or yesterday
    const checkDate = new Date();
    const todayActive = activeDates.has(todayStr);

    if (todayActive) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Check if active yesterday to keep streak alive
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      if (activeDates.has(yStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        checkDate.setDate(checkDate.getDate() - 100); // Broken streak
      }
    }

    while (currentStreak > 0) {
      const dStr = checkDate.toISOString().split("T")[0];
      if (activeDates.has(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Longest streak calculation
    const sortedDates = Array.from(activeDates).sort();
    if (sortedDates.length > 0) {
      tempStreak = 1;
      longestStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
    }
    if (currentStreak > longestStreak) longestStreak = currentStreak;

    // 9. Weekly activity chart (Last 7 days)
    const weeklyChartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      const dayActivityRes = await query(
        `SELECT 
          COALESCE(SUM(tasks_completed), 0)::int as tasks_done,
          COALESCE(SUM(study_minutes), 0)::int as minutes,
          COALESCE(SUM(dsa_solved), 0)::int as dsa_done
         FROM daily_activity
         WHERE user_id = $1 AND activity_date = $2`,
        [userId, dStr]
      );

      const row = dayActivityRes.rows[0] || {};
      weeklyChartData.push({
        date: dStr,
        day: dayName,
        tasks: row.tasks_done || 0,
        studyMinutes: row.minutes || 0,
        dsa: row.dsa_done || 0
      });
    }

    // 10. Upcoming revisions and interview countdown
    const upcomingRevisionsRes = await query(
      `SELECT rs.id, rs.scheduled_date, q.id as question_id, q.title, q.difficulty, q.type
       FROM revision_schedules rs
       JOIN questions q ON q.id = rs.question_id
       WHERE rs.user_id = $1 AND rs.is_completed = FALSE AND rs.scheduled_date >= CURRENT_DATE
       ORDER BY rs.scheduled_date ASC
       LIMIT 5`,
      [userId]
    );

    let daysUntilInterview = null;
    if (profile.target_date) {
      const tDate = new Date(profile.target_date);
      const now = new Date();
      const diffMs = tDate.getTime() - now.getTime();
      daysUntilInterview = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      profile,
      today: {
        date: todayStr,
        displayDate: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        tasks: todayTasksRes.rows,
        completedCount: todayTasksRes.rows.filter(t => t.is_completed).length,
        totalCount: todayTasksRes.rows.length
      },
      stats: {
        completionPercentage,
        totalTasks,
        completedTasks,
        currentStreak,
        longestStreak,
        totalStudyMinutes,
        dsa: {
          solved: dsaStats.total_solved,
          total: totalDsaCount,
          easy: dsaStats.easy_solved,
          medium: dsaStats.medium_solved,
          hard: dsaStats.hard_solved
        },
        devCompleted,
        csCompleted
      },
      weeklyChartData,
      upcomingRevisions: upcomingRevisionsRes.rows,
      daysUntilInterview
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics." },
      { status: 500 }
    );
  }
}
