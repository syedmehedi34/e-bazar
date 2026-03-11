"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async
    toast.success("🎉 You're subscribed! Enjoy 20% off.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden
                     bg-gray-900 dark:bg-gray-800
                     shadow-2xl shadow-black/10 dark:shadow-black/40"
        >
          {/* Background blobs */}
          <div
            className="absolute -top-16 -left-16 w-72 h-72 rounded-full
                          bg-teal-500/20 blur-[80px] pointer-events-none"
          />
          <div
            className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full
                          bg-amber-500/15 blur-[80px] pointer-events-none"
          />

          <div
            className="relative z-10 flex flex-col lg:flex-row
                          items-center justify-between gap-10
                          px-8 sm:px-12 py-12 lg:py-16"
          >
            {/* ── Left: Copy ── */}
            <div className="text-center lg:text-left max-w-lg">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  Exclusive Offer
                </span>
              </div>

              <h3
                className="text-3xl sm:text-4xl font-extrabold text-white
                             rubik tracking-tight leading-tight mb-3"
              >
                Subscribe & Get <span className="text-amber-400">20% Off</span>
              </h3>

              <p className="text-sm text-white/60 leading-relaxed">
                Join our newsletter and be the first to know about new arrivals,
                exclusive deals, and style tips straight to your inbox.
              </p>

              {/* Trust badges */}
              <div className="flex items-center justify-center lg:justify-start gap-5 mt-5">
                {[
                  "No spam, ever",
                  "Unsubscribe anytime",
                  "Exclusive deals",
                ].map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-1.5 text-[11px] text-white/40"
                  >
                    <div className="w-1 h-1 rounded-full bg-teal-500" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              {/* Envelope icon */}
              <div className="flex justify-center lg:justify-start mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Mail size={22} className="text-white/70" />
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-5 py-3.5 rounded-xl text-sm
                               bg-white/10 text-white placeholder-white/30
                               border border-white/10
                               focus:outline-none focus:border-teal-500/60
                               focus:bg-white/15
                               transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2
                             py-3.5 px-6 rounded-xl text-sm font-bold rubik
                             bg-teal-500 hover:bg-teal-400
                             disabled:opacity-60 disabled:cursor-not-allowed
                             text-white shadow-lg shadow-teal-500/25
                             transition-all duration-200 group"
                >
                  {loading ? (
                    <span
                      className="w-4 h-4 border-2 border-white/30 border-t-white
                                     rounded-full animate-spin"
                    />
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-[11px] text-white/30 mt-3">
                By subscribing, you agree to our{" "}
                <span className="underline underline-offset-2 cursor-pointer hover:text-white/60 transition-colors">
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Subscribe;
