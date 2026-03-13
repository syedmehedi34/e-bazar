// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ─── POST /api/upload — upload a single image ─────── */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "e-catalog/products",
      transformation: [
        { width: 1000, height: 1000, crop: "limit", quality: "auto" },
      ],
    });

    return NextResponse.json(
      { url: result.secure_url, publicId: result.public_id },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Upload error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

/* ─── DELETE /api/upload — delete image by publicId ── */
export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = (await req.json()) as { publicId: string };

    if (!publicId) {
      return NextResponse.json(
        { message: "publicId is required" },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Delete error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
