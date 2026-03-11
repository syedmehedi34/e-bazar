"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, PhoneCall, MessageCircle, Gift } from "lucide-react";

const cards = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders above ৳2,000",
    accent: "teal",
  },
  {
    icon: PhoneCall,
    title: "Call Us Anytime",
    description: "+880-123-222-323",
    accent: "blue",
  },
  {
    icon: MessageCircle,
    title: "24/7 Live Chat",
    description: "We offer round-the-clock support",
    accent: "violet",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "For your loved ones, any amount",
    accent: "amber",
  },
];

const accentMap: Record<string, { bg: string; icon: string; border: string }> =
  {
    teal: {
      bg: "bg-teal-50 dark:bg-teal-500/10",
      icon: "bg-teal-500",
      border: "border-teal-100 dark:border-teal-500/20",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      icon: "bg-blue-500",
      border: "border-blue-100 dark:border-blue-500/20",
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-500/10",
      icon: "bg-violet-500",
      border: "border-violet-100 dark:border-violet-500/20",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      icon: "bg-amber-500",
      border: "border-amber-100 dark:border-amber-500/20",
    },
  };

const TrustCard = () => {
  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const a = accentMap[card.accent];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`flex items-center gap-4 p-5 rounded-2xl border
                            ${a.bg} ${a.border}
                            transition-all duration-300 hover:-translate-y-1
                            hover:shadow-md dark:hover:shadow-black/20 cursor-default`}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center
                                 flex-shrink-0 ${a.icon}`}
                >
                  <card.icon size={18} className="text-white" strokeWidth={2} />
                </div>

                {/* Text */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustCard;
