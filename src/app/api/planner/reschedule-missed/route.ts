import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Find all past incomplete tasks
    const missedRes = await query(
      `SELECT id, title FROM tasks
       WHERE user_id = $1 AND due_date < $2 AND is_completed = FALSE`,
      [user.id, todayStr]
    );

    const missedCount = missedRes.rowCount || 0;
    if (missedCount === 0) {
      return NextResponse.json({ message: "No overdue tasks to reschedule!", rescheduledCount: 0 });
    }

    // Move overdue tasks to today
    await query(
      `UPDATE tasks
       SET due_date = $1, updated_at = NOW()
       WHERE user_id = $2 AND due_date < $1 AND is_completed = FALSE`,
      [todayStr, user.id]
    );

    return NextResponse.json({
      message: `Successfully rescheduled ${missedCount} overdue task${missedCount > 1 ? "s" : ""} to today!`,
      rescheduledCount: missedCount
    });
  } catch (error: any) {
    console.error("Reschedule Missed Error:", error);
    return NextResponse.json({ error: "Failed to reschedule missed tasks." }, { status: 500 });
  }
}
