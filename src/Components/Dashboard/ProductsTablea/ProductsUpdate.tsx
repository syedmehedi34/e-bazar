"use client";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

interface Products {
    _id: string
    title: string;
    category: string;
    stock: number;
    price: number;

}
type FormInputs = {
    _id: string;
    title: string;
    category: string;
    stock: number;
    price: number;
};

type ProductsUpdateProps = {
    setIsOpen: (isOpen: boolean) => void;
    updateProducts: Products,
    onUpdate: () => void
};

const ProductsUpdate: React.FC<ProductsUpdateProps> = ({
    setIsOpen,
    updateProducts,
    onUpdate
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>();

    useEffect(() => {
        if (updateProducts) {
            reset({
                title: updateProducts.title,
                category: updateProducts.category,
                stock: updateProducts.stock,
                price: updateProducts.price,
            });
        }
    }, [updateProducts, reset]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {

        try {

            const res = await axios.patch(`https://e-bazaar-server-three.vercel.app/products?_id=${updateProducts?._id}`, data);

            if (res?.data) {
                toast.success("Product updated successfully!")

                onUpdate()


            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Product updated Unsuccessfully!")
        } finally {

            setIsOpen(false)
        }
    };

    return (
        <div className="w-6/12 mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Update Product
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            {...register("category", { required: "Category is required" })}
                            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.category && (
                            <p className="text-red-500 text-sm">{errors.category.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {/* Stock */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                            Stock
                        </label>
                        <input
                            type="number"
                            {...register("stock", {
                                required: "Stock is required",
                                min: { value: 0, message: "Stock cannot be negative" },
                            })}
                            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.stock && (
                            <p className="text-red-500 text-sm">{errors.stock.message}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            {...register("price", {
                                required: "Price is required",
                                min: { value: 1, message: "Price must be greater than 0" },
                            })}
                            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm">{errors.price.message}</p>
                        )}
                    </div>
                </div>
                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductsUpdate;
