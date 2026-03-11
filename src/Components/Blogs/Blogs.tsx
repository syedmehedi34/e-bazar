"use client";

import React from "react";
import BlogCard from "./BlogCard";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useFetchBlog } from "@/hook/useFetchBlog";
import Loader from "@/app/(main)/loading";
import { Blog } from "@/types/blogsInterface";

const Blogs = () => {
  const { blogs, blogsLoading } = useFetchBlog();
  const typedBlogs = (blogs as unknown as Blog[]) || [];

  if (blogsLoading) return <Loader />;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={13} className="text-teal-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
                From The Blog
              </p>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold
                           text-gray-900 dark:text-white tracking-tight rubik"
            >
              Latest Articles
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Tips, trends, and insights from the world of e-commerce and modern
              living.
            </p>
          </div>

          <Link
            href="/blogs"
            className="flex items-center gap-1.5 text-sm font-semibold
                       text-gray-500 dark:text-gray-400
                       hover:text-teal-500 dark:hover:text-teal-400
                       transition-colors duration-200 group whitespace-nowrap"
          >
            All articles
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* ── Cards ── */}
        {typedBlogs.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-600">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No articles yet.</p>
          </div>
        ) : (
          <>
            <BlogCard blogs={typedBlogs} />

            <div className="mt-12 flex justify-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl
                           text-sm font-bold rubik
                           bg-gray-900 dark:bg-gray-100
                           text-white dark:text-gray-900
                           hover:bg-gray-700 dark:hover:bg-white
                           transition-all duration-200 shadow-sm"
              >
                See More Articles
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Blogs;
