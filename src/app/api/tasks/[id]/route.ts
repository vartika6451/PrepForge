import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await req.json();

    // Verify ownership
    const taskRes = await query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, user.id]
    );

    if (taskRes.rowCount === 0) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const currentTask = taskRes.rows[0];

    // Handle toggling completion status
    if (body.isCompleted !== undefined) {
      const isCompleted = Boolean(body.isCompleted);
      const actualMinutes = body.actualMinutes || currentTask.estimated_minutes || 45;
      const todayStr = new Date().toISOString().split("T")[0];
      const completionDate = currentTask.due_date || todayStr;

      if (isCompleted) {
        // Mark complete
        await query(
          `UPDATE tasks
           SET is_completed = TRUE, completed_at = NOW(), updated_at = NOW()
           WHERE id = $1`,
          [taskId]
        );

        // Record in immutable task_completions history
        await query(
          `INSERT INTO task_completions (task_id, user_id, completion_date, actual_minutes, notes)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (task_id, completion_date)
           DO UPDATE SET actual_minutes = $4, completed_at = NOW()`,
          [taskId, user.id, completionDate, actualMinutes, body.notes || ""]
        );

        // Update aggregated daily_activity
        await query(
          `INSERT INTO daily_activity (user_id, activity_date, tasks_completed, study_minutes)
           VALUES ($1, $2, 1, $3)
           ON CONFLICT (user_id, activity_date)
           DO UPDATE SET 
             tasks_completed = daily_activity.tasks_completed + 1,
             study_minutes = daily_activity.study_minutes + $3,
             updated_at = NOW()`,
          [user.id, completionDate, actualMinutes]
        );

        // If related to a question, update user_question_progress
        if (currentTask.related_question_id) {
          const statusVal = currentTask.category === "dsa" ? "solved" : "mastered";
          await query(
            `INSERT INTO user_question_progress (user_id, question_id, status, solved_at, attempts_count)
             VALUES ($1, $2, $3, NOW(), 1)
             ON CONFLICT (user_id, question_id)
             DO UPDATE SET status = $3, solved_at = NOW(), attempts_count = user_question_progress.attempts_count + 1`,
            [user.id, currentTask.related_question_id, statusVal]
          );

          // If DSA, update dsa_solved in daily_activity
          if (currentTask.category === "dsa") {
            await query(
              `UPDATE daily_activity SET dsa_solved = dsa_solved + 1 WHERE user_id = $1 AND activity_date = $2`,
              [user.id, completionDate]
            );
          } else if (currentTask.category === "development") {
            await query(
              `UPDATE daily_activity SET dev_completed = dev_completed + 1 WHERE user_id = $1 AND activity_date = $2`,
              [user.id, completionDate]
            );
          }
        }
      } else {
        // Mark incomplete
        await query(
          `UPDATE tasks
           SET is_completed = FALSE, completed_at = NULL, updated_at = NOW()
           WHERE id = $1`,
          [taskId]
        );

        // Remove from task_completions
        await query(
          "DELETE FROM task_completions WHERE task_id = $1 AND user_id = $2",
          [taskId, user.id]
        );

        // Adjust daily_activity
        await query(
          `UPDATE daily_activity
           SET tasks_completed = GREATEST(0, tasks_completed - 1),
               study_minutes = GREATEST(0, study_minutes - $3),
               updated_at = NOW()
           WHERE user_id = $1 AND activity_date = $2`,
          [user.id, completionDate, actualMinutes]
        );
      }
    }

    // Handle rescheduling / updating fields
    if (body.dueDate || body.title || body.priority || body.estimatedMinutes) {
      const newDueDate = body.dueDate || currentTask.due_date;
      const newTitle = body.title || currentTask.title;
      const newPriority = body.priority || currentTask.priority;
      const newEst = body.estimatedMinutes || currentTask.estimated_minutes;

      await query(
        `UPDATE tasks
         SET due_date = $1, title = $2, priority = $3, estimated_minutes = $4, updated_at = NOW()
         WHERE id = $5`,
        [newDueDate, newTitle, newPriority, newEst, taskId]
      );
    }

    const updatedTask = await query("SELECT * FROM tasks WHERE id = $1", [taskId]);
    return NextResponse.json({ task: updatedTask.rows[0] });
  } catch (error: any) {
    console.error("PATCH Task Error:", error);
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    await query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [taskId, user.id]);

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Task Error:", error);
    return NextResponse.json({ error: "Failed to delete task." }, { status: 500 });
  }
}
