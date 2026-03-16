// app/api/blogs/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import Blog from "../../../../../models/Blogs";

/* ── GET /api/blogs/[id] ─────────────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  try {
    const { id } = await params;
    const blog = await Blog.findById(id).lean();
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: msg },
      { status: 500 },
    );
  }
}

/* ── PATCH /api/blogs/[id] ───────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();

    const IMMUTABLE = new Set(["_id", "createdAt", "__v"]);
    const update: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(body)) {
      if (!IMMUTABLE.has(field) && value !== undefined) update[field] = value;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: "after" },
    ).lean();
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    console.log("✅ Blog updated:", JSON.stringify(blog, null, 2));

    return NextResponse.json(
      { message: "Blog updated successfully", blog },
      { status: 200 },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: msg },
      { status: 500 },
    );
  }
}

/* ── DELETE /api/blogs/[id] ──────────────────────────────── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  try {
    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id).lean();
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: msg },
      { status: 500 },
    );
  }
}
