import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Products from "../../../../models/Products";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    // ── Query parameters ────────────────────────────────────────
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || ""; // main category
    const subCategory = searchParams.get("subCategory") || ""; // sub category
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
    const sortParam = searchParams.get("sort") || "";

    // ── Build product filter query ─────────────────────────────
    const productQuery: Record<string, unknown> = {};

    // Text search in title or description
    if (search) {
      productQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      productQuery.category = category;
    }

    // SubCategory filter (only applied if category is also selected or independently)
    if (subCategory) {
      productQuery.subCategory = subCategory;
    }

    // Price range
    if (minPrice > 0 || maxPrice < Infinity) {
      productQuery.price = {};
      const priceQuery = productQuery.price as Record<string, number>;
      if (minPrice > 0) priceQuery.$gte = minPrice;
      if (maxPrice < Infinity) priceQuery.$lte = maxPrice;
    }

    // ── Sorting logic ───────────────────────────────────────────
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest first

    if (sortParam) {
      switch (sortParam) {
        case "price-low":
          sortObj = { price: 1 };
          break;
        case "price-high":
          sortObj = { price: -1 };
          break;
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "rating":
          sortObj = { rating: -1 };
          break;
        // case "name-asc": sortObj = { title: 1 }; break;
        // case "name-desc": sortObj = { title: -1 }; break;
        default:
          sortObj = { createdAt: -1 };
      }
    }

    // ── Fetch filtered & sorted products ───────────────────────
    const products = await Products.find(productQuery).sort(sortObj).lean();

    // ── Get grouped categories + subcategories ─────────────────
    const categoryGroups = await Products.aggregate([
      {
        $group: {
          _id: "$category", // group by main category
          subCategories: { $addToSet: "$subCategory" }, // collect unique subcategory
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          subCategories: {
            $sortArray: { input: "$subCategories", sortBy: 1 }, // alphabetical
          },
        },
      },
      { $sort: { name: 1 } }, // main categories alphabetical
    ]);

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products,
        categories: categoryGroups, // [ { name, subCategories } ]
      },
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
