"use client"
import { DarkModetoggle } from '@/hook/DarkModeToggle/darkMode';
import React, { useState } from 'react'
import { FiMoon } from "react-icons/fi";
import { MdOutlineWbSunny } from 'react-icons/md';
const DarkMode = () => {
    const [darkMode, setDarkMode] = useState(false);
    const handleDarkModeToggle = () => {
        DarkModetoggle();
        setDarkMode(!darkMode);
    };
    return (
        <button onClick={handleDarkModeToggle} className='bg-gray-800 sm:p-2 p-1 rounded-full cursor-pointer dark:bg-gray-700 text-white transition-all duration-300'>
            {darkMode ? <MdOutlineWbSunny size={20} /> : <FiMoon className='text-xl max-sm:text-md' />}
        </button>
    )
}

export default DarkMode