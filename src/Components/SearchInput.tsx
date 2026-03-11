"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PageProps = {
  setSearchBox: React.Dispatch<React.SetStateAction<boolean>>;
  searchBox: boolean;
};

const SearchInput: React.FC<PageProps> = ({ setSearchBox, searchBox }) => {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto focus on open
  useEffect(() => {
    if (searchBox) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchBox]);

  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchBox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSearchBox]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === "") return;
    setSearchBox(false);
    router.push(`/shopping?search=${encodeURIComponent(search.trim())}`);
  };

  const suggestions = [
    "Men's Fashion",
    "Women's Clothing",
    "Electronics",
    "Home Decor",
    "Shoes",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-start pt-24 px-4
                 bg-black/60 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSearchBox(false);
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setSearchBox(false)}
        className="absolute top-5 right-5 p-2 rounded-xl
                   bg-white/10 hover:bg-white/20
                   text-white transition-all duration-200"
      >
        <IoClose size={22} />
      </button>

      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        {/* Label */}
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 text-center">
          What are you looking for?
        </p>

        {/* Input */}
        <form onSubmit={handleFormSubmit}>
          <div
            className={`relative flex items-center rounded-2xl overflow-hidden
                           transition-all duration-300
                           ${
                             focused
                               ? "bg-white shadow-2xl shadow-black/30 ring-2 ring-teal-400"
                               : "bg-white/95 shadow-xl shadow-black/20"
                           }`}
          >
            <Search
              size={18}
              className={`absolute left-4 transition-colors duration-200 flex-shrink-0
                          ${focused ? "text-teal-500" : "text-gray-400"}`}
            />
            <input
              ref={inputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-12 pr-32 py-4 text-gray-800 text-base
                         placeholder-gray-400 bg-transparent
                         focus:outline-none"
            />
            <button
              type="submit"
              disabled={!search.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-xl text-sm font-bold
                         bg-teal-500 hover:bg-teal-600 disabled:bg-gray-200
                         text-white disabled:text-gray-400
                         transition-all duration-200"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick suggestions */}
        <AnimatePresence>
          {!search && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mt-4 flex flex-wrap gap-2 justify-center"
            >
              <span className="text-white/40 text-xs font-medium self-center">
                Trending:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSearch(s);
                    inputRef.current?.focus();
                  }}
                  className="text-xs px-3 py-1.5 rounded-full
                             bg-white/10 hover:bg-white/20
                             text-white/80 hover:text-white
                             border border-white/10 hover:border-white/20
                             transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard hint */}
        <p className="text-center text-white/30 text-xs mt-5">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 text-white/50 font-mono text-[11px]">
            Esc
          </kbd>{" "}
          to close
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SearchInput;
