"use client"
import React, { useState } from "react"
import ImagesGallery from "./ImagesGallery"
import CheckoutDetails from "./CheckoutDetails"

interface Products {
    _id: string;
    title: string;
    price: number;
    category: string;
    currency: string;
    quantity: number;
    brand: string;
    rating: number;
    stock: number;
    sizes: string[];
    colors: string[];
    discountPrice: number;
    images: string[];
    description: string;

}

type Props = {
    products: Products
}

const ImagesGalleryClientWrapper: React.FC<Props> = ({ products }) => {
    const [selectedImage, setSelectedImage] = useState<string>(
        products.images[0]
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ImagesGallery
                products={products}
                onSelectImage={(img) => setSelectedImage(img)}
            />
            <CheckoutDetails products={products} selectedImage={selectedImage} />
        </div>
    )
}

export default ImagesGalleryClientWrapper
