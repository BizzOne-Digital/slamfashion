"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "products" | "brand" | "collections";
  hint?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = "products",
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (!data.url) {
        throw new Error("Upload failed");
      }

      onChange(data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed"
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const previewSrc = value.trim();

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wider uppercase text-white/40 mb-2">
        {label}
      </label>

      {previewSrc && (
        <div className="relative mb-3 h-28 w-28 overflow-hidden rounded-lg border border-white/10 bg-surface-light">
          <Image
            src={previewSrc}
            alt=""
            fill
            className="object-cover"
            sizes="112px"
            unoptimized={previewSrc.startsWith("/")}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading..." : "Upload from computer"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleUpload}
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/images/products/photo.jpg or https://..."
          className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2.5 text-sm text-white focus:border-gold/50 focus:outline-none"
        />
      </div>

      {hint && <p className="mt-2 text-xs text-white/30">{hint}</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
