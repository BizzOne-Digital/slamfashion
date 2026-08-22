import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveLocalImage(
  buffer: Buffer,
  folder: string,
  originalName: string
): Promise<string> {
  const extension = path.extname(originalName) || ".jpg";
  const baseName = path
    .basename(originalName, extension)
    .replace(/[^\w.-]+/g, "_")
    .slice(0, 80);
  const fileName = `${Date.now()}-${baseName || "image"}${extension}`;
  const directory = path.join(
    process.cwd(),
    "public",
    "images",
    "uploads",
    folder
  );

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), buffer);

  return `/images/uploads/${folder}/${fileName}`;
}
