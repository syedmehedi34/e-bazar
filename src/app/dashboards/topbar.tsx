"use client";

import { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaBell, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

type TopbarProps = {
  isSidebarOpen: boolean;
  isMobile: boolean;
  userRole: string;
  session: Session | null;
};

const newsItems = [
  "📊 New Asset Reports Available!",
  "👥 HR Manager: Check Employee Updates!",
  "⏰ Admin: Review Pending Requests!",
  "📅 Schedule Asset Maintenance Today!",
  "🔔 Employee: Update Your Profile!",
  "🔧 Dashboard Update: New Features Added!",
  "✅ Admin: Approve User Access Requests!",
];

const modalVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

const Topbar = ({
  isSidebarOpen,
  isMobile,
  userRole,
  session,
}: TopbarProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentNews, setCurrentNews] = useState(0);
  const [imageError, setImageError] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = session?.user;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitial = (name?: string | null) =>
    name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div
      className={`fixed top-0 z-20 flex items-center justify-between px-6 py-4 shadow-md bg-teal-900 backdrop-blur-md transition-all duration-300 ${
        isSidebarOpen
          ? "left-64 w-[calc(100%-16rem)]"
          : "left-16 w-[calc(100%-4rem)]"
      }`}
    >
      {/* Search Bar */}
      <div className="hidden lg:flex flex-1 mx-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search assets, employees..."
            className="w-full px-4 py-2 rounded-full bg-teal-800 text-teal-100 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-300" />
        </div>
      </div>

      {/* Scrolling News */}
      <div className="hidden md:flex flex-1 mx-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNews}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base font-medium text-teal-100 text-center w-full"
          >
            {newsItems[currentNews]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="text-teal-100 text-xl focus:outline-none hover:bg-teal-800 p-2 rounded-full transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: 180 }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </motion.button>

        {/* Profile Menu */}
        <motion.div
          ref={profileRef}
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-teal-300 transition-all duration-300 hover:border-teal-400">
              {imageError || !user?.image ? (
                <div className="w-full h-full bg-teal-600 flex items-center justify-center text-teal-100 text-xl md:text-2xl font-bold">
                  {getInitial(user?.name)}
                </div>
              ) : (
                <img
                  src={user.image}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="hidden md:flex">
              <div className="text-teal-100 text-center md:text-left">
                <p className="text-sm md:text-lg font-medium">
                  {user?.name || "Guest User"}
                </p>
                {user?.email && (
                  <p className="text-xs md:text-sm font-light">{user.email}</p>
                )}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-48 bg-teal-800 rounded-lg shadow-xl z-50 border border-teal-700"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-teal-100">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-xs text-teal-300">
                    {userRole || "Employee"}
                  </p>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/dashboard/my-profile"
                      className="block text-sm text-teal-100 hover:bg-teal-700 p-2 rounded-lg transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left text-sm text-teal-100 hover:bg-teal-700 p-2 rounded-lg transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Notification Bell */}
        <motion.div
          ref={notificationRef}
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="text-teal-100 text-xl focus:outline-none relative hover:bg-teal-800 p-2 rounded-full transition-colors duration-300"
          >
            <FaBell />
            <span className="absolute top-0 right-0 z-10 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 bg-teal-800 rounded-lg shadow-xl z-50 border border-teal-700"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-teal-100">
                    Notifications
                  </p>
                  <div className="mt-2 space-y-2">
                    {[
                      "New asset request pending.",
                      "Employee profile updated.",
                      "System maintenance scheduled.",
                    ].map((msg, i) => (
                      <div
                        key={i}
                        className="p-2 bg-teal-700 rounded-lg hover:bg-teal-600 transition-colors duration-200"
                      >
                        <p className="text-xs text-teal-100">{msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Topbar;
