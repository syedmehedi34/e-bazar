// app/api/blogs/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Blog from "../../../../models/Blogs";

/* ── GET /api/blogs ──────────────────────────────────────── */
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      { message: "All blogs fetched successfully", blogs },
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

/* ── POST /api/blogs ─────────────────────────────────────── */
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();

    const {
      title,
      category,
      author,
      date,
      image,
      imagePublicId,
      shortDescription,
      tags,
      content,
    } = body;

    if (
      !title ||
      !category ||
      !author ||
      !date ||
      !image ||
      !shortDescription ||
      !content?.length
    ) {
      return NextResponse.json(
        {
          error:
            "title, category, author, date, image, shortDescription and content are all required",
        },
        { status: 400 },
      );
    }

    const blog = await Blog.create({
      title,
      category,
      author,
      date,
      image,
      imagePublicId: imagePublicId ?? "",
      shortDescription,
      tags: tags ?? [],
      content,
    });

    console.log("✅ Blog created:", JSON.stringify(blog, null, 2));

    return NextResponse.json(
      { message: "Blog created successfully", blog },
      { status: 201 },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: msg },
      { status: 500 },
    );
  }
}
