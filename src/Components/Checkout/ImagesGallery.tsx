"use client"
import Image from 'next/image'
import React, { useRef, useState } from 'react'

interface Product {
    images: string[]
}

type ProductsProps = {
    products: Product
}

const ImagesGallery: React.FC<ProductsProps> = ({ products }) => {
    const [selectedImage, setSelectedImage] = useState(products?.images[0] || '');
    const [isZoomed, setIsZoomed] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
 const zoomScale = 2
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const { left, top, width, height } = containerRef.current.getBoundingClientRect()

   
        const x = (e.clientX - left) / width
        const y = (e.clientY - top) / height

        setPosition({ x, y })
    }
    return (
        <div>
            <div
                ref={containerRef}
                className=" relative overflow-hidden shadow-lg rounded-box">
                <div

                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}

                    className='cursor-zoom-in h-[500px] flex items-center justify-center bg-white'
                >
                    <Image
                        src={selectedImage || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                        alt="Selected"
                        width={400}
                        height={400}
                        className="object-contain w-full h-[450px]  rounded-lg mx-auto"
                        priority
                           style={{
                        transform: isZoomed
                            ? `scale(${zoomScale}) translate(${-position.x * (zoomScale - 1) * 100}%, ${-position.y * (zoomScale - 1) * 100}%)`
                            : "scale(1) translate(0,0)",
                        transformOrigin: "top left",
                    }}
                    />
                </div>
            </div>
            <div className="my-8 flex justify-center items-center gap-10 shadow-lg p-2 rounded-box bg-gray-200 ">
                {products?.images?.map((img: string, index: number) => (
                    <div
                        key={index}
                        className={`shadow rounded-lg overflow-hidden cursor-pointer p-4  bg-white ${selectedImage === img ? 'bg-gray-300' : 'bg-gray-300'} transition-all duration-300`}
                        onClick={() => setSelectedImage(img)}
                        onMouseEnter={() => setSelectedImage(img)}
                    >
                        <Image
                            src={img || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-contain w-full h-20"
                            priority
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImagesGallery
