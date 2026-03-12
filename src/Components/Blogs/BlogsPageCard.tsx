"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Blog } from "@/types/blogsInterface";

type BlogsType = {
  blogs: Blog[];
};

const BlogsPageCard: React.FC<BlogsType> = ({ blogs }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {blogs?.map((blog, index) => {
        const isExpanded = expanded[blog._id];
        return (
          <article
            key={blog._id}
            className="group rounded-2xl overflow-hidden
                       bg-white dark:bg-gray-900
                       border border-gray-200 dark:border-gray-800
                       shadow-sm hover:shadow-md
                       transition-shadow duration-300"
          >
            {/* ── Image ── */}
            <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden">
              <Image
                src={blog.image}
                fill
                alt={blog.title}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Category badge */}
              {blog.category && (
                <span
                  className="absolute top-4 left-4
                                 px-3 py-1 rounded-full text-[11px] font-semibold
                                 bg-teal-500/90 text-white backdrop-blur-sm tracking-wide uppercase"
                >
                  {blog.category}
                </span>
              )}

              {/* Index number watermark */}
              <span
                className="absolute bottom-4 right-4 text-6xl font-black
                               text-white/10 select-none leading-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* ── Body ── */}
            <div className="p-6 space-y-4">
              {/* Meta row */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <CgProfile size={13} className="text-teal-500" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <CiCalendarDate size={14} />
                  {blog.date}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-lg sm:text-xl font-bold
                             text-gray-900 dark:text-white
                             leading-snug tracking-tight"
              >
                {blog.title}
              </h2>

              {/* Short description */}
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {blog.shortDescription}
              </p>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              {/* Expandable content */}
              <div
                className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed
                            overflow-hidden transition-all duration-500 ease-in-out
                            ${isExpanded ? "max-h-[2000px]" : "max-h-[72px]"}`}
              >
                {/* Fade mask when collapsed */}
                <div
                  className={`relative ${!isExpanded ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-white dark:after:from-gray-900 after:to-transparent" : ""}`}
                >
                  {blog.content.map((p, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {p.paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Toggle button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleToggle(blog._id)}
                  className="inline-flex items-center gap-1.5
                             px-4 py-2 rounded-xl text-xs font-semibold
                             bg-gray-100 dark:bg-gray-800
                             text-gray-600 dark:text-gray-400
                             border border-gray-200 dark:border-gray-700
                             hover:bg-teal-50 dark:hover:bg-teal-500/10
                             hover:text-teal-600 dark:hover:text-teal-400
                             hover:border-teal-300 dark:hover:border-teal-500/40
                             transition-all duration-200"
                >
                  {isExpanded ? (
                    <>
                      See Less <MdKeyboardDoubleArrowUp size={13} />
                    </>
                  ) : (
                    <>
                      See More <MdKeyboardDoubleArrowDown size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default BlogsPageCard;
