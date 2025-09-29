"use client";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Tag, Image, PackagePlus, } from "lucide-react";

interface ProductFormInputs {
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  currency: string;
  category: string;
  subCategory: string;
  brand: string;
  rating: number;
  stock: number;
  featured: boolean;
  sizes: string | string[];
  images: string | string[];
  tags: string | string[];
}

const ProductForm = () => {
  const { register, handleSubmit } = useForm<ProductFormInputs>();

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    try {
      const payload = {
        ...data,
        sizes:
          typeof data.sizes === "string"
            ? data.sizes.split(",").map((s) => s.trim())
            : [],
        images:
          typeof data.images === "string"
            ? data.images.split(",").map((i) => i.trim())
            : [],
        tags:
          typeof data.tags === "string"
            ? data.tags.split(",").map((t) => t.trim())
            : [],
      };

      const res = await axios.post(
        "http://localhost:5000/admin/add-products",
        payload
      );
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: `${res.data.message || "Product Added Successfully!"}`,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Failed to Add Product!",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 dark:text-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <PackagePlus className="text-blue-600 dark:text-white" /> Add New Product
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter Your Title..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("title", { required: true })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
            Description
          </label>
          <textarea
            rows={3}
              placeholder="Enter Your Description..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("description", { required: true })}
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price"
          
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("price", { required: true })}
          />
          <input
            type="number"
            placeholder="Discount Price"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("discountPrice")}
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
            Currency
          </label>
          <input
            type="text"
            placeholder="BDT"
            className="w-full p-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("currency", { required: true })}
          />
        </div>

        {/* Category & SubCategory */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Category"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("category", { required: true })}
          />
          <input
            type="text"
            placeholder="SubCategory"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("subCategory", { required: true })}
          />
        </div>

        {/* Brand & Rating */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Brand"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("brand", { required: true })}
          />
          <input
            type="number"
            step="0.1"
            placeholder="Rating (0-5)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("rating", { min: 0, max: 5 })}
          />
        </div>

        {/* Stock & Featured */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Stock"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("stock", { required: true })}
          />
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-3">
            <input type="checkbox" {...register("featured")} />
            <label>Featured</label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
            Sizes (comma separated)
          </label>
          <input
            type="text"
            placeholder="One Size, M, L"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("sizes")}
          />
        </div>

        {/* Images */}
        <div>
          <label className=" text-sm font-semibold text-gray-600 mb-1 dark:text-white flex items-center gap-1">
            <Image size={16} /> Images (comma separated URLs)
          </label>
          <input
            type="text"
            placeholder="https://..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("images")}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="dark:text-white text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
            <Tag size={16} /> Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="charger, phone, usb-c"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            {...register("tags")}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-black dark:bg-gray-700 hover:bg-gray-900 cursor-pointer text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
