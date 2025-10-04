"use client";

import Image from "next/image";
import { Edit, Settings } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const {data:session} = useSession()
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <Image
            src={session?.user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-accent shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
            {session?.user.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Frontend Developer | React | Tailwind CSS
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mt-5">
          <button className="btn bg-black text-white dark:bg-white dark:text-black flex items-center gap-2">
            <Edit size={16} /> Edit Profile
          </button>
          <button className="btn btn-outline flex items-center gap-2 dark:bg-white">
            <Settings size={16} /> Settings
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-500">24</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">120</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">80</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
}
