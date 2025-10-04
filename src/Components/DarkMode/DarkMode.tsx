"use client"
import { DarkModetoggle } from '@/hook/DarkModeToggle/darkMode';
import React, { useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { FiMoon } from "react-icons/fi";
import { MdOutlineWbSunny } from 'react-icons/md';
const DarkMode = () => {
    const [darkMode, setDarkMode] = useState(false);
    const handleDarkModeToggle = () => {
        DarkModetoggle();
        setDarkMode(!darkMode);
    };
    return (
        <button onClick={handleDarkModeToggle} className='bg-gray-200 p-2 rounded-full cursor-pointer dark:bg-gray-700 dark:text-white transition-all duration-300'>
            {darkMode ? <MdOutlineWbSunny size={20} /> : <FiMoon size={20} />}
        </button>
    )
}

export default DarkMode