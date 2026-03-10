"use client";

import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import Loader from "@/Components/Loader";
import Pagination from "@/Components/Pagination2";

import { useShoppingLogic } from "./useShoppingLogic";
import { CategoryGroup, Product } from "./types";
import MobileDrawer from "./MobileDrawer";
import FilterSidebar from "./FilterSidebar";
import Toolbar from "./Toolbar";
import ActiveFilters from "./ActiveFilters";
import GridCard from "./GridCard";
import ListCard from "./ListCard";

export default function ShoppingClient() {
  const {
    products,
    categories,
    productsLoading,
    page,
    setPage,
    qSearch,
    qCat,
    qSub,
    qMin,
    qMax,
    qSort,
    activeCount,
    search,
    setSearch,
    view,
    setView,
    perPage,
    setPerPage,
    drawer,
    setDrawer,
    openCat,
    setOpenCat,
    wishlist,
    searchRef,
    setParam,
    reset,
    toggleWishlist,
    handleAddToCart,
  } = useShoppingLogic();

  // ── Sidebar event handlers ─────────────────────────────────────────────
  const handleSelectCategory = (cat: string | null, sub: string | null) => {
    setParam("category", cat);
    setParam("subCategory", sub);
    if (!cat) setOpenCat(null);
  };

  const handlePriceChange = (key: "minPrice" | "maxPrice", val: number) => {
    setParam(key, val > 0 ? String(val) : null);
  };

  // Shared sidebar props
  const sidebarProps = {
    categories: categories as CategoryGroup[],
    qCat,
    qSub,
    qMin,
    qMax,
    openCat,
    activeCount,
    onSetOpenCat: setOpenCat,
    onSelectCategory: handleSelectCategory,
    onPriceChange: handlePriceChange,
    onReset: reset,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Mobile filter drawer */}
      <MobileDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        {...sidebarProps}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-600 mb-7">
          <Link
            href="/"
            className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-zinc-600 dark:text-zinc-400 font-semibold">
            Shop
          </span>
        </nav>

        {/* Page header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              {qCat || "All Products"}
            </h1>
            {!productsLoading && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                  {products.length}
                </span>{" "}
                items
                {qSearch && (
                  <>
                    {" "}
                    for <span className="italic">&ldquo;{qSearch}&rdquo;</span>
                  </>
                )}
                {qSub && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                      {qSub}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={reset}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="mb-5">
          <Toolbar
            search={search}
            qSort={qSort}
            view={view}
            perPage={perPage}
            activeCount={activeCount}
            searchRef={searchRef}
            onSearchChange={setSearch}
            onSortChange={(val) => setParam("sort", val || null)}
            onViewChange={setView}
            onPerPageChange={setPerPage}
            onOpenDrawer={() => setDrawer(true)}
          />
        </div>

        {/* Active filter chips */}
        <ActiveFilters
          qCat={qCat}
          qSub={qSub}
          qMin={qMin}
          qMax={qMax}
          qSearch={qSearch}
          onClearCat={() => handleSelectCategory(null, null)}
          onClearSub={() => setParam("subCategory", null)}
          onClearPrice={() => {
            setParam("minPrice", null);
            setParam("maxPrice", null);
          }}
          onClearSearch={() => {
            setSearch("");
            setParam("search", null);
          }}
        />

        {/* Main layout */}
        <div className="flex gap-7">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={13} className="text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    Filters
                  </span>
                </div>
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </div>
              <FilterSidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Product area */}
          <main className="flex-1 min-w-0">
            {productsLoading ? (
              <div className="flex items-center justify-center h-80">
                <Loader />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center px-8">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-5">
                  <Search
                    size={22}
                    className="text-zinc-300 dark:text-zinc-600"
                  />
                </div>
                <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nothing found
                </h3>
                <p className="text-sm text-zinc-400 mb-5">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all"
                >
                  Browse All Products
                </button>
              </div>
            ) : (
              <>
                {view === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {page.map((p) => (
                      <GridCard
                        key={p._id}
                        product={p as Product}
                        qSearch={qSearch}
                        wished={wishlist.has(p._id)}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {page.map((p) => (
                      <ListCard
                        key={p._id}
                        product={p as Product}
                        qSearch={qSearch}
                        wished={wishlist.has(p._id)}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-10">
                  <Pagination
                    data={products}
                    itemsPerPage={perPage}
                    onPageDataChange={setPage}
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
