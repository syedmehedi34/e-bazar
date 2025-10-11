"use client";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Tag, PackagePlus, } from "lucide-react";
import { CiImageOn } from "react-icons/ci";

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
        payload,
        {withCredentials:true}
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
    <div className="min-h-screen flex justify-center items-center py-10 bg-white dark:bg-gray-800 rounded-box">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full  bg-white dark:bg-gray-800 dark:text-white p-8 rounded-2xl shadow-xl space-y-6"
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
            className="w-full input dark:bg-gray-600"
            {...register("title", { required: true })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
            Description
          </label>
          <textarea
            rows={5}
            placeholder="Enter Your Description..."
            className="w-full textarea dark:bg-gray-600 "
            {...register("description", { required: true })}
          />
        </div>

        {/* Price & Discount */}
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Price
            </label>
            <input
              type="number"
              placeholder="Price"

              className="w-full input dark:bg-gray-600"
              {...register("price", { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Discount Price
            </label>
            <input
              type="number"
              placeholder="Discount Price"
              className="w-full input dark:bg-gray-600"
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
              className="w-full input dark:bg-gray-600"
              {...register("currency", { required: true })}
            />
          </div>

          {/* Category & SubCategory */}

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Category
            </label>
            <input
              type="text"
              placeholder="Category"
              className="w-full input dark:bg-gray-600"
              {...register("category", { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Sub Category
            </label>
            <input
              type="text"
              placeholder="SubCategory"
              className="w-full input dark:bg-gray-600"
              {...register("subCategory", { required: true })}
            />
          </div>
          {/* Brand & Rating */}

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Brand
            </label>
            <input
              type="text"
              placeholder="Brand"
              className="w-full input dark:bg-gray-600"
              {...register("brand", { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Rating (0-5)"
              className="w-full input dark:bg-gray-600"
              {...register("rating", { min: 0, max: 5 })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Stock
            </label>
            <input
              type="number"
              placeholder="Stock"
              className="w-full input dark:bg-gray-600"
              {...register("stock", { required: true })}
            />
          </div>
          {/* Sizes */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-1">
              Sizes (comma separated)
            </label>
            <input
              type="text"
              placeholder="One Size, M, L"
              className="w-full input dark:bg-gray-600"
              {...register("sizes")}
            />
          </div>

          {/* Images */}
          <div>
            <label className=" text-sm font-semibold text-gray-600 mb-1 dark:text-white flex items-center gap-1">
              <CiImageOn size={20} />
              Images (comma separated URLs)
            </label>
            <input
              type="text"
              placeholder="https://..."
              className="w-full input dark:bg-gray-600"
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
              className="w-full input dark:bg-gray-600"
              {...register("tags")}
            />
          </div>
        </div>




        <div className="">
          <label>Featured</label>
          <input type="checkbox" {...register("featured")} className=" checkbox dark:bg-gray-600 ml-4" />

        </div>


        {/* Stock & Featured */}
        <div className="grid grid-cols-2 gap-4">


        </div>
        <div className="grid lg:grid-cols-2  grid-cols-1 gap-4">

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
