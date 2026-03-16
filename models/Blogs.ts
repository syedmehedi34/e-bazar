import mongoose, { Schema, Document } from "mongoose";

type BlogComment = { user: string; comment: string; date: string };

export type IBlog = Document & {
  title: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  image: string;
  imagePublicId: string; // ← Cloudinary publicId for image deletion
  shortDescription: string;
  content: { paragraph: string }[];
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
};

const contentParagraphSchema = new Schema(
  { paragraph: { type: String, required: true, trim: true } },
  { _id: false },
);
const commentSchema = new Schema<BlogComment>(
  {
    user: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    date: { type: String, required: true },
  },
  { _id: false },
);

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    author: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" }, // ← stores Cloudinary publicId
    shortDescription: { type: String, required: true, trim: true },
    content: { type: [contentParagraphSchema], default: [] },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true },
);

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
