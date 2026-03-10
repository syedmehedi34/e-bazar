"use client";

import React from "react";
import BlogCard from "./BlogCard";
import Link from "next/link";
import { useFetchBlog } from "@/hook/useFetchBlog";
import Loader from "@/app/(main)/loading";
import { Blog } from "@/types/blogsInterface";

const Blogs = () => {
  const { blogs, blogsLoading } = useFetchBlog();
  const typedBlogs = (blogs as unknown as Blog[]) || [];

  if (blogsLoading) {
    return <Loader />;
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto text-center px-4 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Our E-Bazaar Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Stay updated with the latest insights, tips, and trends in the world
            of e-commerce. From new product launches to digital marketing
            strategies, our blog covers everything you need to grow your online
            business successfully.
          </p>
        </div>
        <div>
          {<BlogCard blogs={typedBlogs} />}

          <div className="mt-10 flex justify-center items-center">
            <Link
              href={"/blogs"}
              className="px-4 py-2 bg-gray-900 text-white rounded-box"
            >
              See More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
