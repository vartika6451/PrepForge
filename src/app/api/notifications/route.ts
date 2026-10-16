import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dynamic generation of system notifications (e.g. overdue tasks or revisions)
    const todayStr = new Date().toISOString().split("T")[0];

    // Check overdue tasks
    const overdueRes = await query(
      `SELECT count(*)::int as count FROM tasks WHERE user_id = $1 AND due_date < $2 AND is_completed = FALSE`,
      [user.id, todayStr]
    );
    const overdueCount = overdueRes.rows[0]?.count || 0;
    if (overdueCount > 0) {
      // Check if alert already created today
      const existingAlert = await query(
        `SELECT id FROM notifications 
         WHERE user_id = $1 AND type = 'task_due' AND created_at >= CURRENT_DATE`,
        [user.id]
      );
      if (existingAlert.rowCount === 0) {
        await query(
          `INSERT INTO notifications (user_id, title, message, type, link_url)
           VALUES ($1, 'Overdue Tasks Alert ⚠️', $2, 'task_due', '/planner')`,
          [
            user.id,
            `You have ${overdueCount} task${overdueCount > 1 ? "s" : ""} overdue. Use the Study Planner to reschedule them to today!`
          ]
        );
      }
    }

    // Check upcoming revisions due today
    const revsRes = await query(
      `SELECT count(*)::int as count FROM revision_schedules WHERE user_id = $1 AND scheduled_date <= $2 AND is_completed = FALSE`,
      [user.id, todayStr]
    );
    const revCount = revsRes.rows[0]?.count || 0;
    if (revCount > 0) {
      const existingRevAlert = await query(
        `SELECT id FROM notifications 
         WHERE user_id = $1 AND type = 'revision_due' AND created_at >= CURRENT_DATE`,
        [user.id]
      );
      if (existingRevAlert.rowCount === 0) {
        await query(
          `INSERT INTO notifications (user_id, title, message, type, link_url)
           VALUES ($1, 'Spaced Repetition Due 🧠', $2, 'revision_due', '/revisions')`,
          [
            user.id,
            `You have ${revCount} question revision${revCount > 1 ? "s" : ""} scheduled for today to cement your memory.`
          ]
        );
      }
    }

    const notifRes = await query(
      `SELECT id, title, message, type, is_read, link_url, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [user.id]
    );

    const unreadCount = notifRes.rows.filter(n => !n.is_read).length;

    return NextResponse.json({
      notifications: notifRes.rows,
      unreadCount
    });
  } catch (error: any) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark all as read
    await query("UPDATE notifications SET is_read = TRUE WHERE user_id = $1", [user.id]);
    return NextResponse.json({ message: "All notifications marked as read." });
  } catch (error: any) {
    console.error("Mark Read Error:", error);
    return NextResponse.json({ error: "Failed to mark notifications read." }, { status: 500 });
  }
}
