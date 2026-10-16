import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { query } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "prepforge-default-fallback-secret-key-32chars!"
);

const SESSION_COOKIE_NAME = "prepforge_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  onboardingCompleted: boolean;
}

// 1. Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 2. JWT Session generation
export async function createSessionToken(
  user: { id: string; name: string; email: string },
  rememberMe: boolean = false
): Promise<string> {
  const expiresIn = rememberMe ? "30d" : "7d";
  return new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<{
  id: string;
  name: string;
  email: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub || !payload.email) return null;
    return {
      id: payload.sub as string,
      name: (payload.name as string) || "",
      email: payload.email as string
    };
  } catch {
    return null;
  }
}

// 3. Cookie management
export async function setSessionCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// 4. Retrieve current authenticated user from session & database
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    const result = await query(
      `SELECT u.id, u.name, u.email, u.avatar_url, 
              COALESCE(p.onboarding_completed, FALSE) as onboarding_completed
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [payload.id]
    );

    if (result.rowCount === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar_url,
      onboardingCompleted: row.onboarding_completed
    };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_") || err?.digest === "HANGING_PROMISE_REJECTION") {
      throw err;
    }
    return null;
  }
}
