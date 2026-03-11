"use client";
import { DarkModetoggle } from "@/hook/DarkModeToggle/darkMode";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    DarkModetoggle();
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={handleDarkModeToggle}
      className="w-8 h-8 flex items-center justify-center rounded-lg
                 bg-gray-200 dark:bg-gray-700
                 text-gray-600 dark:text-slate-300
                 hover:bg-gray-300 dark:hover:bg-white/[0.08]
                 transition-all duration-200"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={darkMode ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default DarkMode;
