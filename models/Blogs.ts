import mongoose, { Schema, Document } from "mongoose";

// Comment sub-type (inside blog)
type BlogComment = {
  user: string;
  comment: string;
  date: string;
};

// Blog post type
export type IBlog = Document & {
  title: string;
  category: string;
  tags: string[];
  author: string;
  date: string; // publication date as string (e.g. "2024-11-14")
  image: string; // main cover image URL
  shortDescription: string;
  content: { paragraph: string }[]; // array of paragraph objects
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
};

// Sub-schema for content paragraphs
const contentParagraphSchema = new Schema(
  {
    paragraph: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Sub-schema for comments
const commentSchema = new Schema<BlogComment>(
  {
    user: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // or change to Date if you prefer
  },
  { _id: false },
);

// Main Blog schema
const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    author: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // e.g. "2024-11-14"
    image: { type: String, required: true },
    shortDescription: { type: String, required: true, trim: true },
    content: { type: [contentParagraphSchema], default: [] },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true },
);

// Useful indexes
// blogSchema.index({ category: 1 });
// blogSchema.index({ tags: 1 });
// blogSchema.index({ date: -1 });
// blogSchema.index({ createdAt: -1 });

// Export model
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
