import { NextResponse } from "next/server";
import { Readable } from "stream";
import { getMediaFile } from "@/lib/db/media";
import { isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const media = await getMediaFile(id);

    if (!media) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const webStream = Readable.toWeb(media.stream);

    return new NextResponse(webStream as ReadableStream, {
      headers: {
        "Content-Type": media.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to load media:", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
