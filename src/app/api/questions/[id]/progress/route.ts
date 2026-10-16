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
    const body = await req.json();

    const {
      status, // not_started, attempted, solved, learning, mastered, revising
      personalNotes,
      confidenceLevel,
      lastAttemptCode,
      scheduleRevision
    } = body;

    // 1. Fetch question info
    const qRes = await query("SELECT * FROM questions WHERE id = $1", [questionId]);
    if (qRes.rowCount === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    const question = qRes.rows[0];

    const isSolved = status === "solved" || status === "mastered";
    const solvedAt = isSolved ? new Date().toISOString() : null;
    const todayStr = new Date().toISOString().split("T")[0];

    // 2. Upsert user_question_progress
    const progressRes = await query(
      `INSERT INTO user_question_progress (
        user_id, question_id, status, solved_at, personal_notes, confidence_level, last_attempt_code, attempts_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)
      ON CONFLICT (user_id, question_id)
      DO UPDATE SET
        status = $3,
        solved_at = COALESCE($4::timestamptz, user_question_progress.solved_at),
        personal_notes = COALESCE($5, user_question_progress.personal_notes),
        confidence_level = COALESCE($6, user_question_progress.confidence_level),
        last_attempt_code = COALESCE($7, user_question_progress.last_attempt_code),
        attempts_count = user_question_progress.attempts_count + 1,
        updated_at = NOW()
      RETURNING *`,
      [
        user.id,
        questionId,
        status || "solved",
        solvedAt,
        personalNotes ?? null,
        confidenceLevel || 3,
        lastAttemptCode ?? null
      ]
    );

    // 3. Update daily_activity metrics if solved
    if (isSolved) {
      if (question.type === "dsa") {
        await query(
          `INSERT INTO daily_activity (user_id, activity_date, dsa_solved)
           VALUES ($1, $2, 1)
           ON CONFLICT (user_id, activity_date)
           DO UPDATE SET dsa_solved = daily_activity.dsa_solved + 1, updated_at = NOW()`,
          [user.id, todayStr]
        );
      } else if (question.type === "development") {
        await query(
          `INSERT INTO daily_activity (user_id, activity_date, dev_completed)
           VALUES ($1, $2, 1)
           ON CONFLICT (user_id, activity_date)
           DO UPDATE SET dev_completed = daily_activity.dev_completed + 1, updated_at = NOW()`,
          [user.id, todayStr]
        );
      }

      // Mark any open tasks linked to this question as complete
      await query(
        `UPDATE tasks
         SET is_completed = TRUE, completed_at = NOW(), updated_at = NOW()
         WHERE user_id = $1 AND related_question_id = $2 AND is_completed = FALSE`,
        [user.id, questionId]
      );
    }

    // 4. Handle revision scheduling
    if (scheduleRevision) {
      const revisionDate = new Date();
      revisionDate.setDate(revisionDate.getDate() + (body.revisionDays || 3));
      const revDateStr = revisionDate.toISOString().split("T")[0];

      await query(
        `INSERT INTO revision_schedules (user_id, question_id, scheduled_date, notes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [user.id, questionId, revDateStr, personalNotes || "Spaced repetition revision"]
      );
    }

    return NextResponse.json({
      message: `Progress updated for "${question.title}"`,
      progress: progressRes.rows[0]
    });
  } catch (error: any) {
    console.error("Update Question Progress Error:", error);
    return NextResponse.json(
      { error: "Failed to update question progress." },
      { status: 500 }
    );
  }
}
