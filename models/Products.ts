import mongoose, { Schema, Document } from "mongoose";

// Review type
type Review = {
  user: string;
  rating: number;
  comment: string;
};

// Product type
export type IProduct = Document & {
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  currency: string;
  category: string;
  subCategory: string;
  brand: string;
  rating: number;
  stock: number;
  featured: boolean;
  sizes: string[];
  images: string[];
  reviews: Review[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Sub-schema for reviews
const reviewSchema = new Schema<Review>(
  {
    user: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Main Products schema
const productsSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    currency: { type: String, required: true, default: "BDT" },
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    reviews: { type: [reviewSchema], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Indexes for faster queries
// productsSchema.index({ category: 1 });
// productsSchema.index({ subCategory: 1 });
// productsSchema.index({ status: 1 });
// productsSchema.index({ featured: -1 });

// Export Mongoose model
const Products =
  mongoose.models.Products ||
  mongoose.model<IProduct>("Products", productsSchema);

export default Products;
