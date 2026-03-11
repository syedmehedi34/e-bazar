"use client";

import faqs from "@/lib/faqs";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* ── Left: Header ── */}
          <div className="lg:w-[35%] lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle size={13} className="text-teal-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
                Got Questions?
              </p>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold
                           text-gray-900 dark:text-white tracking-tight rubik mb-4"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Find answers to common questions about orders, payments, delivery,
              and more. Still need help?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold
                         text-teal-500 hover:text-teal-600 transition-colors duration-200"
            >
              Contact support →
            </a>

            {/* Decorative */}
            <div className="hidden lg:block mt-12 space-y-3">
              {[70, 50, 85].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="h-1.5 rounded-full bg-teal-500/20 dark:bg-teal-500/10"
                    style={{ width: `${w}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Accordion ── */}
          <div className="lg:w-[65%] space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`rounded-2xl border transition-all duration-300
                    ${
                      isOpen
                        ? "border-teal-500/40 dark:border-teal-500/30 bg-teal-50/50 dark:bg-teal-500/[0.05]"
                        : "border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800"
                    }`}
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4
                               px-6 py-5 text-left"
                  >
                    <span
                      className={`text-sm sm:text-base font-semibold rubik
                                     transition-colors duration-200
                      ${
                        isOpen
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                                     transition-all duration-300
                      ${
                        isOpen
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                    </span>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="px-6 pb-5 text-sm text-gray-500 dark:text-gray-400
                                      leading-relaxed border-t border-gray-100 dark:border-gray-700/40 pt-4"
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
