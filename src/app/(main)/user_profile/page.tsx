"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const UserProfilePage = () => {
  const { data: session } = useSession();

  const userImage =
    session?.user?.image ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  const userName = session?.user?.name || "User Name";
  const userEmail = session?.user?.email || "user@example.com";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full container-custom mx-auto bg-white dark:bg-gray-800 shadow-md rounded-b-2xl overflow-hidden relative">
        {/* 🔹 Cover Photo */}
        <div className="h-[300px] bg-gradient-to-r from-blue-600 to-indigo-500 relative">
          <Image
            src={session?.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            alt="cover photo"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* 🔹 Profile Section */}
        <div className="flex items-end gap-6 px-6 pb-4 -mt-24 relative z-10">
          <div className="relative">
            <Image
              src={userImage}
              width={160}
              height={160}
              alt="User profile picture"
              className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {userName}
            </h2>
            <p className="text-gray-500 dark:text-gray-300">{userEmail}</p>
          </div>
        </div>

        {/* 🔹 Navigation Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-4">
          <div className="flex gap-6 px-6 py-3 text-gray-600 dark:text-gray-300 font-medium">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 transition"
            >
              Home
            </Link>
            <Link
              href="/shopping"
              className="hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 transition"
            >
              Shopping
            </Link>
            <Link
              href="/my_orders"
              className="hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 transition"
            >
              Order
            </Link>
            <Link
              href="/shopping-cart"
              className="hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 transition"
            >
              My Shopping Cart
            </Link>
          </div>
        </div>

        {/* 🔹 Content Area */}
        <div className="px-6 py-8 text-gray-700 dark:text-gray-300">
          <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
            About
          </h3>
          <p className="leading-relaxed">
            Hi! I’m {userName}. I enjoy connecting with friends, exploring new places, and sharing experiences. I love discovering new trends, learning about technology, and staying connected with my community. Life is all about making memories and enjoying every moment.
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
