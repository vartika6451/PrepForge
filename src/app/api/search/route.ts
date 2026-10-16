import { NextRequest, NextResponse } from "next/server";
import { searchGlobal } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const results = searchGlobal(q);

  return NextResponse.json({
    query: q,
    count: results.length,
    results
  });
}
