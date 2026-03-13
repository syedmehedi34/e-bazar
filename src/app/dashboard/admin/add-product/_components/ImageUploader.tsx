// app/dashboard/admin/add-product/_components/ImageUploader.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { Upload, Loader2, X } from "lucide-react";
import type { PreviewImage } from "./types";

type Props = {
  onChange: (urls: string[]) => void;
};

/* ── Cloudinary upload via our secure API route ─────── */
async function uploadToCloudinary(
  file: File,
): Promise<{ url: string; publicId: string }> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Upload failed");
  return { url: data.url as string, publicId: data.publicId as string };
}

/* ── Delete from Cloudinary via our API route ───────── */
async function deleteFromCloudinary(publicId: string): Promise<void> {
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
}

/* ── Component ──────────────────────────────────────── */
const ImageUploader = ({ onChange }: Props) => {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync final cloudinary URLs to parent AFTER render (never during)
  useEffect(() => {
    const urls = previews.filter((p) => !p.loading && p.url).map((p) => p.url);
    onChange(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  /* ── Handle file selection / drop ─────────────────── */
  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);

    const valid = arr.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name}: not an image`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: exceeds 5 MB limit`);
        return false;
      }
      return true;
    });

    if (!valid.length) return;

    if (previews.length + valid.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }

    // Give each file a stable ID so async callbacks can find it
    const entries = valid.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      objectUrl: URL.createObjectURL(f),
    }));

    // Show placeholders immediately for instant feedback
    setPreviews((prev) => [
      ...prev,
      ...entries.map((e) => ({
        id: e.id,
        objectUrl: e.objectUrl,
        url: "",
        publicId: "",
        loading: true,
      })),
    ]);

    // Upload all in parallel
    await Promise.all(
      entries.map(async ({ id, file }) => {
        try {
          const { url, publicId } = await uploadToCloudinary(file);
          setPreviews((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, url, publicId, loading: false } : p,
            ),
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          toast.error(`${file.name}: ${msg}`);
          setPreviews((prev) => prev.filter((p) => p.id !== id));
        }
      }),
    );
  };

  /* ── Remove image + delete from Cloudinary ─────────── */
  const removeImage = async (idx: number) => {
    const target = previews[idx];

    // Optimistic UI — remove immediately
    setPreviews((prev) => prev.filter((_, i) => i !== idx));

    // Fire-and-forget Cloudinary delete (non-blocking)
    if (target?.publicId) {
      deleteFromCloudinary(target.publicId).catch(() => {
        // Silent fail — orphan images are acceptable; can be cleaned up in Cloudinary dashboard
      });
    }
  };

  /* ── Drag handlers ─────────────────────────────────── */
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const uploadedCount = previews.filter((p) => !p.loading).length;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Upload images"
        className={[
          "flex flex-col items-center justify-center gap-3 p-6 rounded-xl",
          "border-2 border-dashed cursor-pointer transition-all duration-200",
          dragOver
            ? "border-teal-400 bg-teal-50 dark:bg-teal-500/8"
            : "border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50",
        ].join(" ")}
      >
        <div
          className={[
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            dragOver
              ? "bg-teal-100 dark:bg-teal-500/15"
              : "bg-gray-100 dark:bg-gray-800",
          ].join(" ")}
        >
          <Upload
            size={18}
            className={dragOver ? "text-teal-500" : "text-gray-400"}
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drop images here or <span className="text-teal-500">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            PNG, JPG, WEBP — max 5 MB each, up to 8 images
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Preview grid */}
      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {previews.map((img, i) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-xl overflow-hidden
                           ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.objectUrl}
                  alt={`Product image ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Uploading overlay */}
                {img.loading && (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5">
                    <Loader2 size={20} className="text-white animate-spin" />
                    <p className="text-[10px] text-white/80 font-medium">
                      Uploading…
                    </p>
                  </div>
                )}

                {/* Main badge on first uploaded image */}
                {!img.loading && i === 0 && (
                  <span
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px]
                                   font-bold bg-teal-500 text-white shadow-sm"
                  >
                    Main
                  </span>
                )}

                {/* Remove button */}
                {!img.loading && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full
                               bg-black/60 hover:bg-black/80 text-white
                               flex items-center justify-center
                               opacity-0 group-hover:opacity-100
                               transition-opacity duration-150"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-right">
            {uploadedCount} / 8 uploaded
          </p>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
