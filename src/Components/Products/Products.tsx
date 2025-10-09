'use client';

import { useEffect, useState } from "react";
import Button from "../Button/Button";
import ProductsCard from "./ProductsCard";
import Link from 'next/link';
import Loader from "@/app/(main)/loading";

interface Product {
  _id: string;
  id: string;
  title: string;
  images: string[];
  price: number;
  discountPrice?: number;
  rating?: number;
  stock?: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-random-products", {
          cache: "no-store"
        });
        
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
     <Loader/>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center dark:text-white">
        <p>Products Not Found</p>
      </div>
    );
  }

  return (
    <div className="py-16 dark:text-white">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="rubik text-4xl font-bold">Just For You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductsCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center my-4">
          <Link href={'/shopping'}>
            <Button text={"See More"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
