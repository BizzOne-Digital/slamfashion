import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getMediaUploadErrorMessage, uploadMedia } from "@/lib/db/media";
import { saveLocalImage } from "@/lib/local-uploads";
import { isMongoConfigured } from "@/lib/mongodb";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_FOLDERS = new Set(["products", "brand", "collections"]);

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const folderRaw = formData.get("folder");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Use JPG, PNG, WEBP, or GIF.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 5MB.",
        },
        { status: 400 }
      );
    }

    const folder =
      typeof folderRaw === "string" && ALLOWED_FOLDERS.has(folderRaw)
        ? folderRaw
        : "products";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isMongoConfigured()) {
      try {
        const mongoUrl = await uploadMedia(buffer, file.name, file.type, folder);
        return NextResponse.json({ url: mongoUrl, storage: "mongodb" });
      } catch (error) {
        console.warn("MongoDB upload failed, using local file:", error);
      }
    }

    const localUrl = await saveLocalImage(buffer, folder, file.name);
    return NextResponse.json({ url: localUrl, storage: "local" });
  } catch (error) {
    console.error("Upload failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error && !isMongoConfigured()
            ? error.message
            : getMediaUploadErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
