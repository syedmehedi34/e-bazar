"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaBars,
  FaUser,
  FaBoxOpen,
  FaUsersCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "@/Components/Logo";
import { Logs, Truck } from "lucide-react";

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
    icon: <FaUser />,
    roles: ["user"],
  },
  {
    path: "/dashboard/user/profile",
    label: "My Profile",
    icon: <FaUser />,
    roles: ["user"],
  },

  //
  {
    path: "/dashboard/user/my-orders",
    label: "My Orders",
    icon: <Logs />,
    roles: ["user"],
  },
  {
    path: "/dashboard/user/track-order",
    label: "Track Order",
    icon: <Truck />,
    roles: ["user"],
  },

  // admin only
  {
    path: "/dashboard/admin",
    label: "Dashboard",
    icon: <FaUser />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/profile",
    label: "My Profile",
    icon: <FaUser />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/all-users",
    label: "All Users",
    icon: <FaUsersCog />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/all-products",
    label: "All Products",
    icon: <FaBoxOpen />,
    roles: ["admin"],
  },
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
    <div
      className={`fixed top-0 left-0 h-full z-500 ${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-gradient-to-b from-teal-800 to-teal-600 text-white transition-all duration-300 flex flex-col shadow-xl`}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Logo + Toggle */}
        <div className="px-4 py-[21.3px] flex items-center justify-between border-b border-teal-500">
          <div
            className={`${isSidebarOpen ? "block" : "hidden"} text-xl font-semibold text-white`}
          >
            <Logo />
          </div>

          <button
            className="p-2 rounded-md hover:bg-teal-500 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <FaBars className="text-lg text-white" />
          </button>
        </div>

        {/* Nav Items */}
        <ul className="mt-4 space-y-2.5 px-2">
          {filteredNavItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                onClick={() => isMobile && isSidebarOpen && toggleSidebar()}
                className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-200 ${
                  isSidebarOpen
                    ? isActive(item.path)
                      ? "bg-teal-400 text-white font-medium"
                      : "text-teal-100 hover:bg-teal-500 hover:text-white"
                    : isActive(item.path)
                      ? "bg-teal-400 text-white font-medium justify-center"
                      : "text-teal-200 hover:bg-teal-500 hover:text-white justify-center"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span
                  className={`${isSidebarOpen ? "block" : "hidden"} text-sm font-medium`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout + Footer */}
      <div className="p-4 border-t border-teal-500">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-200 w-full ${
            isSidebarOpen
              ? "text-teal-100 hover:bg-teal-500 hover:text-white"
              : "justify-center text-teal-200 hover:bg-teal-500 hover:text-white"
          }`}
        >
          <FaSignOutAlt className="text-lg" />
          <span
            className={`${isSidebarOpen ? "block" : "hidden"} text-sm font-medium`}
          >
            Logout
          </span>
        </button>
        <div
          className={`${isSidebarOpen ? "block" : "hidden"} mt-2 text-center text-xs text-teal-100`}
        >
          © {new Date().getFullYear()} E-Catalog Ltd.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
