import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

const reflectionSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  notes: z.string().max(2000)
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reflectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { date, notes } = parsed.data;

    await query(
      `INSERT INTO daily_activity (user_id, activity_date, reflection_notes)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, activity_date)
       DO UPDATE SET reflection_notes = $3, updated_at = NOW()`,
      [user.id, date, notes]
    );

    return NextResponse.json({ message: "Daily reflection saved successfully", date, notes });
  } catch (error: any) {
    console.error("Save Reflection Error:", error);
    return NextResponse.json({ error: "Failed to save reflection." }, { status: 500 });
  }
}
