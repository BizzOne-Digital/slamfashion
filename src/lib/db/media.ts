import { GridFSBucket, ObjectId } from "mongodb";
import {
  getClientPromise,
  getMongoConnectionErrorMessage,
  getMongoDbName,
  isMongoConfigured,
} from "@/lib/mongodb";

const BUCKET_NAME = "media";

export function getMediaUrl(fileId: string): string {
  return `/api/media/${fileId}`;
}

export async function uploadMedia(
  buffer: Buffer,
  originalName: string,
  contentType: string,
  folder: string
): Promise<string> {
  if (!isMongoConfigured()) {
    throw new Error(
      "Database is not configured. Add MONGODB_URI to your environment file."
    );
  }

  const client = await getClientPromise();
  const bucket = new GridFSBucket(client.db(getMongoDbName()), {
    bucketName: BUCKET_NAME,
  });

  const safeName = originalName.replace(/[^\w.-]+/g, "_") || "image";
  const filename = `${folder}/${Date.now()}-${safeName}`;

  const fileId = await new Promise<ObjectId>((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      metadata: {
        folder,
        contentType,
        originalName,
      },
    });

    stream.on("error", reject);
    stream.on("finish", () => resolve(stream.id as ObjectId));
    stream.end(buffer);
  });

  return getMediaUrl(fileId.toString());
}

export async function getMediaFile(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const client = await getClientPromise();
  const bucket = new GridFSBucket(client.db(getMongoDbName()), {
    bucketName: BUCKET_NAME,
  });
  const objectId = new ObjectId(id);
  const files = await bucket.find({ _id: objectId }).toArray();

  if (!files.length) {
    return null;
  }

  const file = files[0];
  const metadata = file.metadata as { contentType?: string } | undefined;

  return {
    stream: bucket.openDownloadStream(objectId),
    contentType: metadata?.contentType || "application/octet-stream",
  };
}

export function getMediaUploadErrorMessage(error: unknown): string {
  return getMongoConnectionErrorMessage(error);
}
