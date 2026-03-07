import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Products from "../../../../models/Products";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    //
    const products = await Products.find();

    return NextResponse.json(
      { message: "Products fetched successfully", data: products },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 },
    );
  }
}
