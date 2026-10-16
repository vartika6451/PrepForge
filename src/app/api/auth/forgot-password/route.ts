import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { query } from "@/lib/db";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const userRes = await query("SELECT id, name FROM users WHERE email = $1", [email]);

    if (userRes.rowCount === 0) {
      // Return positive message to prevent user enumeration attacks
      return NextResponse.json({
        message: "If an account exists with this email, a password reset link has been dispatched."
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await query(
      `UPDATE users
       SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour'
       WHERE email = $2`,
      [token, email]
    );

    // Development reset link preview for seamless testing
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    return NextResponse.json({
      message: "Password reset instructions have been generated.",
      resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined
    });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
