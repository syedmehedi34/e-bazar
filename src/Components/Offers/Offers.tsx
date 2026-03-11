"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Countdown from "./CountDown";
import { offer } from "@/lib/offers";

const Offers = () => {
  const o = offer;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-0.5 rounded-full bg-amber-400" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
            {o.offerType}
          </p>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden
                        bg-gray-900 dark:bg-gray-900
                        shadow-2xl shadow-black/20 dark:shadow-black/50"
        >
          {/* Background glow blobs */}
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full
                          bg-amber-500/20 blur-[100px] pointer-events-none"
          />
          <div
            className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full
                          bg-teal-500/10 blur-[80px] pointer-events-none"
          />

          <div className="relative flex flex-col lg:flex-row min-h-[480px]">
            {/* ── Left: Image ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-[48%] relative overflow-hidden bg-gray-800 min-h-[300px] lg:min-h-0"
            >
              <Image
                src={o.offerImage}
                fill
                alt={o.offerName}
                className="object-cover object-top"
                priority
              />
              {/* Right-side fade into dark panel */}
              <div
                className="absolute inset-y-0 right-0 w-24
                              bg-gradient-to-r from-transparent to-gray-900
                              hidden lg:block"
              />
              {/* Bottom fade for mobile */}
              <div
                className="absolute inset-x-0 bottom-0 h-24
                              bg-gradient-to-t from-gray-900 to-transparent
                              lg:hidden"
              />
            </motion.div>

            {/* ── Right: Content ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:w-[52%] flex flex-col justify-center
                         px-8 sm:px-12 py-12 lg:py-16 gap-7 text-white"
            >
              {/* Offer name */}
              <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight rubik">
                  {o.offerName}
                </h2>
                <p className="text-white/50 text-base">{o.offerTagline}</p>
              </div>

              {/* Percentage highlight */}
              <div className="flex items-end gap-3">
                <span
                  className="text-7xl sm:text-8xl font-black leading-none rubik"
                  style={{ color: o.accentColor }}
                >
                  {o.offerPercentage}%
                </span>
                <div className="flex flex-col pb-2 text-white/60 text-sm leading-tight">
                  <span>{o.offerDetails}</span>
                  <span className="font-semibold text-white">OFF</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-3">
                {o.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-1.5 text-sm text-white/70"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-teal-400 flex-shrink-0"
                    />
                    {f}
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.18em]
                               text-white/40 mb-4"
                >
                  Offer Ends In
                </p>
                <Countdown
                  targetDate={o.offerEndDate}
                  accentColor={o.accentColor}
                />
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/shopping"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl
                             font-bold text-sm text-white rubik
                             transition-all duration-300 group"
                  style={{ backgroundColor: o.accentColor }}
                >
                  Shop Now
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
                <Link
                  href="/shopping"
                  className="text-sm font-semibold text-white/50
                             hover:text-white transition-colors duration-200
                             underline underline-offset-4"
                >
                  View all deals
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
