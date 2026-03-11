// app/api/products/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../../lib/mongodb";
import Products from "../../../../../models/Products";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = await params;

    // valid MongoDB ObjectId কিনা check
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
      {
        message: "Product fetched successfully",
        product,
      },
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
