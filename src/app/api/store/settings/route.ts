import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/db/store-settings";
import {
  getMongoConnectionErrorMessage,
  isMongoConfigured,
} from "@/lib/mongodb";
import { DEFAULT_SETTINGS } from "@/data/defaults";
import type { StoreSettings } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type StoreSettingsResponse = {
  settings: StoreSettings;
  source: "database" | "defaults";
  warning?: string;
};

export async function GET() {
  const headers = {
    "Cache-Control": "no-store",
  };

  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        settings: DEFAULT_SETTINGS,
        source: "defaults",
        warning:
          "Database is not configured. Add MONGODB_URI to your environment file.",
      } satisfies StoreSettingsResponse,
      { headers }
    );
  }

  try {
    const settings = await getStoreSettings();

    return NextResponse.json(
      {
        settings,
        source: "database",
      } satisfies StoreSettingsResponse,
      { headers }
    );
  } catch (error) {
    console.error("Failed to load store settings:", error);

    return NextResponse.json(
      {
        settings: DEFAULT_SETTINGS,
        source: "defaults",
        warning: getMongoConnectionErrorMessage(error),
      } satisfies StoreSettingsResponse,
      { headers }
    );
  }
}
