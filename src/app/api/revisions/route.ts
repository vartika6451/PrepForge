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
    const filter = searchParams.get("filter") || "all"; // all, upcoming, overdue, completed

    const todayStr = new Date().toISOString().split("T")[0];

    let sql = `
      SELECT rs.id, rs.question_id, rs.scheduled_date, rs.is_completed, rs.completed_at,
             rs.notes, rs.interval_days, rs.repetition_number,
             q.title as question_title,
             q.type as question_type,
             q.category as question_category,
             q.difficulty as question_difficulty,
             q.platform as question_platform,
             q.external_url as question_url
      FROM revision_schedules rs
      JOIN questions q ON q.id = rs.question_id
      WHERE rs.user_id = $1
    `;
    const params: any[] = [user.id];

    if (filter === "upcoming") {
      sql += ` AND rs.is_completed = FALSE AND rs.scheduled_date >= $2`;
      params.push(todayStr);
    } else if (filter === "overdue") {
      sql += ` AND rs.is_completed = FALSE AND rs.scheduled_date < $2`;
      params.push(todayStr);
    } else if (filter === "completed") {
      sql += ` AND rs.is_completed = TRUE`;
    }

    sql += ` ORDER BY rs.is_completed ASC, rs.scheduled_date ASC`;

    const result = await query(sql, params);

    // Summary counts
    const countRes = await query(
      `SELECT 
        COUNT(*) FILTER (WHERE is_completed = FALSE AND scheduled_date < $2)::int as overdue_count,
        COUNT(*) FILTER (WHERE is_completed = FALSE AND scheduled_date >= $2)::int as upcoming_count,
        COUNT(*) FILTER (WHERE is_completed = TRUE)::int as completed_count
       FROM revision_schedules
       WHERE user_id = $1`,
      [user.id, todayStr]
    );

    return NextResponse.json({
      revisions: result.rows,
      counts: countRes.rows[0] || { overdue_count: 0, upcoming_count: 0, completed_count: 0 }
    });
  } catch (error: any) {
    console.error("GET Revisions Error:", error);
    return NextResponse.json({ error: "Failed to fetch revisions." }, { status: 500 });
  }
}
