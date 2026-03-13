import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Products from "../../../../models/Products";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const subCategory = searchParams.get("subCategory") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
    const sortParam = searchParams.get("sort") || "";

    const productQuery: Record<string, unknown> = {};

    if (search) {
      productQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) productQuery.category = category;
    if (subCategory) productQuery.subCategory = subCategory;

    if (minPrice > 0 || maxPrice < Infinity) {
      productQuery.price = {};
      const priceQuery = productQuery.price as Record<string, number>;
      if (minPrice > 0) priceQuery.$gte = minPrice;
      if (maxPrice < Infinity) priceQuery.$lte = maxPrice;
    }

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };

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
        default:
          sortObj = { createdAt: -1 };
      }
    }

    const products = await Products.find(productQuery).sort(sortObj).lean();

    const categoryGroups = await Products.aggregate([
      {
        $group: {
          _id: "$category",
          subCategories: { $addToSet: "$subCategory" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          subCategories: {
            $sortArray: { input: "$subCategories", sortBy: 1 },
          },
        },
      },
      { $sort: { name: 1 } },
    ]);

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products,
        categories: categoryGroups,
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

/* ─── POST /api/products ─────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Required field validation
    const requiredFields: { field: keyof typeof body; label: string }[] = [
      { field: "title", label: "Product title" },
      { field: "description", label: "Description" },
      { field: "price", label: "Price" },
      { field: "discountPrice", label: "Discount price" },
      { field: "category", label: "Category" },
      { field: "subCategory", label: "Sub-category" },
      { field: "brand", label: "Brand" },
      { field: "stock", label: "Stock quantity" },
    ];

    for (const { field, label } of requiredFields) {
      const val = body[field];
      if (val === undefined || val === null || val === "") {
        return NextResponse.json(
          { message: `${label} is required` },
          { status: 400 },
        );
      }
    }

    const productData = {
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      images: Array.isArray(body.images) ? body.images : [],
      price: Number(body.price),
      discountPrice: Number(body.discountPrice),
      costPrice: Number(body.costPrice) || 0,
      currency: body.currency || "BDT",
      category: String(body.category).trim(),
      subCategory: String(body.subCategory).trim(),
      brand: String(body.brand).trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      sku: body.sku ? String(body.sku).trim() : undefined,
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      stock: Number(body.stock),
      status: ["active", "inactive", "out-of-stock", "discontinued"].includes(
        body.status,
      )
        ? body.status
        : "active",
      weight: Number(body.weight) || 0,
      dimensions: {
        length: Number(body.dimensions?.length) || 0,
        width: Number(body.dimensions?.width) || 0,
        height: Number(body.dimensions?.height) || 0,
      },
      freeShipping: Boolean(body.freeShipping),
      countryOfOrigin: body.countryOfOrigin
        ? String(body.countryOfOrigin).trim()
        : undefined,
      specifications: Array.isArray(body.specifications)
        ? body.specifications.filter(
            (s: { key: string; value: string }) =>
              s.key?.trim() && s.value?.trim(),
          )
        : [],
      warranty: body.warranty ? String(body.warranty).trim() : undefined,
      featured: Boolean(body.featured),
    };

    if (productData.discountPrice > productData.price) {
      return NextResponse.json(
        { message: "Discount price cannot be greater than original price" },
        { status: 400 },
      );
    }

    const product = await Products.create(productData);

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);

    // Mongoose ValidationError
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as Record<string, unknown>).name === "ValidationError"
    ) {
      const ve = error as unknown as {
        errors: Record<string, { message: string }>;
      };
      const firstMsg = Object.values(ve.errors)[0]?.message;
      return NextResponse.json(
        { message: firstMsg || "Validation failed" },
        { status: 400 },
      );
    }

    // Duplicate key (e.g. SKU)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as Record<string, unknown>).code === 11000
    ) {
      return NextResponse.json(
        { message: "A product with this SKU already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
