"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from 'react';
import {
  MdDashboard,
  MdProductionQuantityLimits,
  MdAddBox,
  MdShoppingCart,
  MdAssessment,
  MdSettings,
  MdNotifications,
  MdSupportAgent,
  MdFavorite
} from "react-icons/md";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();


  const menuItems: { name: string; path: string; icon: JSX.Element }[] = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={20} /> }
  ];

  if (session?.user?.role?.includes("admin")) {
    menuItems.push(
      { name: "Products", path: "/dashboard/products", icon: <MdProductionQuantityLimits size={20} /> },
      { name: "Add Products", path: "/dashboard/add-products", icon: <MdAddBox size={20} /> },
      { name: "Orders", path: "/dashboard/orders", icon: <MdShoppingCart size={20} /> },
      { name: "Reports", path: "/dashboard/reports", icon: <MdAssessment size={20} /> },
      { name: "Settings", path: "/dashboard/settings", icon: <MdSettings size={20} /> },
      { name: "Notifications", path: "/dashboard/notifications", icon: <MdNotifications size={20} /> },
      { name: "Support", path: "/dashboard/support", icon: <MdSupportAgent size={20} /> }
    );
  }

  if (session?.user?.role?.includes("use")) {
    menuItems.push(
      { name: "My Order", path: "/dashboard/my-orders", icon: <MdShoppingCart size={20} /> },
      { name: "Settings", path: "/dashboard/settings", icon: <MdSettings size={20} /> },
      { name: "Wishlist", path: "/dashboard/wishlist", icon: <MdFavorite size={20} /> },
      { name: "Support", path: "/dashboard/support", icon: <MdSupportAgent size={20} /> },
      { name: "Notifications", path: "/dashboard/notifications", icon: <MdNotifications size={20} /> }
    );
  }

  return (
    <aside className="bg-white  shadow w-64 h-screen fixed lg:relative overflow-y-auto z-[100] ">
      <div className="flex justify-center my-10">
        <Image
          src={session?.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
          width={100}
          height={100}
          alt="Profile images"
          className="rounded-full"
        />
      </div>
      <nav className="flex-1 space-y-2 mx-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-200 transition ${
              pathname === item.path ? "bg-gray-200" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
