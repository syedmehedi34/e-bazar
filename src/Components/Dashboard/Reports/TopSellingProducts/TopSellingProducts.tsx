"use client";

import React from "react";

interface ITopSellingProducts {
    _id: string;
    title: string;
    image: string;
    category: string;
    totalQuantity: number;
    totalSales: number;
}

type TopSellingProps = {
    topSellingProducts: ITopSellingProducts[];
};

const TopSellingProducts: React.FC<TopSellingProps> = ({ topSellingProducts }) => {
    return (
        <div className="p-5 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>

            <div className="overflow-x-auto">
                <table className="table  w-full text-sm">
                    <thead>
                        <tr>
                            
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Total Quantity</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>

                    <tbody>
                        {topSellingProducts && topSellingProducts.length > 0 ? (
                            topSellingProducts.map((product, index) => (
                                <tr key={product._id}>
                                 
                                    <td>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-8 h-8 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </td>
                                    <td>{product.title}</td>
                                    <td>{product.category}</td>
                                    <td>{product.totalQuantity}</td>
                                    <td>৳ {product.totalSales}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopSellingProducts;
