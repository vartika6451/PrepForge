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

    const { id: revId } = await params;
    const body = await req.json().catch(() => ({}));

    // Find revision
    const revRes = await query(
      "SELECT * FROM revision_schedules WHERE id = $1 AND user_id = $2",
      [revId, user.id]
    );

    if (revRes.rowCount === 0) {
      return NextResponse.json({ error: "Revision not found." }, { status: 404 });
    }

    const rev = revRes.rows[0];

    // Mark current revision complete
    await query(
      `UPDATE revision_schedules
       SET is_completed = TRUE, completed_at = NOW(), notes = COALESCE($1, notes), updated_at = NOW()
       WHERE id = $2`,
      [body.notes || null, revId]
    );

    // Schedule next spaced interval (e.g. 7 days if previously 3, 14 days if previously 7)
    let nextScheduledDate = null;
    if (body.scheduleNext !== false) {
      const nextInterval = (rev.interval_days || 3) * 2;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextInterval);
      const nextDateStr = nextDate.toISOString().split("T")[0];

      await query(
        `INSERT INTO revision_schedules (
          user_id, question_id, scheduled_date, interval_days, repetition_number, notes
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          user.id,
          rev.question_id,
          nextDateStr,
          nextInterval,
          (rev.repetition_number || 1) + 1,
          `Spaced repetition iteration #${(rev.repetition_number || 1) + 1}`
        ]
      );
      nextScheduledDate = nextDateStr;
    }

    return NextResponse.json({
      message: "Revision marked complete!",
      nextScheduledDate
    });
  } catch (error: any) {
    console.error("Complete Revision Error:", error);
    return NextResponse.json({ error: "Failed to complete revision." }, { status: 500 });
  }
}
