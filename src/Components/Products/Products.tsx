"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Button from "../Button/Button";
import ProductsCard from "./ProductsCard";
import Link from "next/link";
import Loader from "@/app/(main)/loading";
import { useFetchProduct } from "@/hook/useFetchProduct";

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
  const { products, productsLoading } = useFetchProduct();
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
      setRandomProducts(shuffled);
    }
  }, [products]);

  if (productsLoading) return <Loader />;

  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">No products found.</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-teal-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
                Picked For You
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight rubik">
              Just For You
            </h2>
          </div>
          <Link
            href="/shopping"
            className="flex items-center gap-1.5 text-sm font-semibold
                       text-gray-500 dark:text-gray-400
                       hover:text-teal-500 dark:hover:text-teal-400
                       transition-colors duration-200 group"
          >
            Browse all
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {randomProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: (i % 5) * 0.07,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductsCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
              and many more
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <Link href="/shopping">
            <Button text="Find More" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
