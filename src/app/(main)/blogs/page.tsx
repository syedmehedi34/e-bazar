"use client";
import { Blog } from "@/Components/Blogs/blogsInterface";
import BlogsPageCard from "@/Components/Blogs/BlogsPageCard";
import Pagination from "@/Components/Pagination/Pagination";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const Blogpage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // States for sidebar metadata (from all blogs)
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  // Fetch paginated blogs (with optional search)
  const getPaginatedBlogs = useCallback(async () => {
    try {
      let url = `https://e-bazaar-server-three.vercel.app/blogs?page=${currentPage}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      setBlogs(data.blogs || []);
      setPageArray(data.pageArray || []);
    } catch (error) {
      console.error("Paginated fetch error:", (error as Error).message);
    }
  }, [currentPage, searchQuery]);

  // Fetch full metadata once (categories, popular tags, latest blogs)
  const getFullMetadata = useCallback(async () => {
    try {
      // Fetch all blogs or use a metadata endpoint if available
      // Here using large limit as fallback
      const res = await fetch(
        "https://e-bazaar-server-three.vercel.app/blogs?limit=1000",
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error("Metadata fetch failed");
      const data = await res.json();

      const allBlogs: Blog[] = data.blogs || [];

      // Unique categories
      const categories = Array.from(
        new Set(allBlogs.map((b: Blog) => b.category)),
      ) as string[];
      setAllCategories(categories);

      // Popular tags: count frequency and take top 5
      const tagCount: Record<string, number> = {};
      allBlogs.forEach((blog: Blog) => {
        blog.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      const topTags = Object.entries(tagCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Only top 5
        .map(([tag]) => `#${tag}`);

      setPopularTags(topTags);

      // Latest 4 blogs (sorted by date descending)
      const sortedLatest = allBlogs
        .filter((blog) => blog.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
        )
        .slice(0, 4);

      setLatestBlogs(sortedLatest);
    } catch (error) {
      console.error("Metadata fetch error:", (error as Error).message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    getFullMetadata(); // Load once for sidebar
    getPaginatedBlogs(); // Load paginated content
  }, [getFullMetadata]);

  // Re-fetch paginated data when page or search changes
  useEffect(() => {
    getPaginatedBlogs();
  }, [getPaginatedBlogs]);

  return (
    <div className="min-h-screen dark:text-white ">
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
            <BlogsPageCard blogs={blogs} />

            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageArray={pageArray}
            />
          </div>

          <aside className="lg:col-span-2 w-full">
            {/* Search */}
            <div className="mb-6">
              <label className="relative block">
                <input
                  type="search"
                  placeholder="Search blogs..."
                  className="w-full input pl-10 border rounded-lg py-2 dark:bg-gray-800 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on search change
                  }}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-800 dark:text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </label>
            </div>

            {/* Fashion Categories */}
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 border-b pb-2">
                Fashion Categories
              </h2>
              <ul className="space-y-2 text-sm sm:text-base max-h-48 overflow-y-auto">
                {allCategories.map((cat) => (
                  <li
                    key={cat}
                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat}
                  </li>
                ))}
                {allCategories.length === 0 && (
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
                <p className="text-sm text-gray-500">Loading latest blogs...</p>
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

export default Blogpage;
