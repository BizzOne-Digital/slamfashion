import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_OPTIONS,
  createSessionToken,
  isAuthConfigured,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    const isProduction = process.env.NODE_ENV === "production";
    return NextResponse.json(
      {
        error: isProduction
          ? "Admin login is not configured on the server. In Vercel: Project → Settings → Environment Variables, add ADMIN_PASSWORD and ADMIN_SECRET, then redeploy."
          : "Admin login is not configured. Add ADMIN_PASSWORD to .env.local in the project root, then restart the dev server (npm run dev).",
      },
      { status: 503 }
    );
  }

  try {
    const { password } = (await request.json()) as { password?: string };

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
