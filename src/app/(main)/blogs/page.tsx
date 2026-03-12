"use client";
import BlogsPageCard from "@/Components/Blogs/BlogsPageCard";
import { useFetchBlog } from "@/hook/useFetchBlog";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../loading";
import { Blog } from "@/types/blogsInterface";
import { Tag, Clock, TrendingUp, ChevronRight, BookOpen } from "lucide-react";

const BlogPage = () => {
  const { blogs, blogsLoading, blogsError } = useFetchBlog();

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (!blogs || blogs.length === 0) return;
    const typedBlogs = blogs as unknown as Blog[];

    const categories = Array.from(
      new Set(typedBlogs.map((b) => b.category)),
    ).filter(Boolean) as string[];
    setAllCategories(categories);

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

    const sortedLatest = [...typedBlogs]
      .filter((blog) => blog.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
      )
      .slice(0, 4);
    setLatestBlogs(sortedLatest);
  }, [blogs]);

  if (blogsLoading) return <Loader />;

  if (blogsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center space-y-3">
          <div
            className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20
                          flex items-center justify-center mx-auto"
          >
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Failed to load blogs
          </p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[62px] bg-gray-50 dark:bg-gray-950 dark:text-white">
      {/* ── Hero Banner ── */}
      <section
        className="relative w-full h-[240px] md:h-[340px] lg:h-[400px]
                   flex items-center justify-center
                   bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url("/blogs-hero.png")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />
        <div
          className="absolute bottom-0 left-0 right-0 h-px
                        bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-70"
        />

        <div className="relative z-10 text-center text-white px-6 space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                          bg-teal-500/20 border border-teal-500/30 backdrop-blur-sm"
          >
            <BookOpen size={12} className="text-teal-400" />
            <span className="text-[11px] font-semibold text-teal-300 tracking-widest uppercase">
              E-Catalog Editorial
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              Blogs
            </span>
          </h1>
          <p className="text-base md:text-lg font-light text-white/80 max-w-xl mx-auto">
            Insights, tips, trends, and stories from the world of fashion and
            lifestyle
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="container-custom py-10 px-4 sm:px-6 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* ── Main blog cards ── */}
          <main className="lg:col-span-4 w-full">
            <BlogsPageCard blogs={(blogs as unknown as Blog[]) || []} />
          </main>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-2 w-full space-y-6">
            {/* Categories */}
            <div
              className="rounded-2xl bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            overflow-hidden shadow-sm"
            >
              <div
                className="flex items-center gap-2 px-5 py-4
                              border-b border-gray-100 dark:border-gray-800"
              >
                <div className="w-6 h-6 rounded-md bg-teal-500/10 flex items-center justify-center">
                  <TrendingUp size={13} className="text-teal-500" />
                </div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                  Categories
                </h2>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-52 overflow-y-auto">
                {allCategories.length > 0 ? (
                  allCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        className="w-full flex items-center justify-between
                                         px-5 py-3 text-sm text-gray-600 dark:text-gray-400
                                         hover:bg-teal-50 dark:hover:bg-teal-500/8
                                         hover:text-teal-600 dark:hover:text-teal-400
                                         transition-colors duration-150 group text-left"
                      >
                        <span>{cat}</span>
                        <ChevronRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 -translate-x-1
                                     group-hover:translate-x-0 transition-all duration-200 text-teal-500"
                        />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-5 py-4 text-sm text-gray-400">
                    No categories found
                  </li>
                )}
              </ul>
            </div>

            {/* Latest Posts */}
            <div
              className="rounded-2xl bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            overflow-hidden shadow-sm"
            >
              <div
                className="flex items-center gap-2 px-5 py-4
                              border-b border-gray-100 dark:border-gray-800"
              >
                <div className="w-6 h-6 rounded-md bg-teal-500/10 flex items-center justify-center">
                  <Clock size={13} className="text-teal-500" />
                </div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                  Latest Posts
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {latestBlogs.length > 0 ? (
                  latestBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="flex gap-3 px-5 py-4 group
                                    hover:bg-gray-50 dark:hover:bg-gray-800/50
                                    transition-colors duration-150"
                    >
                      <div
                        className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0
                                      ring-1 ring-gray-200 dark:ring-gray-700"
                      >
                        <Image
                          src={blog.image}
                          fill
                          alt={blog.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-0.5 min-w-0">
                        <p
                          className="text-xs font-medium text-gray-700 dark:text-gray-300
                                      line-clamp-2 leading-snug"
                        >
                          {blog.title}
                        </p>
                        <Link href={`/blogs/${blog._id}`}>
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold
                                           text-teal-600 dark:text-teal-400
                                           hover:text-teal-700 dark:hover:text-teal-300
                                           transition-colors mt-1"
                          >
                            Read more <ChevronRight size={11} />
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-4 text-sm text-gray-400">
                    No recent blogs found
                  </p>
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div
              className="rounded-2xl bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            overflow-hidden shadow-sm"
            >
              <div
                className="flex items-center gap-2 px-5 py-4
                              border-b border-gray-100 dark:border-gray-800"
              >
                <div className="w-6 h-6 rounded-md bg-teal-500/10 flex items-center justify-center">
                  <Tag size={13} className="text-teal-500" />
                </div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                  Popular Tags
                </h2>
              </div>
              <div className="px-5 py-4 flex flex-wrap gap-2">
                {popularTags.length > 0 ? (
                  popularTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer
                                     bg-gray-100 dark:bg-gray-800
                                     text-gray-600 dark:text-gray-400
                                     border border-gray-200 dark:border-gray-700
                                     hover:bg-teal-50 dark:hover:bg-teal-500/10
                                     hover:text-teal-600 dark:hover:text-teal-400
                                     hover:border-teal-300 dark:hover:border-teal-500/40
                                     transition-all duration-200"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">
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
