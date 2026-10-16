import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: questionId } = await params;
    const body = await req.json().catch(() => ({}));

    // Check if already bookmarked
    const existing = await query(
      "SELECT id FROM bookmarks WHERE user_id = $1 AND question_id = $2",
      [user.id, questionId]
    );

    let isBookmarked = false;

    if (existing.rowCount && existing.rowCount > 0) {
      // Remove bookmark
      await query("DELETE FROM bookmarks WHERE user_id = $1 AND question_id = $2", [
        user.id,
        questionId
      ]);
      isBookmarked = false;
    } else {
      // Add bookmark
      await query(
        "INSERT INTO bookmarks (user_id, question_id, note) VALUES ($1, $2, $3)",
        [user.id, questionId, body.note || null]
      );
      isBookmarked = true;
    }

    return NextResponse.json({
      message: isBookmarked ? "Question bookmarked" : "Bookmark removed",
      isBookmarked
    });
  } catch (error: any) {
    console.error("Bookmark Error:", error);
    return NextResponse.json({ error: "Failed to update bookmark." }, { status: 500 });
  }
}
