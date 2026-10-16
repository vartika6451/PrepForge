import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || null;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // dsa, development, core_cs, sql
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const platform = searchParams.get("platform");
    const status = searchParams.get("status"); // solved, attempted, etc.
    const search = searchParams.get("search");

    let sql = `
      SELECT q.id, q.type, q.category, q.pattern_or_topic, q.title,
             q.difficulty, q.platform, q.external_url, q.explanation,
             q.code_example, q.sample_schema, q.solution_query, q.tags,
             COALESCE(uqp.status, 'not_started') as user_status,
             uqp.solved_at,
             uqp.personal_notes,
             uqp.confidence_level,
             uqp.attempts_count,
             uqp.last_attempt_code,
             (b.id IS NOT NULL) as is_bookmarked,
             (rs.id IS NOT NULL AND rs.is_completed = FALSE) as has_revision_scheduled,
             rs.scheduled_date as next_revision_date
      FROM questions q
      LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1
      LEFT JOIN bookmarks b ON b.question_id = q.id AND b.user_id = $1
      LEFT JOIN revision_schedules rs ON rs.question_id = q.id AND rs.user_id = $1 AND rs.is_completed = FALSE
      WHERE 1=1
    `;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (type && type !== "all") {
      sql += ` AND q.type = $${paramIndex++}`;
      params.push(type);
    }
    if (category && category !== "all") {
      sql += ` AND (q.category ILIKE $${paramIndex} OR q.pattern_or_topic ILIKE $${paramIndex})`;
      params.push(`%${category}%`);
      paramIndex++;
    }
    if (difficulty && difficulty !== "all") {
      sql += ` AND LOWER(q.difficulty) = LOWER($${paramIndex++})`;
      params.push(difficulty);
    }
    if (platform && platform !== "all") {
      sql += ` AND LOWER(q.platform) = LOWER($${paramIndex++})`;
      params.push(platform);
    }
    if (status && status !== "all") {
      if (status === "not_started") {
        sql += ` AND (uqp.status IS NULL OR uqp.status = 'not_started')`;
      } else {
        sql += ` AND uqp.status = $${paramIndex++}`;
        params.push(status);
      }
    }
    if (search && search.trim() !== "") {
      sql += ` AND (q.title ILIKE $${paramIndex} OR q.explanation ILIKE $${paramIndex} OR q.category ILIKE $${paramIndex})`;
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY q.id ASC`;

    const result = await query(sql, params);
    return NextResponse.json({
      count: result.rowCount,
      questions: result.rows
    });
  } catch (error: any) {
    console.error("GET Questions Error:", error);
    return NextResponse.json({ error: "Failed to fetch questions." }, { status: 500 });
  }
}
