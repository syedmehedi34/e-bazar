import Link from "next/link";
import React from "react";
import { FaBell, FaHome, FaSearch, FaUserCircle } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";

type NavbarProps ={
  onhandleSidebarOpen: ()=> void;
  sidebarOpen:boolean
}


const Navber:React.FC<NavbarProps> = ({onhandleSidebarOpen,sidebarOpen}) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white  to-gray-900 shadow">
      {/* Left - Title */}
      

      {/* Middle - Search Bar */}
      <div className="flex items-center w-1/2 max-w-lg">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="input pl-10"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-300 w-5 h-5" />
        </div>
      </div>

      {/* Right - Icons & Profile */}
      <div className="flex items-center gap-6">
        {/* Home */}
        <Link href={'/'} className="  ">
          <FaHome size={20} />
         
        </Link>

        {/* Notifications */}
        <button className="relative  transition flex items-center">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* Profile */}
        <button className=" transition flex items-center">
          <FaUserCircle size={20} />
        </button>
        <button 
        onClick={onhandleSidebarOpen}
        className=" transition flex items-center cursor-pointer lg:hidden">
          {
            !sidebarOpen ? <IoMenu className="w-6 h-6" /> : <IoClose size={20}/>
          }
          
        </button>
      </div>
    </header>
  );
};

export default Navber;
