'use client'

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Fashion = () => {
    const categories = [
        { name: "Men's Fashion", img: "https://img.freepik.com/free-photo/portrait-young-man-with-hat-sunglasses_23-2148466013.jpg" },
        { name: "Women's Fashion", img: "https://img.freepik.com/free-photo/smiley-woman-holding-her-hat_23-2148647651.jpg" },
        { name: "Electronics & Gadget", img: "https://img.freepik.com/free-photo/woman-using-modern-headphones-smartphone-device-home_23-2148793466.jpg" },
    ];

    return (
        <div className="my-10">
            <div className="container-custom">


                <div className="flex flex-wrap gap-6 justify-between">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="relative group w-full sm:w-92 h-64 sm:h-96 overflow-hidden rounded-lg shadow-lg cursor-pointer"
                        >
                            <Image
                                width={100}
                                height={100}
                                src={cat.img}
                                alt={cat.name}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Hover Overlay sliding from bottom */}
                            <div className="absolute inset-0 flex items-end transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <div className="w-full p-4 sm:p-6 text-center bg-black/70">
                                    <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">{cat.name}</h2>
                                    <Link href={'/shopping'} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition text-sm sm:text-base">
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Fashion;
