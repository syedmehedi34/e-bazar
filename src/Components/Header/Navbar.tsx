"use client";

// icons imports
import { CiShoppingCart } from "react-icons/ci";
import {
  User,
  ShoppingCart,
  Box,
  LifeBuoy,
  LayoutDashboard,
} from "lucide-react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { signOut, useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AxiosError } from "axios";
import Image from "next/image";
import SearchInput from "../SearchInput";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import DarkMode from "../DarkMode";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shoppingCart = useSelector((state: RootState) => state.cart.value);
  const [searchBox, setSearchBox] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScrollY = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScrollY);
    return () => window.removeEventListener("scroll", handleScrollY);
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

  // general links
  const commonNavLinks = [
    { href: "/", label: "Home" },
    { href: "/shopping", label: "Shop" },
    { href: "/about", label: "About Us" },
    { href: "/blogs", label: "Blog", partial: true },
    { href: "/contact", label: "Contact Us" },
  ];

  // Role-based extra links
  const getRoleBasedLinks = () => {
    if (!session?.user) return [];

    if (session.user.role?.includes("admin")) {
      return [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ];
    }

    return [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

      { href: "/user_profile", label: "My Profile", icon: User },
      { href: "/shopping-cart", label: "My Cart", icon: ShoppingCart },
      { href: "/my_orders", label: "My Orders", icon: Box },
      { href: "#", label: "Support", icon: LifeBuoy },
    ];
  };

  // Desktop + Sidebar-এর জন্য common nav items
  const commonNavItems = commonNavLinks.map((link) => {
    const isActive = link.partial
      ? pathname.startsWith(link.href)
      : pathname === link.href;

    return (
      <Link
        key={link.href}
        href={link.href}
        className={`
          group relative 
          text-[15px] font-medium leading-6 
          transition-colors duration-300 text-gray-700 dark:text-gray-300
          ${isActive ? "font-semibold" : ""}
        `}
      >
        {link.label}

        <span
          className={`
            absolute left-1/2 -translate-x-1/2 bottom-[-6px]
            h-[2.5px] bg-gray-700 dark:bg-gray-300
            transition-all duration-300 ease-out
            ${
              isActive
                ? "w-full scale-x-100"
                : "w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"
            }
          `}
        />
      </Link>
    );
  });

  return (
    <>
      <header
        className={`z-100 ${
          pathname === "/"
            ? scrollY > 50
              ? "fixed-nav bg-white/95 dark:bg-gray-900 dark:text-white shadow"
              : "relative sm:absolute top-0 left-0 sm:bg-transparent text-black dark:text-white w-full bg-white"
            : scrollY > 50
              ? "fixed-nav bg-white/95 dark:bg-gray-800 dark:text-white shadow"
              : "bg-white dark:bg-gray-800 dark:text-white dark:shadow-gray-700 shadow"
        }`}
      >
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-black dark:text-white cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            <Logo />
          </div>

          {/* Desktop Nav — শুধু common links */}
          <nav className="hidden lg:flex gap-10">{commonNavItems}</nav>

          {/* Right side icons + auth */}
          <div className="flex items-center gap-4">
            <button
              className="bg-gray-200 sm:p-2 p-1 rounded-full cursor-pointer dark:text-white text-black dark:bg-gray-700 transition-all duration-300"
              onClick={() => setSearchBox(!searchBox)}
            >
              <FaSearch className="text-xl max-sm:text-md" />
            </button>

            <div className="relative bg-gray-200 text-black sm:p-2 p-1 rounded-full cursor-pointer dark:text-white dark:bg-gray-700 transition-all duration-300">
              <Link href="/shopping-cart">
                <CiShoppingCart className="text-xl max-sm:text-md" />
              </Link>
              <span className="absolute -top-1 sm:right-1 right-1 font-bold text-sm">
                {shoppingCart?.length || 0}
              </span>
            </div>

            <DarkMode />

            {!session?.user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="btn btn-sm btn-outline border-gray-400 text-white bg-gray-900 hover:bg-gray-800 rounded-md hover:text-white transition-all duration-300"
                >
                  Login <FaArrowRightFromBracket />
                </Link>
                <Link
                  href="/auth/register"
                  className="btn btn-sm btn-outline text-white hover:bg-gray-800 rounded-md hover:text-white transition-all duration-300 bg-gray-900"
                >
                  Register <FaArrowRightFromBracket />
                </Link>
              </div>
            ) : (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  className="sm:btn btn-sm btn-ghost btn-circle avatar"
                >
                  <div className="sm:w-10 w-6 sm:h-10 h-6 rounded-full">
                    <Image
                      src={
                        session?.user?.image ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt="Avatar"
                      fill
                      className="rounded-full"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content p-2 shadow bg-white dark:bg-gray-800 dark:text-white text-gray-800 rounded-box w-52 mt-4"
                >
                  {getRoleBasedLinks().map((link) => (
                    <li key={link.href} className="mb-1">
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 p-2 hover:bg-gray-600 hover:text-white dark:hover:text-white rounded-box transition-all duration-300"
                      >
                        {link.icon && <link.icon className="text-sm" />}
                        {link.label}
                      </Link>
                    </li>
                  ))}

                  <li className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline border-none w-full bg-gray-700 hover:bg-gray-600 text-white rounded-box"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar — শুধু common links */}
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
