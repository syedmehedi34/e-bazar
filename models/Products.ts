import mongoose, { Schema, Document } from "mongoose";

type Review = {
  user: string;
  rating: number;
  comment: string;
  createdAt?: Date;
};

export type IProduct = Document & {
  // ── Core ──────────────────────────
  title: string;
  description: string;
  images: string[];

  // ── Pricing ───────────────────────
  price: number;
  discountPrice: number;
  costPrice: number; // buying price for admin dashboard
  currency: string;

  // ── Classification ────────────────
  category: string;
  subCategory: string;
  brand: string;
  tags: string[];
  sku: string;

  // ── Variants ──────────────────────
  sizes: string[];
  colors: string[];

  // ── Inventory ─────────────────────
  stock: number;
  totalSold: number;
  status: "active" | "inactive" | "out-of-stock" | "discontinued";

  // ── Shipping ──────────────────────
  weight: number;
  dimensions: { length: number; width: number; height: number };
  freeShipping: boolean;
  countryOfOrigin: string;

  // ── Details ───────────────────────
  specifications: { key: string; value: string }[]; // Product detail
  warranty: string;
  featured: boolean; // Featured Products for homepage

  // ── Ratings ───────────────────────
  averageRating: number;
  reviews: Review[];

  createdAt: Date;
  updatedAt: Date;
};

const reviewSchema = new Schema<Review>(
  {
    user: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const productsSchema = new Schema<IProduct>(
  {
    // ── Core ──────────────────────────
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },

    // ── Pricing ───────────────────────
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    currency: { type: String, default: "BDT" },

    // ── Classification ────────────────
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    sku: { type: String, unique: true, sparse: true, trim: true },

    // ── Variants ──────────────────────
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },

    // ── Inventory ─────────────────────
    stock: { type: Number, required: true },
    totalSold: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock", "discontinued"],
      default: "active",
    },

    // ── Shipping ──────────────────────
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    freeShipping: { type: Boolean, default: false },
    countryOfOrigin: { type: String, default: "" },

    // ── Details ───────────────────────
    specifications: {
      type: [{ key: String, value: String }],
      default: [],
    },
    warranty: { type: String, default: "" },
    featured: { type: Boolean, default: false },

    // ── Ratings ───────────────────────
    averageRating: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────
productsSchema.index({ category: 1 });
productsSchema.index({ subCategory: 1 });
productsSchema.index({ status: 1 });
productsSchema.index({ featured: -1 });
productsSchema.index({ averageRating: -1 });
productsSchema.index({ totalSold: -1 });
productsSchema.index({ title: "text", description: "text", tags: "text" });

const Products =
  mongoose.models.Products ||
  mongoose.model<IProduct>("Products", productsSchema);

export default Products;
