import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[0-9]/, "New password must contain at least one number"),
    confirmPassword: z.string()
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"]
  });

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    // Fetch user password hash
    const userRes = await query("SELECT password_hash FROM users WHERE id = $1", [user.id]);
    const hash = userRes.rows[0]?.password_hash;

    if (!hash) {
      return NextResponse.json(
        { error: "This account uses OAuth login and does not have a local password." },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
      newHash,
      user.id
    ]);

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: any) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}
