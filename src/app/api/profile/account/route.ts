import { NextResponse } from "next/server";
import { getCurrentUser, clearSessionCookie } from "@/lib/auth";
import { query } from "@/lib/db";

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cascade delete user
    await query("DELETE FROM users WHERE id = $1", [user.id]);
    await clearSessionCookie();

    return NextResponse.json({ message: "Account deleted successfully." });
  } catch (error: any) {
    console.error("Delete Account Error:", error);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
