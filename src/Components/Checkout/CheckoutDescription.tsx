import Image from 'next/image';
import React from 'react';
import { MdOutlineStar } from 'react-icons/md';

interface products {
    _id: string;
    description: string;
    reviews: { user: string; rating: number; comment: string }[];
    tags: string;
    images: string[];
}

type CheckoutDetailsProps = {
    products: products;
};

const CheckoutDescription: React.FC<CheckoutDetailsProps> = ({ products }) => {
    return (
        <div className="rubik my-10">
            {/* Product Description */}
            <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
            <p className="text-gray-700 leading-7">{products?.description}</p>

            <div className='my-10 '>
                <Image
                    src={products?.images?.[2] || '/placeholder.png'}
                    width={100}
                    height={10}
                    alt="Product Image"
                    priority
                    
                    className="w-full h-auto mb-6 rounded-lg object-cover"
                />
            </div>

            {/* Reviews Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>



                {products?.reviews?.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {products.reviews.map((review, index) => (
                            <div
                                key={index}
                                className="p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                            >
                                {/* User */}
                                <p className="font-semibold text-lg mb-2">{review.user}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(Math.floor(review.rating)).keys()].map((i) => (
                                        <span key={i} className=" text-lg">
                                            <MdOutlineStar size={20} />
                                        </span>
                                    ))}
                                    {/* যদি fractional rating দরকার হয় future এ, এখানে half star add করা যাবে */}
                                    <span className="ml-2 text-sm text-gray-500">
                                        {review.rating}/5
                                    </span>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-600 leading-6">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">
                        No reviews yet. Be the first to share your experience!
                    </p>
                )}
            </div>
        </div>
    );
};

export default CheckoutDescription;
