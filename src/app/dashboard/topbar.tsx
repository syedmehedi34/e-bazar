"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  UserCircle,
  Megaphone,
} from "lucide-react";
import DarkMode from "@/Components/DarkMode"; // ← তোমার DarkMode component

type TopbarProps = {
  isSidebarOpen: boolean;
  isMobile: boolean;
  userRole: string;
  session: Session | null;
};

const newsItems = [
  "🛍️ New Products Just Added – Check Them Out!",
  "🔥 Big Discounts Available Today!",
  "🚚 Fast Delivery Available on Selected Items!",
  "🏪 New Vendors Joined Our Marketplace!",
  "⭐ Top Rated Products Trending Now!",
  "🎁 Special Deals on Featured Products!",
  "📦 Track Your Orders from Your Dashboard!",
  "💳 Secure Payments Now Available!",
];

const notifications = [
  {
    id: 1,
    msg: "New item found in your wishlist.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    msg: "Your order has been submitted.",
    time: "1h ago",
    unread: true,
  },
  { id: 3, msg: "Your profile was updated.", time: "3h ago", unread: false },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
};

const Topbar = ({
  isSidebarOpen,
  isMobile,
  userRole,
  session,
}: TopbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentNews, setCurrentNews] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = session?.user;
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const id = setInterval(
      () => setCurrentNews((p) => (p + 1) % newsItems.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !notificationRef.current?.contains(e.target as Node) &&
        !profileRef.current?.contains(e.target as Node)
      ) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getInitial = (name?: string | null) =>
    name?.charAt(0).toUpperCase() ?? "U";

  const leftClass = isMobile
    ? "left-16 w-[calc(100%-4rem)]"
    : isSidebarOpen
      ? "left-60 w-[calc(100%-15rem)]"
      : "left-16 w-[calc(100%-4rem)]";

  return (
    <div
      className={`fixed top-0 z-40 flex items-center justify-between
                  h-16 px-4 sm:px-6
                  bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-md
                  border-b border-gray-200 dark:border-white/[0.06]
                  shadow-sm dark:shadow-none
                  transition-all duration-300 ${leftClass}`}
    >
      {/* ── Search ── */}
      <div className="hidden lg:flex flex-1 max-w-xs">
        <motion.div
          animate={{ width: searchFocused ? 280 : 220 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Search
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200
                        ${searchFocused ? "text-teal-500" : "text-gray-400 dark:text-slate-500"}`}
          />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg
                       bg-gray-100 dark:bg-white/[0.06]
                       border border-gray-200 dark:border-white/[0.08]
                       text-gray-700 dark:text-slate-200
                       placeholder-gray-400 dark:placeholder-slate-500
                       focus:outline-none focus:border-teal-400 dark:focus:border-teal-500/50
                       focus:bg-white dark:focus:bg-white/[0.08]
                       transition-all duration-200"
          />
        </motion.div>
      </div>

      {/* ── Scrolling News ── */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-2 mx-4 overflow-hidden">
        <Megaphone
          size={13}
          className="text-teal-500 dark:text-teal-400 flex-shrink-0"
        />
        <div className="overflow-hidden h-5 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentNews}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap"
            >
              {newsItems[currentNews]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        {/* DarkMode toggle — existing component */}
        <DarkMode />

        {/* //! Notifications */}
        {/* <div ref={notificationRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-500 dark:text-slate-400
                       hover:text-gray-800 dark:hover:text-slate-200
                       hover:bg-gray-100 dark:hover:bg-white/[0.08]
                       transition-all duration-200"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-3.5 h-3.5 bg-teal-500 text-white
                           text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden
                           bg-white dark:bg-[#161b27]
                           border border-gray-200 dark:border-white/[0.08]
                           shadow-lg dark:shadow-2xl z-50"
              >
                <div
                  className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]
                                flex items-center justify-between"
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span
                      className="text-[10px] text-teal-600 dark:text-teal-400
                                     bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded-full"
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.04]
                                 transition-colors cursor-pointer flex gap-3"
                    >
                      {n.unread && (
                        <div className="w-1.5 h-1.5 bg-teal-500 dark:bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                      <div className={n.unread ? "" : "pl-4"}>
                        <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                          {n.msg}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-1">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/[0.06]">
                  <button
                    className="text-xs text-teal-600 dark:text-teal-400
                                     hover:text-teal-700 dark:hover:text-teal-300
                                     transition-colors w-full text-center"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}
        {/* //! Notifications */}

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-white/[0.08] mx-1" />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-white/[0.06]
                       transition-all duration-200 group"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0
                            ring-1 ring-gray-200 dark:ring-white/10
                            group-hover:ring-teal-400 dark:group-hover:ring-teal-500/40
                            transition-all"
            >
              {imageError || !user?.image ? (
                <div
                  className="w-full h-full bg-teal-100 dark:bg-teal-600/30
                                flex items-center justify-center
                                text-teal-600 dark:text-teal-300 text-sm font-bold"
                >
                  {getInitial(user?.name)}
                </div>
              ) : (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Name */}
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 max-w-[100px] truncate">
                {user?.name ?? "Guest"}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500 capitalize">
                {userRole}
              </span>
            </div>

            <ChevronDown
              size={12}
              className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 hidden sm:block
                          ${showProfileMenu ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden
                           bg-white dark:bg-[#161b27]
                           border border-gray-200 dark:border-white/[0.08]
                           shadow-lg dark:shadow-2xl z-50"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                    {user?.name ?? "Guest"}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 truncate mt-0.5">
                    {user?.email}
                  </p>
                  <span
                    className="inline-block mt-1.5 text-[10px]
                                   bg-teal-50 dark:bg-teal-500/15
                                   text-teal-600 dark:text-teal-400
                                   px-2 py-0.5 rounded-full capitalize font-medium"
                  >
                    {userRole}
                  </span>
                </div>

                {/* Links */}
                <div className="py-1.5">
                  <Link
                    href={`/dashboard/${normalizedRoleStr(userRole)}/profile`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                               text-gray-500 dark:text-slate-400
                               hover:text-gray-800 dark:hover:text-slate-200
                               hover:bg-gray-50 dark:hover:bg-white/[0.05]
                               transition-colors"
                  >
                    <UserCircle size={14} />
                    My Profile
                  </Link>
                </div>

                <div className="border-t border-gray-100 dark:border-white/[0.06] py-1.5">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2.5 px-4 py-2.5 w-full text-sm
                               text-gray-400 dark:text-slate-500
                               hover:text-red-500 dark:hover:text-red-400
                               hover:bg-red-50 dark:hover:bg-red-500/[0.06]
                               transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function normalizedRoleStr(role: string) {
  return role.toLowerCase() === "admin" ? "admin" : "user";
}

export default Topbar;
