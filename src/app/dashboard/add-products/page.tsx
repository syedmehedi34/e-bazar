"use client";
import axios from "axios";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";



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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInputs>();

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
   try {
    const payload = {
      ...data,
      sizes: typeof data.sizes === "string" ? data.sizes.split(",").map(s => s.trim()) : [],
      images: typeof data.images === "string" ? data.images.split(",").map(i => i.trim()) : [],
      tags: typeof data.tags === "string" ? data.tags.split(",").map(t => t.trim()) : [],
    }

      const res = await axios.post('http://localhost:5000/admin/add-products', payload);
      if(res.status === 200){
        Swal.fire({
          icon:"success",
          title:`${res.data.message || "Data Add Successful!!"} `
        })
      }
   } catch (error) {
   
     Swal.fire({
          icon:"error",
          title:`${(error as any).response.data.message || "Data Add Faild!!"} `
        })
   }
  };

  return (
    <div className="p-6 text-white min-h-screen flex justify-center items-start w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-transparent p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Product</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border-b border-gray-300 bg-transparent"
            {...register("title", { required: true })}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 border-b border-gray-300 bg-transparent"
            {...register("description", { required: true })}
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="Price"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("price", { required: true })}
          />
          <input
            type="number"
            placeholder="Discount Price"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("discountPrice")}
          />
        </div>

        {/* Currency */}
        <div className="mb-4">
          <label className="block mb-1">Currency</label>
          <input
            type="text"
            placeholder="BDT"
            className="w-full p-2 border-b border-gray-300 bg-transparent"
            {...register("currency", { required: true })}
          />
        </div>

        {/* Category & SubCategory */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Category"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("category", { required: true })}
          />
          <input
            type="text"
            placeholder="SubCategory"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("subCategory", { required: true })}
          />
        </div>

        {/* Brand & Rating */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Brand"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("brand", { required: true })}
          />
          <input
            type="number"
            step="0.1"
            placeholder="Rating (0-5)"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("rating", { min: 0, max: 5 })}
          />
        </div>

        {/* Stock & Featured */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="Stock"
            className="p-2 border-b border-gray-300 bg-transparent"
            {...register("stock", { required: true })}
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("featured")} />
            <label>Featured</label>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <label className="block mb-1">Sizes (comma separated)</label>
          <input
            type="text"
            placeholder="One Size, M, L"
            className="w-full p-2 border-b border-gray-300 bg-transparent"
            {...register("sizes")}
          />
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block mb-1">Images (comma separated URLs)</label>
          <input
            type="text"
            placeholder="https://..."
            className="w-full p-2 border-b border-gray-300 bg-transparent"
            {...register("images")}
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block mb-1">Tags (comma separated)</label>
          <input
            type="text"
            placeholder="charger, gan, usb-c"
            className="w-full p-2 border-b border-gray-300 bg-transparent"
            {...register("tags")}
          />
        </div>


    

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-gray-800 text-white font-bold rounded hover:bg-red-700 transition"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
