"use client";

import { memo } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { CategoryGroup } from "./types";

interface FilterSidebarProps {
  categories: CategoryGroup[];
  qCat: string;
  qSub: string;
  qMin: number;
  qMax: number;
  openCat: string | null;
  activeCount: number;
  onSetOpenCat: (name: string | null) => void;
  onSelectCategory: (cat: string | null, sub: string | null) => void;
  onPriceChange: (key: "minPrice" | "maxPrice", val: number) => void;
  onReset: () => void;
}

function FilterSidebar({
  categories,
  qCat,
  qSub,
  qMin,
  qMax,
  openCat,
  activeCount,
  onSetOpenCat,
  onSelectCategory,
  onPriceChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <div>
      {/* ── Categories ── */}
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-500 mb-3">
        Categories
      </p>

      <div className="space-y-0.5">
        {/* All products */}
        <button
          onClick={() => onSelectCategory(null, null)}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
            !qCat
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 font-medium"
          }`}
        >
          <span>All Products</span>
          {!qCat && <Check size={13} strokeWidth={2.5} />}
        </button>

        {/* Category groups */}
        {categories.map((g) => {
          const isOpen = openCat === g.name;
          const catActive = qCat === g.name;

          return (
            <div key={g.name}>
              <button
                onClick={() => onSetOpenCat(isOpen ? null : g.name)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  catActive && !qSub
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/70"
                }`}
              >
                <span>{g.name}</span>
                <span
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={14} className="text-zinc-400" />
                </span>
              </button>

              {isOpen && (
                <div className="ml-2.5 pl-3 border-l-2 border-zinc-100 dark:border-zinc-800 mt-0.5 mb-1 space-y-0.5">
                  {g.subCategories.map((sub) => {
                    const active = qSub === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => onSelectCategory(g.name, sub)}
                        className={`flex items-center justify-between w-full px-2.5 py-2 rounded-md text-xs transition-all duration-150 ${
                          active
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span>{sub}</span>
                        {active ? (
                          <Check size={11} strokeWidth={2.5} />
                        ) : (
                          <ChevronRight
                            size={11}
                            className="text-zinc-300 dark:text-zinc-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Price range ── */}
      <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-500 mb-3">
          Price Range
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { label: "Min ৳", val: qMin, key: "minPrice" as const, ph: "0" },
              { label: "Max ৳", val: qMax, key: "maxPrice" as const, ph: "∞" },
            ] as const
          ).map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-zinc-400 dark:text-zinc-500 mb-1 font-medium">
                {f.label}
              </label>
              <input
                type="number"
                min={0}
                value={f.val || ""}
                placeholder={f.ph}
                onChange={(e) => {
                  const v = e.target.value === "" ? 0 : Number(e.target.value);
                  onPriceChange(f.key, v);
                }}
                className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-300 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/15 dark:focus:ring-white/15 transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Reset ── */}
      {activeCount > 0 && (
        <div className="mt-5">
          <button
            onClick={onReset}
            className="w-full py-2.5 rounded-lg text-xs font-semibold text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            Clear all filters ({activeCount})
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(FilterSidebar);
