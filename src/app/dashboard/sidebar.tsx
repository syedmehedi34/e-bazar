"use client";

import {
  LayoutDashboard,
  Truck,
  LogOut,
  UserCircle,
  ShoppingBag,
  Heart,
  RotateCcw,
  Headphones,
  Package,
  PackagePlus,
  Users,
  Ticket,
  Star,
  CreditCard,
  Settings,
  MessageSquare,
  ChevronRight,
  Logs,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Logo from "@/Components/Logo";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
};

const navItems: NavItem[] = [
  // user only
  {
    path: "/dashboard/user",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
    roles: ["user"],
  },
  {
    path: "/dashboard/user/profile",
    label: "My Profile",
    icon: <UserCircle size={16} />,
    roles: ["user"],
  },
  {
    path: "/dashboard/user/orders",
    label: "My Orders",
    icon: <ShoppingBag size={16} />,
    roles: ["user"],
  },
  {
    path: "/dashboard/user/wishlist",
    label: "Wishlist",
    icon: <Heart size={16} />,
    roles: ["user"],
  },
  {
    path: "/dashboard/user/track-order",
    label: "Track Order",
    icon: <Truck size={16} />,
    roles: ["user"],
  },
  // {
  //   path: "/dashboard/user/returns",
  //   label: "Returns",
  //   icon: <RotateCcw size={16} />,
  //   roles: ["user"],
  // },
  {
    path: "/dashboard/user/support",
    label: "Support",
    icon: <Headphones size={16} />,
    roles: ["user"],
  },
  // Addresses,

  //
  {
    path: "/dashboard/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/profile",
    label: "My Profile",
    icon: <UserCircle size={16} />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/products",
    label: "All Products",
    icon: <Package size={16} />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/add-product",
    label: "Add Product",
    icon: <PackagePlus size={16} />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/blogs",
    label: "Blogs",
    icon: <Logs size={16} />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/orders",
    label: "Orders",
    icon: <ShoppingBag size={16} />,
    roles: ["admin"],
  },
  // {
  //   path: "/dashboard/admin/returns",
  //   label: "Returns",
  //   icon: <RotateCcw size={16} />,
  //   roles: ["admin"],
  // },
  {
    path: "/dashboard/admin/users",
    label: "Users",
    icon: <Users size={16} />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/coupons",
    label: "Coupons & Discounts",
    icon: <Ticket size={16} />,
    roles: ["admin"],
  },
  // {
  //   path: "/dashboard/admin/reviews",
  //   label: "Reviews",
  //   icon: <Star size={16} />,
  //   roles: ["admin"],
  // },
  // {
  //   path: "/dashboard/admin/payments",
  //   label: "Payments",
  //   icon: <CreditCard size={16} />,
  //   roles: ["admin"],
  // },
  // {
  //   path: "/dashboard/admin/settings",
  //   label: "Settings",
  //   icon: <Settings size={16} />,
  //   roles: ["admin"],
  // },
  {
    path: "/dashboard/admin/support",
    label: "Support Tickets",
    icon: <MessageSquare size={16} />,
    roles: ["admin"],
  },
  // Shipping Management, Admins / Staff, Reports
];

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: string | { role?: string } | undefined;
  isMobile: boolean;
};

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  userRole,
  isMobile,
}: SidebarProps) => {
  const pathname = usePathname();

  const normalizedRole =
    typeof userRole === "string"
      ? userRole.toLowerCase()
      : typeof (userRole as { role?: string })?.role === "string"
        ? (userRole as { role?: string }).role!.toLowerCase()
        : "";

  const filteredNavItems = navItems.filter((item) =>
    item.roles.some((role) => role.toLowerCase() === normalizedRole),
  );

  const isActive = (path: string) => pathname === path;

  return (
    <motion.div
      animate={{ width: isSidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden
                 bg-white dark:bg-[#0f1117]
                 border-r border-gray-200 dark:border-white/[0.06]
                 shadow-sm dark:shadow-2xl"
    >
      {/* ── Logo & Toggle ── */}
      <div
        className="flex items-center justify-between px-4 h-16 flex-shrink-0
                      border-b border-gray-200 dark:border-white/[0.06]"
      >
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-lg overflow-hidden whitespace-nowrap
                         text-gray-800 dark:text-white"
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className={`flex items-center justify-center w-8 h-8 rounded-lg
                      text-gray-500 dark:text-slate-400
                      hover:text-gray-800 dark:hover:text-white
                      hover:bg-gray-100 dark:hover:bg-white/10
                      transition-all duration-200 flex-shrink-0
                      ${!isSidebarOpen ? "mx-auto" : ""}`}
        >
          <motion.div
            animate={{ rotate: isSidebarOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronRight size={16} />
          </motion.div>
        </button>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredNavItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
            >
              <Link
                href={item.path}
                onClick={() => isMobile && isSidebarOpen && toggleSidebar()}
                title={!isSidebarOpen ? item.label : undefined}
                className={`relative flex items-center h-10 rounded-lg
                            transition-all duration-200 overflow-hidden
                            ${isSidebarOpen ? "px-3 gap-3" : "justify-center px-0"}
                            ${
                              active
                                ? "bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400"
                                : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                            }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5
                               bg-teal-500 dark:bg-teal-400 rounded-full"
                  />
                )}
                <span
                  className={`flex-shrink-0 text-[15px] ${active ? "text-teal-600 dark:text-teal-400" : ""}`}
                >
                  {item.icon}
                </span>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="p-2 border-t border-gray-200 dark:border-white/[0.06] flex-shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`flex items-center h-10 rounded-lg w-full
                      text-gray-400 dark:text-slate-500
                      hover:text-red-500 dark:hover:text-red-400
                      hover:bg-red-50 dark:hover:bg-red-500/10
                      transition-all duration-200
                      ${isSidebarOpen ? "px-3 gap-3" : "justify-center"}`}
          title={!isSidebarOpen ? "Logout" : undefined}
        >
          <LogOut size={15} className="flex-shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[10px] text-gray-400 dark:text-slate-600 mt-2 pb-1"
            >
              © {new Date().getFullYear()} E-Catalog Ltd.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;
