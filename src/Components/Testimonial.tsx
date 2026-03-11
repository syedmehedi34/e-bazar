"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import testimonials from "@/lib/testimonials";

const Testimonial = () => {
  // Overall stats
  const avgRating = (
    testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
  ).toFixed(1);
  const fiveStars = testimonials.filter((t) => t.rating === 5).length;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={13} className="text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                Customer Reviews
              </p>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold
                           text-gray-900 dark:text-white tracking-tight rubik"
            >
              What Our Customers Say
            </h2>
          </div>

          {/* Stats pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-5 px-6 py-4 rounded-2xl
                       bg-white dark:bg-gray-800
                       border border-gray-100 dark:border-gray-700/50
                       shadow-sm self-start sm:self-auto"
          >
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {avgRating}
              </p>
              <div className="flex gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} size={10} className="text-amber-400" />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Avg Rating</p>
            </div>
            <div className="w-px h-10 bg-gray-100 dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {testimonials.length}+
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Total Reviews</p>
            </div>
            <div className="w-px h-10 bg-gray-100 dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {fiveStars}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">5-Star Reviews</p>
            </div>
          </motion.div>
        </div>

        {/* ── Swiper ── */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="!pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div
                className="group relative flex flex-col
                              bg-white dark:bg-gray-800
                              border border-gray-100 dark:border-gray-700/50
                              rounded-2xl p-6 h-[240px]
                              shadow-sm hover:shadow-xl dark:hover:shadow-black/30
                              transition-all duration-300 cursor-pointer
                              hover:-translate-y-1 rubik"
              >
                {/* Quote icon */}
                <Quote
                  size={28}
                  className="absolute top-5 right-5 text-gray-100 dark:text-gray-700
                             group-hover:text-teal-100 dark:group-hover:text-teal-500/20
                             transition-colors duration-300"
                  strokeWidth={1.5}
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }, (_, idx) =>
                    idx < t.rating ? (
                      <FaStar key={idx} size={12} className="text-amber-400" />
                    ) : (
                      <FaRegStar
                        key={idx}
                        size={12}
                        className="text-gray-200 dark:text-gray-600"
                      />
                    ),
                  )}
                </div>

                {/* Description */}
                <p
                  className="text-sm text-gray-600 dark:text-gray-300
                              leading-relaxed line-clamp-3 flex-1"
                >
                  {t.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-gray-700/60 my-4" />

                {/* User */}
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-10 h-10 rounded-xl overflow-hidden
                                  ring-2 ring-teal-500/20 flex-shrink-0"
                  >
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                      {t.location}
                    </p>
                  </div>
                  <span
                    className="ml-auto text-[10px] text-gray-300 dark:text-gray-600
                                   font-medium tabular-nums flex-shrink-0"
                  >
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
