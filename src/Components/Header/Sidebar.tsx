"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaArrowRightFromBracket } from "react-icons/fa6";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  navItems: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, navItems }) => {
  const { data: session } = useSession();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[99] lg:hidden bg-black/30 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 z-[100] lg:hidden
                   h-full w-[85%] sm:w-[320px]
                   bg-white dark:bg-gray-950
                   border-r border-gray-200 dark:border-gray-800
                   shadow-2xl shadow-black/10 dark:shadow-black/50
                   flex flex-col"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4
                        border-b border-gray-100 dark:border-gray-800"
        >
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg
                       bg-gray-100 dark:bg-gray-800
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       text-gray-600 dark:text-gray-300
                       transition-all duration-200"
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav
          className="flex flex-col px-3 py-4 flex-1 gap-1
                        [&>a]:flex [&>a]:items-center
                        [&>a]:px-4 [&>a]:py-3 [&>a]:rounded-xl
                        [&>a]:text-sm [&>a]:font-semibold [&>a]:uppercase [&>a]:tracking-wide
                        [&>a]:transition-all [&>a]:duration-200
                        [&>a]:text-gray-700 dark:[&>a]:text-gray-200
                        [&>a:hover]:bg-gray-100 dark:[&>a:hover]:bg-gray-800
                        [&>a:hover]:text-gray-900 dark:[&>a:hover]:text-white"
        >
          {navItems}
        </nav>

        {/* Auth buttons */}
        {!session?.user && (
          <div className="px-4 pb-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-3 px-4 rounded-xl
                         text-sm font-semibold
                         bg-gray-100 dark:bg-gray-800
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         text-gray-800 dark:text-gray-200
                         transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
                         text-sm font-semibold
                         bg-teal-500 hover:bg-teal-600
                         text-white shadow-sm shadow-teal-500/30
                         transition-all duration-200"
            >
              Register <FaArrowRightFromBracket size={12} />
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;
