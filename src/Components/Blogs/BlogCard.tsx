import React from 'react'
import { Blog } from './blogsInterface'
import Image from 'next/image'
import { CiCalendarDate } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
type BlogsType = {
    blogs?: Blog[]
}


const BlogCard: React.FC<BlogsType> = ({ blogs }) => {
    console.log("blogs " , blogs)
    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4'>
            {
                blogs?.slice(0, 4).map((blog) => {
                    return (
                        <div className='shadow-md p-2 bg-white dark:bg-gray-800 dark:text-white rounded-box'>
                            <div className='overflow-hidden'>
                                <Image
                                    src={blog.image}
                                    width={300}
                                    height={300}
                                    alt='Blogs images'
                                    className='w-full h-[300px] object-cover cursor-pointer rounded-box hover:scale-125 transition-all duration-300'
                                />
                            </div>
                            <div className='mt-2'>
                                <div>
                                    <p className='flex justify-between items-center mb-2'>
                                        <span className='flex items-center gap-2 text-sm font-bold'> <CgProfile/> {blog.author}</span>
                                        <span className='flex items-center gap-2 text-sm'><CiCalendarDate /> {blog.date}</span>
                                    </p>
                                    <h2 className='text-md font-medium line-clamp-1 mb-2'>
                                        {blog.title}
                                    </h2>
                                    <p className='line-clamp-3 text-sm tracking-wide '>
                                        {blog.shortDescription}
                                    </p>

                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BlogCard