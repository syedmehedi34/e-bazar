"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useState, useRef } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import Button from "./Button/Button";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    desktopImg: "https://i.postimg.cc/qBxrBpzt/hero-1-2.png",
    mobileImg: "https://i.postimg.cc/zXhfFsB8/hero-1-m.png",
    accent: "#14b8a6",
    content: {
      subtitle: "New Arrival",
      title: "Men's Fashion\nCollection",
      desc: "Explore the latest trends in men's fashion. From streetwear to formal styles, we've got it all.",
      btnText: "Shop Now",
    },
  },
  {
    desktopImg: "https://i.postimg.cc/KcQWKWN8/hero2-1.png",
    mobileImg: "https://i.postimg.cc/7hBtpC62/hero2-2.png",
    accent: "#f59e0b",
    content: {
      subtitle: "Style Redefined",
      title: "Women's Exclusive\nWear",
      desc: "Upgrade your wardrobe with our elegant and trendy women's fashion collection.",
      btnText: "Explore Collection",
    },
  },
  {
    desktopImg: "https://i.postimg.cc/GmmMjCjs/hero3.png",
    mobileImg: "https://i.postimg.cc/ZnYD7PTm/hero3-m.png",
    accent: "#6366f1",
    content: {
      subtitle: "Top Deals",
      title: "Smart Electronics\n& Gadgets",
      desc: "Grab the best deals on the latest electronics and gadgets. Limited time offers!",
      btnText: "Browse Now",
    },
  },
];

const DELAY = 4000;

const textVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DELAY) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(progressRef.current!);
    }, 30);
  };

  const goTo = (i: number) => swiperRef.current?.slideTo(i);

  const slide = slides[activeIndex];

  return (
    <div
      className="relative h-[90vh] md:h-screen overflow-hidden
                    bg-gray-100 dark:bg-gray-950"
    >
      {/* ── Swiper ── */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: DELAY, disableOnInteraction: false }}
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          startProgress();
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex % slides.length);
          startProgress();
        }}
        className="w-full h-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              {/* Desktop bg */}
              <div
                className="hidden lg:block absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${s.desktopImg})` }}
              />
              {/* Mobile bg */}
              <div className="block lg:hidden absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${s.mobileImg})` }}
                />
              </div>

              {/* ── Light mode overlay ── soft white fade on left */}
              <div
                className="absolute inset-0 dark:hidden
                bg-gradient-to-r from-white/90 via-white/60 to-white/10
                lg:from-white/85 lg:via-white/50 lg:to-transparent"
              />
              {/* Light mode bottom fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 dark:hidden
                bg-gradient-to-t from-white/60 to-transparent"
              />

              {/* ── Dark mode overlay ── */}
              <div
                className="absolute inset-0 hidden dark:block
                bg-gradient-to-r from-black/80 via-black/40 to-black/10
                lg:from-black/70 lg:via-black/30 lg:to-transparent"
              />
              {/* Dark mode bottom fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 hidden dark:block
                bg-gradient-to-t from-black/50 to-transparent"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Animated content overlay ── */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} className="max-w-2xl space-y-5">
              {/* Subtitle */}
              <motion.div
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-3"
              >
                <span
                  className="w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: slide.accent }}
                />
                <span
                  className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]"
                  style={{ color: slide.accent }}
                >
                  {slide.content.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                           font-extrabold leading-[1.05] tracking-tight whitespace-pre-line
                           text-gray-900 dark:text-white"
              >
                {slide.content.title}
              </motion.h1>

              {/* Desc */}
              <motion.p
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-sm sm:text-base leading-relaxed max-w-md
                           text-gray-600 dark:text-white/70"
              >
                {slide.content.desc}
              </motion.p>

              {/* Button */}
              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Button text={slide.content.btnText} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom controls ── */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between">
            {/* Left — simple dot indicators only */}
            <div className="flex items-center gap-3">
              {slides.map((s, i) => (
                <button key={i} onClick={() => goTo(i)} className="group p-1">
                  <div
                    className={`rounded-full transition-all duration-300
                      ${i === activeIndex ? "w-6 h-2" : "w-2 h-2 opacity-40 group-hover:opacity-70"}`}
                    style={{
                      backgroundColor:
                        i === activeIndex ? s.accent : "currentColor",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Right — counter with progress arc */}
            <div className="flex items-center gap-3">
              {/* Progress bar under counter */}
              <div className="flex flex-col items-end gap-1.5">
                <div
                  className="flex items-baseline gap-1
                                text-gray-500 dark:text-white/50"
                >
                  <span
                    className="text-2xl font-bold tabular-nums
                                   text-gray-900 dark:text-white"
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">
                    / {String(slides.length).padStart(2, "0")}
                  </span>
                </div>
                {/* Progress bar */}
                <div
                  className="w-16 h-0.5 rounded-full
                                bg-gray-300 dark:bg-white/20 overflow-hidden"
                >
                  <div
                    className="h-full rounded-full transition-none"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: slide.accent,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accent glow ── light mode subtle, dark mode more visible */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                   blur-[120px] opacity-10 dark:opacity-20
                   pointer-events-none z-[1] transition-colors duration-1000"
        style={{ backgroundColor: slide.accent }}
      />
    </div>
  );
};

export default Banner;
