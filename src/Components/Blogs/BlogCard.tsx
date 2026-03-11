import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, MessageCircle, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Blog } from "@/types/blogsInterface";

type BlogsType = {
  blogs?: Blog[];
};

const BlogCard: React.FC<BlogsType> = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  const [featured, ...rest] = blogs.slice(0, 4);

  return (
    <div className="space-y-5">
      {/* ── Featured (first blog) — wide card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href={`/blogs/${featured._id}`}
          className="group relative flex flex-col md:flex-row
                     rounded-2xl overflow-hidden
                     bg-white dark:bg-gray-800
                     border border-gray-100 dark:border-gray-700/50
                     shadow-sm hover:shadow-xl dark:hover:shadow-black/30
                     transition-shadow duration-300"
        >
          {/* Image */}
          <div className="md:w-[45%] relative overflow-hidden min-h-[240px] md:min-h-[300px] bg-gray-100 dark:bg-gray-700">
            <Image
              src={featured.image}
              fill
              alt={featured.title}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Category badge */}
            <span
              className="absolute top-4 left-4 text-[11px] font-bold uppercase
                             tracking-wider px-3 py-1 rounded-full
                             bg-teal-500 text-white shadow-sm"
            >
              {featured.category}
            </span>
          </div>

          {/* Content */}
          <div className="md:w-[55%] flex flex-col justify-between p-6 sm:p-8">
            <div className="space-y-3">
              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                  <User size={12} className="text-teal-500" />
                  {featured.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-teal-500" />
                  {new Date(featured.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={12} className="text-teal-500" />
                  {featured.comments?.length ?? 0}
                </span>
              </div>

              <h2
                className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white
                             leading-snug tracking-tight line-clamp-2"
              >
                {featured.title}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {featured.shortDescription}
              </p>

              {/* Tags */}
              {featured.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-[10px] font-semibold
                                 px-2 py-0.5 rounded-full
                                 bg-gray-100 dark:bg-gray-700
                                 text-gray-500 dark:text-gray-400"
                    >
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Read more */}
            <div
              className="flex items-center gap-2 mt-6 text-sm font-bold text-teal-500
                            group-hover:gap-3 transition-all duration-200"
            >
              Read Article
              <ArrowRight size={15} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── Rest — 3 column grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((blog, i) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.08,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/blogs/${blog._id}`}
              className="group flex flex-col rounded-2xl overflow-hidden
                         bg-white dark:bg-gray-800
                         border border-gray-100 dark:border-gray-700/50
                         shadow-sm hover:shadow-xl dark:hover:shadow-black/30
                         transition-shadow duration-300 h-full"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={blog.image}
                  fill
                  alt={blog.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold uppercase
                                 tracking-wider px-2.5 py-1 rounded-full
                                 bg-teal-500 text-white"
                >
                  {blog.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2.5">
                {/* Meta */}
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={10} className="text-teal-500" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} className="text-teal-500" />
                    {new Date(blog.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <MessageCircle size={10} className="text-teal-500" />
                    {blog.comments?.length ?? 0}
                  </span>
                </div>

                <h3
                  className="text-sm font-bold text-gray-900 dark:text-white
                               leading-snug line-clamp-2"
                >
                  {blog.title}
                </h3>

                <p
                  className="text-xs text-gray-500 dark:text-gray-400
                              leading-relaxed line-clamp-2 flex-1"
                >
                  {blog.shortDescription}
                </p>

                <div
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-500 mt-1
                                group-hover:gap-2.5 transition-all duration-200"
                >
                  Read more <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;
