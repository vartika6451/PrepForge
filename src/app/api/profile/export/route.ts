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

    const [userRow, profile, preferences, tasks, completions, progress, bookmarks, revisions] =
      await Promise.all([
        query("SELECT id, name, email, created_at FROM users WHERE id = $1", [user.id]),
        query("SELECT * FROM profiles WHERE user_id = $1", [user.id]),
        query("SELECT * FROM user_preferences WHERE user_id = $1", [user.id]),
        query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC", [user.id]),
        query("SELECT * FROM task_completions WHERE user_id = $1 ORDER BY completion_date ASC", [user.id]),
        query("SELECT * FROM user_question_progress WHERE user_id = $1", [user.id]),
        query("SELECT * FROM bookmarks WHERE user_id = $1", [user.id]),
        query("SELECT * FROM revision_schedules WHERE user_id = $1", [user.id])
      ]);

    const exportData = {
      exportMetadata: {
        platform: "PrepForge",
        version: "1.0.0",
        exportedAt: new Date().toISOString()
      },
      user: userRow.rows[0],
      profile: profile.rows[0],
      preferences: preferences.rows[0],
      tasks: tasks.rows,
      taskCompletions: completions.rows,
      questionProgress: progress.rows,
      bookmarks: bookmarks.rows,
      revisions: revisions.rows
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="prepforge-data-export-${new Date().toISOString().split("T")[0]}.json"`
      }
    });
  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Failed to export data." }, { status: 500 });
  }
}
