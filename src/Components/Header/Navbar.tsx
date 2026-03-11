"use client";

import { CiShoppingCart } from "react-icons/ci";
import {
  User,
  ShoppingCart,
  Box,
  LifeBuoy,
  LayoutDashboard,
  Search,
  X,
  Menu,
} from "lucide-react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { signOut, useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AxiosError } from "axios";
import Image from "next/image";
import SearchInput from "../SearchInput";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import DarkMode from "../DarkMode";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBox, setSearchBox] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const shoppingCart = useSelector((state: RootState) => state.cart.value);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScrollY = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScrollY);
    return () => window.removeEventListener("scroll", handleScrollY);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#profile-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(`${err.message}`);
    }
  };

  const commonNavLinks = [
    { href: "/", label: "Home" },
    { href: "/shopping", label: "Shop" },
    { href: "/about", label: "About Us" },
    { href: "/blogs", label: "Blog", partial: true },
    { href: "/contact", label: "Contact Us" },
  ];

  const getRoleBasedLinks = () => {
    if (!session?.user) return [];
    if (session.user.role?.includes("admin")) {
      return [
        {
          href: "/dashboard/admin/profile",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ];
    }
    return [
      {
        href: "/dashboard/user/profile",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      { href: "/user_profile", label: "My Profile", icon: User },
      { href: "/shopping-cart", label: "My Cart", icon: ShoppingCart },
      { href: "/my_orders", label: "My Orders", icon: Box },
      { href: "#", label: "Support", icon: LifeBuoy },
    ];
  };

  const isScrolled = scrollY > 50;
  const isHome = pathname === "/";
  // Homepage এ scroll করার আগে — icon bg দেখাবে
  const showHeroBg = isHome && !isScrolled;

  const navBg = isHome
    ? isScrolled
      ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-md dark:shadow-black/30"
      : "bg-transparent"
    : isScrolled
      ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-md dark:shadow-black/30"
      : "bg-white dark:bg-gray-950 shadow-sm dark:shadow-black/20";

  const commonNavItems = commonNavLinks.map((link) => {
    const isActive = link.partial
      ? pathname.startsWith(link.href)
      : pathname === link.href;

    const textClass = isActive
      ? "text-gray-900 dark:text-white"
      : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white";

    const darkHeroText = showHeroBg
      ? "dark:!text-white/85 dark:group-hover:!text-white"
      : "";

    return (
      <Link
        key={link.href}
        href={link.href}
        className="relative group text-sm font-semibold tracking-wide uppercase"
      >
        <span
          className={`transition-colors duration-200 ${textClass} ${darkHeroText}`}
        >
          {link.label}
        </span>
        <span
          className={`absolute -bottom-1 left-0 h-[2px] bg-teal-500
                          transition-all duration-300 ease-out
                          ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        />
      </Link>
    );
  });

  const cartCount = shoppingCart?.length || 0;

  // Icon button — homepage initial এ white/glass bg, scroll হলে সরে যায়
  const iconBtnClass = showHeroBg
    ? "p-2 rounded-lg transition-all duration-200 text-white bg-white/15 hover:bg-white/25"
    : "p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Left ── */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden ${iconBtnClass}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? "x" : "menu"}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
              <Logo logoColor={""} />
            </div>

            {/* ── Center ── */}
            <nav className="hidden lg:flex items-center gap-8">
              {commonNavItems}
            </nav>

            {/* ── Right ── */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchBox(!searchBox)}
                className={iconBtnClass}
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <Link
                href="/shopping-cart"
                className={`relative ${iconBtnClass}`}
              >
                <CiShoppingCart size={22} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                               bg-teal-500 text-white text-[10px] font-bold
                               rounded-full flex items-center justify-center px-1"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Dark Mode */}
              <DarkMode />

              {/* Divider */}
              <div
                className={`hidden sm:block w-px h-5 mx-1 transition-colors duration-300
                ${showHeroBg ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`}
              />

              {/* Auth */}
              {!session?.user ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200
                      ${
                        showHeroBg
                          ? "text-white bg-white/15 hover:bg-white/25"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-semibold px-4 py-2 rounded-lg
                               bg-teal-500 hover:bg-teal-600 text-white
                               transition-all duration-200 shadow-sm shadow-teal-500/30
                               flex items-center gap-1.5"
                  >
                    Register <FaArrowRightFromBracket size={12} />
                  </Link>
                </div>
              ) : (
                <div id="profile-dropdown" className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2 p-1 rounded-xl transition-all duration-200 group
                      ${showHeroBg ? "hover:bg-white/15" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg overflow-hidden relative
                                    ring-2 ring-teal-500/30 group-hover:ring-teal-500/60
                                    transition-all duration-200"
                    >
                      <Image
                        src={
                          session?.user?.image ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden
                                   bg-white dark:bg-gray-900
                                   border border-gray-200 dark:border-gray-700/60
                                   shadow-xl dark:shadow-black/40 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {session.user.name ?? "User"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>

                        <div className="py-1.5">
                          {getRoleBasedLinks().map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                                         text-gray-600 dark:text-gray-300
                                         hover:text-gray-900 dark:hover:text-white
                                         hover:bg-gray-50 dark:hover:bg-gray-800/60
                                         transition-colors duration-150"
                            >
                              {link.icon && (
                                <link.icon
                                  size={14}
                                  className="flex-shrink-0 text-teal-500"
                                />
                              )}
                              {link.label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2
                                       py-2 px-4 rounded-lg text-sm font-semibold
                                       bg-gray-900 dark:bg-gray-700
                                       hover:bg-gray-700 dark:hover:bg-gray-600
                                       text-white transition-all duration-200"
                          >
                            Logout <FaArrowRightFromBracket size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <Sidebar
            navItems={commonNavItems}
            isOpen={mobileMenuOpen}
            setIsOpen={setMobileMenuOpen}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchBox && (
          <SearchInput setSearchBox={setSearchBox} searchBox={searchBox} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
