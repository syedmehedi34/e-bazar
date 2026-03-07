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

  const [products, setProducts] = useState([]); // all products
  const [paginatedProducts, setPaginatedProducts] = useState([]); // current page products

  const [category, setCategory] = useState([]);
  const [sort, setSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [total, setTotal] = useState(0);

  // items per page for client-side pagination
  const itemsPerPage = 12;

  // fetch products based on filters
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (sort) params.set("sort", sort);
      if (selectedCategory) params.set("category", selectedCategory);
      if (minPrice) params.set("minPrice", minPrice.toString());
      if (maxPrice) params.set("maxPrice", maxPrice.toString());
      if (search) params.set("search", search);

      // fetch all filtered products for client-side pagination
      params.set("limit", "1000"); // large limit to get all data

      const res = await axios.get(
        `https://e-bazaar-server-three.vercel.app/shopping?${params.toString()}`,
        {
          withCredentials: true,
        },
      );

      setProducts(res?.data?.product);
      setPaginatedProducts(res?.data?.product); // changed: initial page data
      setTotal(res?.data?.totalProducts);
      setCategory(res?.data?.allProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [sort, selectedCategory, minPrice, maxPrice, search]);

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
      {/* shop page header */}
      {/* <nav
        className="bg-cover w-full h-[200px] bgblack/50"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1546213290-e1b492ab3eee?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        }}
      >
        <h2 className="flex justify-center items-center h-full text-2xl font-bold text-white tracking-wide">
          Shopping
        </h2>
      </nav> */}

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
          <Sorting setSort={setSort} total={total} />
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
