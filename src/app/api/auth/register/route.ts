import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { fullName, email, password } = parsed.data;

    // Check if user already exists
    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    // Create user in transaction
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, provider, email_verified)
       VALUES ($1, $2, $3, 'local', TRUE)
       RETURNING id, name, email, avatar_url`,
      [fullName, email, passwordHash]
    );

    const user = userResult.rows[0];

    // Create default profile
    await query(
      `INSERT INTO profiles (user_id, full_name, onboarding_completed)
       VALUES ($1, $2, FALSE)`,
      [user.id, fullName]
    );

    // Create default user preferences
    await query(
      `INSERT INTO user_preferences (user_id, theme, email_notifications, task_reminders, streak_alerts)
       VALUES ($1, 'dark', TRUE, TRUE, TRUE)`,
      [user.id]
    );

    // Create initial welcome notification
    await query(
      `INSERT INTO notifications (user_id, title, message, type, link_url)
       VALUES ($1, 'Welcome to PrepForge! 🚀', 'Your developer interview prep journey starts here. Complete your onboarding to generate your personalized study plan.', 'system', '/onboarding')`,
      [user.id]
    );

    // Generate JWT token & set secure HTTP-only session cookie
    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email
    });
    await setSessionCookie(token, false);

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          onboardingCompleted: false
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating your account. Please try again." },
      { status: 500 }
    );
  }
}
