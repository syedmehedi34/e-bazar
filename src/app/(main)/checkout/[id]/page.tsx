"use client";

import React from "react";
import { use } from "react";
import BackButton from "@/Components/Button/BackButton";
import ImagesGalleryClientWrapper from "@/Components/Checkout/ImagesGalleryClientWrapper";
import CheckoutDescription from "@/Components/Checkout/CheckoutDescription";
import { useProductById } from "@/hook/useProductById";

const CheckoutPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { product, productLoading, productError } = useProductById(id);
  console.log(product);

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container-custom">
        <div className="mb-4">
          <BackButton />
        </div>
        <ImagesGalleryClientWrapper products={product} />
        <div>
          <CheckoutDescription products={product} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
