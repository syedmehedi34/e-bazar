import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Blog from "../../../../models/Blogs";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        message: "All blogs fetched successfully",
        blogs,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error fetching blogs:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 },
    );
  }
}
