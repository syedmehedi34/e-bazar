'use client'
import React, { useState } from 'react'
import { Blog } from './blogsInterface'
import Image from 'next/image'
import { CgProfile } from 'react-icons/cg'
import { CiCalendarDate } from 'react-icons/ci'

import { MdKeyboardDoubleArrowDown } from "react-icons/md";
type BlogsType = {
    blogs: Blog[]
}

const BlogsPageCard: React.FC<BlogsType> = ({ blogs }) => {
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    const handleToggle = (id: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className='dark:text-white'>
            {
                blogs?.map((blog) => {
                    const isExpanded = expanded[blog._id];
                    return (
                        <div key={blog._id} className='shadow  mb-10 rounded-box dark:bg-gray-800'>
                            <div className='overflow-hidden rounded-box'>
                                <Image
                                    src={blog.image}
                                    width={400}
                                    height={100}
                                    alt={blog.title}
                                    className='w-full h-[400px] object-cover rounded-box hover:scale-125 transition-all duration-300'
                                />
                            </div>

                            <div className='my-4 p-2'>
                                <p className='flex justify-between items-center mb-2'>
                                    <span className='flex items-center gap-2 text-sm font-bold'>
                                        <CgProfile /> {blog.author}
                                    </span>
                                    <span className='flex items-center gap-2 text-sm'>
                                        <CiCalendarDate /> {blog.date}
                                    </span>
                                </p>

                                <p className='font-bold text-xl tracking-wide mb-2'>
                                    {blog.title}
                                </p>
                                <p className='text-sm font-bold mb-4'>
                                    {blog.shortDescription}
                                </p>

                                {/* Smooth content container */}
                                <div
                                    className={`text-sm tracking-wide overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-20'}`}
                                >
                                    {blog.content.map((p, index) => (
                                        <p key={index} className='mb-2'>
                                            {p.paragraph}
                                        </p>
                                    ))}
                                </div>

                                <div className='my-4 flex justify-end'>
                                    <button
                                        onClick={() => handleToggle(blog._id)}
                                        className='flex items-center gap-2 px-4 py-1 dark:bg-gray-700 dark:text-white cursor-pointer bg-gray-200 rounded-box transition-all duration-300 hover:scale-105'
                                    >
                                        {isExpanded ? 'See Less' : 'See More'} <MdKeyboardDoubleArrowDown />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BlogsPageCard
