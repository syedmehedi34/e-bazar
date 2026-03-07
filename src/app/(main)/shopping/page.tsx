"use client";
import { Category } from "@/Components/Shopping/Category";
import ShoppingCard from "@/Components/Shopping/ShoppingCard";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import Sorting from "@/Components/Shopping/Sorting";
import Pricerange from "@/Components/Shopping/Pricerange";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/Components/Loader/Loader";
import Pagination from "@/Components/Pagination2";

const Shopping = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const itemsPerPage = 12;
  const [products, setProducts] = useState([]); // all products
  const [paginatedProducts, setPaginatedProducts] = useState([]); // current page products

  const [category, setCategory] = useState([]);
  const [sort, setSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  // fetch products based on filters
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all products
      const res = await axios.get(
        `https://e-bazaar-server-three.vercel.app/shopping?limit=1000`,
        {
          withCredentials: true,
        },
      );

      console.log(res?.data);
      setProducts(res?.data?.product); // all products
      setPaginatedProducts(res?.data?.product); // initial page data
      setCategory(res?.data?.allProducts); // for category filter
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // reset all filters and search
  const handleReset = () => {
    setSort("");
    setSelectedCategory("");
    setMinPrice(0);
    setMaxPrice(0);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/shopping?${params.toString()}`);
  };

  return (
    <div className="min-h-screen relative dark:text-white">
      <div className="container-custom">
        {/* sorting and nav section  */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 py-6 ">
          {/* Left side links */}
          <div className="flex gap-1 text-sm">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 transition-colors underline-offset-2 underline"
            >
              Home
            </Link>
            <p className="text-gray-400">/</p>
            <Link
              href="/shopping"
              className="text-gray-400 transition-colors underline-offset-2 underline"
            >
              Shopping
            </Link>
          </div>

          {/* Right side filter + result */}
          <Sorting setSort={setSort} />
        </div>

        <div className="grid lg:grid-cols-5 gap-5 my-5">
          {/* category and price range filter section */}
          <div className="lg:col-span-1">
            <Category
              products={category}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <Pricerange setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />

            <button
              onClick={handleReset}
              className="btn btn-block dark:bg-gray-800 dark:text-white dark:border-gray-600 mt-4"
            >
              Reset Filter
            </button>
          </div>

          {/* product display section */}
          <div className="lg:col-span-4 min-h-screen ">
            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <h2 className="text-xl font-semibold text-gray-700">
                  No Products Found
                </h2>
                <p className="text-gray-500 mt-1">
                  Try changing filters or search again.
                </p>
              </div>
            ) : (
              <div>
                {/* paginatedProducts used instead of products */}
                {<ShoppingCard products={paginatedProducts} />}

                {/* Pagination */}
                <Pagination
                  data={products} // full data
                  itemsPerPage={itemsPerPage} // items per page
                  onPageDataChange={setPaginatedProducts} // update current page
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
