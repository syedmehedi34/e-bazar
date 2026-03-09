"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaBars,
  FaTachometerAlt,
  FaUser,
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaListAlt,
  FaPlusSquare,
  FaFileSignature,
  FaAddressBook,
  FaUserPlus,
  FaUsersCog,
  FaSignOutAlt,
} from "react-icons/fa";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
};

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
    roles: ["employee", "hr_manager", "admin"],
  },
  {
    path: "/dashboard/my-profile",
    label: "My Profile",
    icon: <FaUser />,
    roles: ["employee", "hr_manager", "admin"],
  },
  // Employee routes
  {
    path: "/dashboard/my_assets",
    label: "My Assets",
    icon: <FaBoxOpen />,
    roles: ["employee"],
  },
  {
    path: "/dashboard/my_team",
    label: "My Team",
    icon: <FaUsers />,
    roles: ["employee"],
  },
  {
    path: "/dashboard/request_assets",
    label: "Request Assets",
    icon: <FaClipboardList />,
    roles: ["employee"],
  },
  // HR Manager routes
  {
    path: "/dashboard/assets_list",
    label: "Asset List",
    icon: <FaListAlt />,
    roles: ["hr_manager"],
  },
  {
    path: "/dashboard/add_asset",
    label: "Add an Asset",
    icon: <FaPlusSquare />,
    roles: ["hr_manager"],
  },
  {
    path: "/dashboard/all_requests",
    label: "All Requests",
    icon: <FaFileSignature />,
    roles: ["hr_manager"],
  },
  {
    path: "/dashboard/employee_list",
    label: "Employee List",
    icon: <FaAddressBook />,
    roles: ["hr_manager"],
  },
  {
    path: "/dashboard/add_employee",
    label: "Add Employee",
    icon: <FaUserPlus />,
    roles: ["hr_manager"],
  },
  // Admin routes
  {
    path: "/dashboard/all-users",
    label: "All Users",
    icon: <FaUsersCog />,
    roles: ["admin"],
  },
  {
    path: "/dashboard/all-assets",
    label: "All Assets",
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

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full z-10 ${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-gradient-to-b from-teal-800 to-teal-600 text-white transition-all duration-300 flex flex-col shadow-xl`}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Logo + Toggle */}
        <div className="px-4 py-[22.6px] flex items-center justify-between border-b border-teal-500">
          <Link href="/">
            <h1
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } text-xl font-semibold text-white`}
            >
              AssetFlow
            </h1>
          </Link>
          <button
            className="p-2 rounded-md hover:bg-teal-500 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <FaBars className="text-lg text-white" />
          </button>
        </div>

        {/* Nav Items */}
        <ul className="mt-4 space-y-1 px-2">
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
                  className={`${
                    isSidebarOpen ? "block" : "hidden"
                  } text-sm font-medium`}
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
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } text-sm font-medium`}
          >
            Logout
          </span>
        </button>
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } mt-2 text-center text-xs text-teal-100`}
        >
          © 2025 AssetFlow Solutions
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
