"use client"
import { Blog } from '@/Components/Blogs/blogsInterface';
import BlogsPageCard from '@/Components/Blogs/BlogsPageCard';
import axios from 'axios';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

const Blogpage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const getBlogsData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/blogs`);
      if (res.status === 200) {
        setBlogs(res?.data);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }, []);

  useEffect(() => {
    getBlogsData();
  }, [getBlogsData]);

  return (
    <div className="min-h-screen">
      {/* 🧭 Header Section */}
      <nav
        className="bg-cover bg-center bg-no-repeat w-full h-[200px] sm:h-[250px]"
        style={{
          backgroundImage: `url('https://preview.colorlib.com/theme/cozastore/images/bg-02.jpg.webp')`,
        }}
      >
        <div className="h-full w-full bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Our Blog</h1>
        </div>
      </nav>


      <div className="container-custom py-8 px-3 sm:px-5 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
          <div className="lg:col-span-3 xl:col-span-4 w-full">
            <BlogsPageCard blogs={blogs} />
          </div>

 
          <aside className="lg:col-span-2 xl:col-span-1 w-full">
            {/* 🔍 Search */}
            <div className="mb-6">
              <label className="relative block">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full input pl-10 border rounded-lg py-2 dark:bg-gray-800 dark:text-white"
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

  
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 border-b pb-2">Fashion Categories</h2>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="cursor-pointer ">Women’s Fashion</li>
                <li className="cursor-pointer ">Men’s Style & Grooming</li>
                <li className="cursor-pointer ">Trends & Lifestyle</li>
                <li className="cursor-pointer ">Accessories & Styling Tips</li>
                <li className="cursor-pointer ">Sustainable & Ethical Fashion</li>
              </ul>
            </div>

            {/* 🆕 Latest Blogs */}
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box mb-6">
              <h2 className="mb-4 text-lg sm:text-xl font-bold border-b pb-2">Latest Blogs</h2>
              {blogs.slice(0, 5).map((blog) => (
                <div key={blog._id} className="flex gap-3 mb-4 items-start">
                  <Image
                    src={blog.image}
                    width={80}
                    height={80}
                    alt={blog.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <p className="text-sm sm:text-base line-clamp-3">{blog.shortDescription}</p>
                </div>
              ))}
            </div>

            {/* 🏷️ Tags */}
            <div className="p-4 bg-white shadow dark:bg-gray-800 dark:text-white rounded-box">
              <h2 className="text-lg sm:text-xl font-bold mb-3 border-b pb-2">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "#StreetStyle",
                  "#SummerCollection",
                  "#CasualWear",
                  "#ModernLook",
                  "#VintageVibes",
                  "#WinterFashion",
                  "#LuxuryStyle",
                  "#OOTD",
                  "#MinimalDesign",
                  "#FashionTrends",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-600 hover:text-white cursor-pointer transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blogpage;
