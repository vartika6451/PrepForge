import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      `SELECT b.id as bookmark_id, b.note as bookmark_note, b.created_at as bookmarked_at,
              q.id, q.type, q.category, q.pattern_or_topic, q.title,
              q.difficulty, q.platform, q.external_url,
              COALESCE(uqp.status, 'not_started') as user_status
       FROM bookmarks b
       JOIN questions q ON q.id = b.question_id
       LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id AND uqp.user_id = $1
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      count: result.rowCount,
      bookmarks: result.rows
    });
  } catch (error: any) {
    console.error("GET Bookmarks Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks." }, { status: 500 });
  }
}
