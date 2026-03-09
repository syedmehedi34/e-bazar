// client/src/app/(main)/shopping/page.tsx
"use client";
import { Category } from "@/Components/Shopping/Category";
import ShoppingCard from "@/Components/Shopping/ShoppingCard";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Sorting from "@/Components/Shopping/Sorting";
import Pricerange from "@/Components/Shopping/Pricerange";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/Components/Loader/Loader";
import Pagination from "@/Components/Pagination2";
import { useFetchProduct } from "@/hook/useFetchProduct";
import { FiSearch, FiX } from "react-icons/fi"; // ← add these icons (or use your own)
import { BsGrid3X3GapFill, BsListUl } from "react-icons/bs";

interface CategoryGroup {
  name: string;
  subCategories: string[];
}

const Shopping = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { products, categories, productsLoading, refetchProducts } =
    useFetchProduct();

  const itemsPerPage = 12;
  const [paginatedProducts, setPaginatedProducts] = React.useState<
    typeof products
  >([]);

  // Current filter values from URL
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSubCategory = searchParams.get("subCategory") || "";
  const currentMinPrice = Number(searchParams.get("minPrice")) || 0;
  const currentMaxPrice = Number(searchParams.get("maxPrice")) || 0;
  const currentSort = searchParams.get("sort") || "";

  // Local state for search input (for smooth typing)
  const [searchInput, setSearchInput] = useState(currentSearch);

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync local input with URL when URL changes externally
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced search update (wait 400ms after typing stops)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput.trim()) {
          params.set("search", searchInput.trim());
        } else {
          params.delete("search");
        }
        router.push(`/shopping?${params.toString()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, currentSearch, searchParams, router]);

  // Reset all filters (including search)
  const handleReset = () => {
    setSearchInput("");
    router.push("/shopping");
  };

  useEffect(() => {
    refetchProducts();
  }, [searchParams, refetchProducts]);

  return (
    <div className="min-h-screen relative dark:text-white">
      <div className="container-custom">
        {/* Breadcrumb + Sorting + Search */}
        <div className="flex flex-col gap-5 py-6">
          {/* Breadcrumb */}
          <div className="flex gap-1 text-sm">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 underline underline-offset-2"
            >
              Home
            </Link>
            <p className="text-gray-400">/</p>
            <Link
              href="/shopping"
              className="text-gray-400 underline underline-offset-2"
            >
              Shopping
            </Link>
          </div>

          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="
                  w-full pl-10 pr-10 py-2.5 
                  border border-gray-300 dark:border-gray-600 
                  rounded-lg 
                  bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  placeholder-gray-400 dark:placeholder-gray-500
                "
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Sorting + View Toggle */}
            <div className="flex items-center gap-4">
              <Sorting
                currentSort={currentSort}
                setSort={(val) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (val) params.set("sort", val);
                  else params.delete("sort");
                  router.push(`/shopping?${params.toString()}`);
                }}
              />
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  <BsGrid3X3GapFill size={18} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  <BsListUl size={18} />
                </button>
              </div>
              {/*  */}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5 my-5">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Category
              categories={categories as CategoryGroup[]}
              selectedCategory={currentCategory}
              selectedSubCategory={currentSubCategory}
              setSelectedCategory={(cat) => {
                const params = new URLSearchParams(searchParams.toString());
                if (cat) params.set("category", cat);
                else params.delete("category");
                params.delete("subCategory");
                router.push(`/shopping?${params.toString()}`);
              }}
              setSelectedSubCategory={(sub) => {
                const params = new URLSearchParams(searchParams.toString());
                if (sub) params.set("subCategory", sub);
                else params.delete("subCategory");
                router.push(`/shopping?${params.toString()}`);
              }}
            />

            <Pricerange
              currentMinPrice={currentMinPrice}
              currentMaxPrice={currentMaxPrice}
              setMinPrice={(min) => {
                const params = new URLSearchParams(searchParams.toString());
                if (min > 0) params.set("minPrice", String(min));
                else params.delete("minPrice");
                router.push(`/shopping?${params.toString()}`);
              }}
              setMaxPrice={(max) => {
                const params = new URLSearchParams(searchParams.toString());
                if (max > 0) params.set("maxPrice", String(max));
                else params.delete("maxPrice");
                router.push(`/shopping?${params.toString()}`);
              }}
            />

            <button
              onClick={handleReset}
              className="btn btn-block dark:bg-gray-800 dark:text-white dark:border-gray-600 mt-4"
            >
              Reset Filter
            </button>
          </div>

          {/* Products */}
          <div className="lg:col-span-4 min-h-screen">
            {productsLoading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  No Products Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Try changing filters or search again.
                </p>
              </div>
            ) : (
              <div>
                <ShoppingCard
                  products={paginatedProducts}
                  viewMode={viewMode}
                />

                <Pagination
                  data={products}
                  itemsPerPage={itemsPerPage}
                  onPageDataChange={setPaginatedProducts}
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
