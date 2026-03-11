"use client";
import BlogsPageCard from "@/Components/Blogs/BlogsPageCard";
import { useFetchBlog } from "@/hook/useFetchBlog";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../loading";
import { Blog } from "@/types/blogsInterface";

const BlogPage = () => {
  // Assuming this hook fetches ALL blogs
  const { blogs, blogsLoading, blogsError } = useFetchBlog();

  // States for sidebar metadata (derived from all blogs)
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  // Compute sidebar data whenever blogs change
  useEffect(() => {
    if (!blogs || blogs.length === 0) return;

    const typedBlogs = blogs as unknown as Blog[];

    // Unique categories
    const categories = Array.from(
      new Set(typedBlogs.map((b) => b.category)),
    ).filter(Boolean) as string[];
    setAllCategories(categories);

    // Popular tags: count frequency and take top 5
    const tagCount: Record<string, number> = {};
    typedBlogs.forEach((blog: Blog) => {
      blog.tags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => `#${tag}`);

    setPopularTags(topTags);

    // Latest 4 blogs (sorted by createdAt descending)
    const sortedLatest = [...typedBlogs]
      .filter((blog) => blog.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
      )
      .slice(0, 4);

    setLatestBlogs(sortedLatest);
  }, [blogs]);

  if (blogsLoading) {
    return <Loader />;
  }

  if (blogsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">Error loading blogs</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:text-white">
      {/* Page Banner */}
      <nav
        className="relative w-full h-[220px] md:h-[320px] lg:h-[380px] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url("/blogs-hero.png")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/40 to-transparent" />

        <div className="relative z-10 text-center text-white px-6 py-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-2xl">
            Our Blogs
          </h2>
          <p className="mt-3 md:mt-5 text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-2xl mx-auto">
            Insights, tips, trends, and stories from the world of fashion and
            lifestyle
          </p>
        </div>
      </nav>

      <div className="container-custom py-8 px-3 sm:px-5 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 w-full">
            <BlogsPageCard blogs={(blogs as unknown as Blog[]) || []} />
            {/* Pagination removed as requested */}
          </div>

          <aside className="lg:col-span-2 w-full">
            {/* Search – removed as per your instruction */}

            {/* Fashion Categories */}
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 border-b pb-2">
                Fashion Categories
              </h2>
              <ul className="space-y-2 text-sm sm:text-base max-h-48 overflow-y-auto">
                {allCategories.length > 0 ? (
                  allCategories.map((cat) => (
                    <li
                      key={cat}
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {cat}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No categories found</li>
                )}
              </ul>
            </div>

            {/* Latest Blogs */}
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box mb-6">
              <h2 className="mb-4 text-lg sm:text-xl font-bold border-b pb-2">
                Latest Blogs
              </h2>
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog) => (
                  <div key={blog._id} className="flex gap-3 mb-4 items-start">
                    <Image
                      src={blog.image}
                      width={80}
                      height={80}
                      alt={blog.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm sm:text-base line-clamp-2 font-medium">
                        {blog.title}
                      </p>
                      <Link href={`/blogs/${blog._id}`}>
                        <button className="text-xs mt-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent blogs found</p>
              )}
            </div>

            {/* Popular Tags – top 5 */}
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box">
              <h2 className="text-lg sm:text-xl font-bold mb-3 border-b pb-2">
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.length > 0 ? (
                  popularTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No tags available
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
