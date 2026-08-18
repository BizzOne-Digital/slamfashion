import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import {
  getMongoConnectionCandidates,
  isMongoConfigured,
  testMongoConnection,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message:
        "Database is not configured. Add MongoDB settings to your environment file.",
      candidates: 0,
    });
  }

  const result = await testMongoConnection();

  return NextResponse.json({
    ok: result.ok,
    configured: true,
    message: result.message,
    candidates: getMongoConnectionCandidates().length,
  });
}
