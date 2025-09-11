
import Link from "next/link";
import React from "react";
import { FaBell, FaHome, FaSearch, FaUserCircle } from "react-icons/fa";

const Navber = () => {
    
  return (
    <header
      className="flex justify-between items-center p-2 border-b border-gray-700 mb-4"
      
    >
      {/* Left - Logo or Title */}
      <div className="text-xl font-semibold text-white tracking-wide">
        Dashboard
      </div>

      {/* Middle - Search Bar */}
      <div className="flex items-center w-1/3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-300 w-4 h-4" />
        </div>
      </div>

      {/* Right - Icons & Profile */}
      <div className="flex items-center gap-6 text-white">
         <Link href={'/'} className="hover:text-purple-300 transition">
          <FaHome className="w-6 h-6" />
        </Link>
        {/* Notification */}
        <button className="relative hover:text-purple-300 transition">
          <FaBell className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* User Profile */}
        <button className="hover:text-purple-300 transition">
          <FaUserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Navber;
