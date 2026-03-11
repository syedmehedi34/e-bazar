"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  Users,
  Zap,
  Leaf,
  HeartHandshake,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

// ── Reusable fade-up variant ────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
});

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Listed" },
  { value: "500+", label: "Verified Sellers" },
  { value: "4.8★", label: "Average Rating" },
];

const missions = [
  {
    icon: ShieldCheck,
    title: "Build Trust",
    desc: "Every product is authentic and verified before listing.",
  },
  {
    icon: Star,
    title: "Ensure Quality",
    desc: "Only high-quality products from trusted brands and suppliers.",
  },
  {
    icon: Users,
    title: "Empower Local Sellers",
    desc: "Support small businesses with digital visibility and growth.",
  },
  {
    icon: Zap,
    title: "Enhance Convenience",
    desc: "Fast delivery, easy returns, and secure payments — always.",
  },
  {
    icon: Lightbulb,
    title: "Innovate Continuously",
    desc: "Modern tech for smart recommendations and seamless UX.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    desc: "We act on feedback and constantly improve our services.",
  },
  {
    icon: TrendingUp,
    title: "Transparency",
    desc: "Honest pricing, clear communication, integrity in every step.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "Ethical practices and eco-friendly packaging for a better tomorrow.",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rubik">
      {/* ══ Hero Banner ══════════════════════════════════════════ */}
      <section
        className="relative w-full h-[260px] md:h-[360px] lg:h-[420px]
                   flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url("/about-us.png")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          {...fadeUp(0.1)}
          className="relative z-10 text-center text-white px-6"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-400 mb-3">
            Who We Are
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl">
            About Us
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Discover our story, mission, and what drives us to serve you better
            every day.
          </p>
        </motion.div>
      </section>

      {/* ══ Stats bar ════════════════════════════════════════════ */}
      <section className="bg-gray-900 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.08)}
                className="flex flex-col items-center py-8 px-6 text-center"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {s.value}
                </span>
                <span className="text-xs text-white/40 mt-1 font-medium">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Main content ═════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 space-y-28">
        {/* ── Our Story ── */}
        <section className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <motion.div {...fadeUp(0)} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-0.5 rounded-full bg-teal-500" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
                  Our Journey
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                The Story of E-Catalog
              </h2>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <p>
                In today&apos;s fast-paced digital world, online shopping has
                become more than convenience — it&apos;s a lifestyle. But before
                E-Catalog became a trusted name in Bangladesh&apos;s e-commerce
                space, it started as a simple dream: to make online shopping
                easier, safer, and more reliable for everyone.
              </p>
              <p>
                A small but passionate team of young tech enthusiasts noticed
                that customers were struggling with low-quality products,
                delayed deliveries, and lack of trust. That&apos;s when
                E-Catalog was born — to bridge the gap between quality and
                convenience.
              </p>
              <p>
                From day one, the mission was clear: deliver authentic products
                at fair prices with a seamless experience. Starting with a few
                categories, the platform quickly expanded as customers rewarded
                trust with loyalty.
              </p>
              <p>
                Today, E-Catalog connects thousands of customers with trusted
                sellers across the country. But this is just the beginning — the
                goal is to become a digital lifestyle companion where people
                discover, compare, and buy effortlessly.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div {...fadeUp(0.15)} className="relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl
                            border-2 border-teal-500/20 pointer-events-none"
            />
            <Image
              src="https://img.freepik.com/free-photo/young-trans-man-with-apron-working-as-waiter_23-2149409812.jpg"
              width={600}
              height={500}
              alt="Our Story"
              className="relative rounded-2xl shadow-xl w-full object-cover"
            />
            {/* Floating badge */}
            <div
              className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-800
                            border border-gray-100 dark:border-gray-700
                            rounded-2xl px-5 py-3 shadow-xl"
            >
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                2020
              </p>
              <p className="text-xs text-gray-400">Founded in Bangladesh</p>
            </div>
          </motion.div>
        </section>

        {/* ── Our Mission ── */}
        <section className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Image — left on desktop */}
          <motion.div {...fadeUp(0.1)} className="relative order-2 lg:order-1">
            <div
              className="absolute -top-4 -right-4 w-full h-full rounded-2xl
                            border-2 border-amber-500/20 pointer-events-none"
            />
            <Image
              src="https://img.freepik.com/free-photo/people-sharing-ideas-while-studying_23-2147656100.jpg"
              width={600}
              height={500}
              alt="Our Mission"
              className="relative rounded-2xl shadow-xl w-full object-cover"
            />
            {/* Floating badge */}
            <div
              className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-800
                            border border-gray-100 dark:border-gray-700
                            rounded-2xl px-5 py-3 shadow-xl"
            >
              <p className="text-2xl font-extrabold text-amber-500">50K+</p>
              <p className="text-xs text-gray-400">Happy Customers</p>
            </div>
          </motion.div>

          {/* Text — right */}
          <motion.div {...fadeUp(0)} className="space-y-6 order-1 lg:order-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-0.5 rounded-full bg-amber-500" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                  Our Mission
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                What Drives Us Every Day
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              At{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                E-Catalog
              </span>
              , our mission is to redefine online shopping in Bangladesh —
              making it more reliable, affordable, and customer-focused. Every
              person deserves quality products and a trustworthy experience from
              home.
            </p>

            {/* Mission grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missions.map((m, i) => (
                <motion.div
                  key={m.title}
                  {...fadeUp(i * 0.05)}
                  className="flex items-start gap-3 p-4 rounded-xl
                             bg-gray-50 dark:bg-gray-800
                             border border-gray-100 dark:border-gray-700/50
                             hover:border-teal-500/30 transition-colors duration-200"
                >
                  <div
                    className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center
                                  justify-center flex-shrink-0 mt-0.5"
                  >
                    <m.icon size={15} className="text-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {m.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Page;
