import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category"); // optional filter

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate parameters are required" },
        { status: 400 }
      );
    }

    // 1. Fetch all tasks within the date window
    let taskSql = `
      SELECT t.id, t.title, t.description, t.category, t.priority,
             t.estimated_minutes, t.due_date, t.is_completed, t.completed_at,
             t.related_question_id,
             q.difficulty as question_difficulty,
             q.platform as question_platform
      FROM tasks t
      LEFT JOIN questions q ON q.id = t.related_question_id
      WHERE t.user_id = $1 AND t.due_date >= $2 AND t.due_date <= $3
    `;
    const taskParams: any[] = [user.id, startDate, endDate];
    if (category && category !== "all") {
      taskSql += ` AND t.category = $4`;
      taskParams.push(category);
    }
    taskSql += ` ORDER BY t.due_date ASC, t.is_completed ASC, t.priority ASC`;

    const tasksRes = await query(taskSql, taskParams);

    // 2. Fetch daily_activity records for the window
    const actRes = await query(
      `SELECT activity_date::text as date_str, tasks_completed, tasks_planned,
              dsa_solved, dev_completed, study_minutes, reflection_notes
       FROM daily_activity
       WHERE user_id = $1 AND activity_date >= $2 AND activity_date <= $3`,
      [user.id, startDate, endDate]
    );

    const activityByDate = new Map<string, any>();
    for (const row of actRes.rows) {
      activityByDate.set(row.date_str, row);
    }

    // 3. Group tasks by date
    const tasksByDate = new Map<string, any[]>();
    for (const t of tasksRes.rows) {
      const d = t.due_date;
      if (!tasksByDate.has(d)) tasksByDate.set(d, []);
      tasksByDate.get(d)!.push(t);
    }

    // 4. Construct day summary map
    const daysData: Record<string, any> = {};
    const todayStr = new Date().toISOString().split("T")[0];

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
      const dStr = cur.toISOString().split("T")[0];
      const dayTasks = tasksByDate.get(dStr) || [];
      const act = activityByDate.get(dStr);

      const planned = dayTasks.length;
      const completed = dayTasks.filter(t => t.is_completed).length;
      const remaining = planned - completed;
      const isPast = dStr < todayStr;
      const isToday = dStr === todayStr;

      let status: "completed" | "partial" | "missed" | "future" | "rest" = "rest";
      if (planned > 0) {
        if (completed === planned) {
          status = "completed";
        } else if (completed > 0) {
          status = "partial";
        } else if (isPast) {
          status = "missed";
        } else {
          status = "future";
        }
      }

      daysData[dStr] = {
        date: dStr,
        isToday,
        isPast,
        status,
        planned,
        completed,
        remaining,
        completionRate: planned > 0 ? Math.round((completed / planned) * 100) : 0,
        studyMinutes: act?.study_minutes || (completed * 45),
        dsaSolved: act?.dsa_solved || dayTasks.filter(t => t.category === "dsa" && t.is_completed).length,
        devCompleted: act?.dev_completed || dayTasks.filter(t => t.category === "development" && t.is_completed).length,
        tasks: dayTasks,
        reflectionNotes: act?.reflection_notes || ""
      };
    }

    // Overall date range metrics
    const allDays = Object.values(daysData);
    const totalPlanned = allDays.reduce((acc, d) => acc + d.planned, 0);
    const totalCompleted = allDays.reduce((acc, d) => acc + d.completed, 0);
    const totalStudyMinutes = allDays.reduce((acc, d) => acc + d.studyMinutes, 0);
    const totalDsaSolved = allDays.reduce((acc, d) => acc + d.dsaSolved, 0);

    return NextResponse.json({
      startDate,
      endDate,
      summary: {
        totalPlanned,
        totalCompleted,
        totalStudyMinutes,
        totalDsaSolved,
        overallCompletionRate: totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0
      },
      days: daysData
    });
  } catch (error: any) {
    console.error("Calendar Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar summary." },
      { status: 500 }
    );
  }
}
