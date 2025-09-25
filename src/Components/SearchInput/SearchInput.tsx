"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';
type PageProps = {
    setSearchBox: React.Dispatch<React.SetStateAction<boolean>>;
    searchBox: boolean
}

const SearchInput: React.FC<PageProps> = ({ setSearchBox, searchBox }) => {
    const [search, setSearch] = useState('');
    const router = useRouter()
    const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(search.trim() === '')return;
        setSearchBox(false);
        router.push(`/shopping?search=${search}`)
    }

    return (
        <motion.div
        initial={{ scale: 0, }}
        animate={{ scale: 1, }}
        exit={{ scale: 0, }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 w-full bg-black/70 flex justify-center items-center py-20 px-10 overflow-hidden z-100">
            <button onClick={() => setSearchBox(!searchBox)} className='absolute top-4 right-4 cursor-pointer'>
                <IoClose size={30} color='black' />
            </button> 
            <form onSubmit={handleFormSubmit} className='w-full max-w-full sm:max-w-xl'>
                <label className="relative ">
                    <input
                        type="search"
                        required
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-white placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-100"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </label>
            </form>
        </motion.div>
    );
};

export default SearchInput;
