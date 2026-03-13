// app/api/products/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "../../../../../lib/mongodb";
import Products from "../../../../../models/Products";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ── Extract Cloudinary public_id from secure_url ────── */
function extractPublicId(url: string): string | null {
  try {
    // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/e-catalog/products/abc.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

// ── GET /api/products/[id] ────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await Products.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product fetched successfully", product },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error fetching product:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 },
    );
  }
}

// ── PATCH /api/products/[id] ──────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "title",
      "description",
      "price",
      "discountPrice",
      "costPrice",
      "stock",
      "status",
      "category",
      "subCategory",
      "brand",
      "tags",
      "sizes",
      "colors",
      "images",
      "featured",
      "freeShipping",
      "warranty",
      "weight",
      "countryOfOrigin",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await Products.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/products/[id] ─────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // ── Delete all images from Cloudinary ─────────────
    const imageUrls: string[] = Array.isArray(product.images)
      ? product.images
      : [];

    if (imageUrls.length > 0) {
      const publicIds = imageUrls
        .map(extractPublicId)
        .filter((pid): pid is string => pid !== null);

      if (publicIds.length > 0) {
        // delete_resources handles up to 100 IDs at once — non-blocking
        cloudinary.api.delete_resources(publicIds).catch((err) => {
          console.warn(
            "Cloudinary image cleanup warning:",
            err?.message ?? err,
          );
        });
      }
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
