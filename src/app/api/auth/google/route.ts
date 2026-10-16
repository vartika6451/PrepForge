import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (supabaseUrl && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // If Supabase is configured, redirect to Supabase OAuth provider
    return NextResponse.redirect(
      `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`
      )}`
    );
  }

  if (googleClientId) {
    // Direct Google OAuth flow
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

    return NextResponse.redirect(googleAuthUrl);
  }

  // If OAuth credentials are not provided in environment, inform user with instructions
  return NextResponse.json(
    {
      configured: false,
      message:
        "Google OAuth is ready to connect. To enable Google Sign-In, please configure NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY (for Supabase Auth) or GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in your .env.local file. Meanwhile, you can register and sign in seamlessly with Email & Password."
    },
    { status: 503 }
  );
}
