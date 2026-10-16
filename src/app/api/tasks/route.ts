import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const createTaskSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  description: z.string().optional(),
  category: z.enum(["dsa", "development", "core_cs", "sql", "system_design", "custom"]),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  estimatedMinutes: z.number().min(5).max(480).default(45),
  dueDate: z.string(), // YYYY-MM-DD
  repeatDays: z.array(z.string()).optional(),
  relatedQuestionId: z.string().optional()
});

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // all, completed, pending

    let sql = `
      SELECT t.id, t.title, t.description, t.category, t.priority,
             t.estimated_minutes, t.due_date, t.is_completed, t.completed_at,
             t.repeat_days, t.related_question_id,
             q.difficulty as question_difficulty,
             q.platform as question_platform,
             q.external_url as question_url,
             q.type as question_type
      FROM tasks t
      LEFT JOIN questions q ON q.id = t.related_question_id
      WHERE t.user_id = $1
    `;
    const params: any[] = [user.id];
    let paramIndex = 2;

    if (startDate) {
      sql += ` AND t.due_date >= $${paramIndex++}`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND t.due_date <= $${paramIndex++}`;
      params.push(endDate);
    }
    if (category && category !== "all") {
      sql += ` AND t.category = $${paramIndex++}`;
      params.push(category);
    }
    if (status === "completed") {
      sql += ` AND t.is_completed = TRUE`;
    } else if (status === "pending") {
      sql += ` AND t.is_completed = FALSE`;
    }

    sql += ` ORDER BY t.due_date ASC, 
             CASE t.priority 
               WHEN 'urgent' THEN 1 
               WHEN 'high' THEN 2 
               WHEN 'medium' THEN 3 
               ELSE 4 
             END ASC,
             t.created_at ASC`;

    const result = await query(sql, params);
    return NextResponse.json({ tasks: result.rows });
  } catch (error: any) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      category,
      priority,
      estimatedMinutes,
      dueDate,
      repeatDays,
      relatedQuestionId
    } = parsed.data;

    const result = await query(
      `INSERT INTO tasks (
        user_id, title, description, category, priority, estimated_minutes, due_date, repeat_days, related_question_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        user.id,
        title,
        description || "",
        category,
        priority,
        estimatedMinutes,
        dueDate,
        repeatDays || null,
        relatedQuestionId || null
      ]
    );

    // Update planned tasks count in daily_activity
    await query(
      `INSERT INTO daily_activity (user_id, activity_date, tasks_planned)
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, activity_date)
       DO UPDATE SET tasks_planned = daily_activity.tasks_planned + 1, updated_at = NOW()`,
      [user.id, dueDate]
    );

    return NextResponse.json({ task: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("POST Task Error:", error);
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 });
  }
}
