import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { saveStoreSettings } from "@/lib/db/store-settings";
import {
  getMongoConnectionErrorMessage,
  isMongoConfigured,
} from "@/lib/mongodb";
import { sanitizeStoreSettingsForSave } from "@/lib/store-settings-utils";
import type { StoreSettings } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured. Add MONGODB_URI to your environment." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as Partial<StoreSettings>;
    const settings = sanitizeStoreSettingsForSave(body);
    await saveStoreSettings(settings);

    return NextResponse.json({
      ok: true,
      settings,
    });
  } catch (error) {
    console.error("Failed to save store settings:", error);

    return NextResponse.json(
      { error: getMongoConnectionErrorMessage(error) },
      { status: 500 }
    );
  }
}
