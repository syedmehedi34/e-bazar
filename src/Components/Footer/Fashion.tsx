"use client";

import Image from "next/image";
import Link from "next/link";
import { cubicBezier, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Men's Fashion",
    subtitle: "Streetwear to Formals",
    img: "https://img.freepik.com/free-photo/portrait-young-man-with-hat-sunglasses_23-2148466013.jpg",
    href: "/shopping?subCategory=Shirt",
    accent: "#14b8a6",
    tag: "New Season",
  },
  {
    name: "Women's Fashion",
    subtitle: "Elegant & Trendy Styles",
    img: "https://img.freepik.com/free-photo/smiley-woman-holding-her-hat_23-2148647651.jpg",
    href: "/shopping?subCategory=Saree",
    accent: "#f59e0b",
    tag: "Bestseller",
  },
  {
    name: "Electronics & Gadgets",
    subtitle: "Latest Tech & Deals",
    img: "https://img.freepik.com/free-photo/woman-using-modern-headphones-smartphone-device-home_23-2148793466.jpg",
    href: "/shopping?subCategory=Accessories",
    accent: "#6366f1",
    tag: "Top Deals",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  }),
};

const Fashion = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500 mb-2">
              Browse Categories
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold
                           text-gray-900 dark:text-white tracking-tight"
            >
              Shop by Style
            </h2>
          </div>
          <Link
            href="/shopping"
            className="flex items-center gap-1.5 text-sm font-semibold
                       text-gray-500 dark:text-gray-400
                       hover:text-teal-500 dark:hover:text-teal-400
                       transition-colors duration-200 group"
          >
            View all categories
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <Link
                href={cat.href}
                className="group block relative h-[420px] rounded-2xl overflow-hidden shadow-md
                         dark:shadow-black/30 cursor-pointer"
              >
                {/* Image */}
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out
                             group-hover:scale-105"
                />

                {/* ── Light mode overlay ── */}
                <div
                  className="absolute inset-0 dark:hidden
                  bg-gradient-to-t from-black/70 via-black/20 to-black/5
                  group-hover:from-black/80 transition-all duration-500"
                />

                {/* ── Dark mode overlay ── */}
                <div
                  className="absolute inset-0 hidden dark:block
                  bg-gradient-to-t from-black/80 via-black/30 to-black/10
                  group-hover:from-black/90 transition-all duration-500"
                />

                {/* Tag — top left */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider
                               px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: cat.accent }}
                  >
                    {cat.tag}
                  </span>
                </div>

                {/* Content — bottom */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest
                                text-white/60 mb-1"
                  >
                    {cat.subtitle}
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-extrabold text-white
                                 tracking-tight mb-4"
                  >
                    {cat.name}
                  </h3>

                  {/* CTA */}
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="flex items-center gap-2 text-sm font-bold
                                 px-4 py-2 rounded-xl text-white
                                 translate-y-10 group-hover:translate-y-0
                                 opacity-0 group-hover:opacity-100
                                 transition-all duration-400 ease-out"
                      style={{ backgroundColor: cat.accent }}
                    >
                      Shop Now <ArrowRight size={14} />
                    </span>
                  </div>
                </div>

                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10
                             transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 80%, ${cat.accent}, transparent 60%)`,
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fashion;
