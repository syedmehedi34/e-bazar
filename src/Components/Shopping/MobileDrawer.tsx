"use client";

import { memo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { CategoryGroup } from "./types";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  activeCount: number;
  // pass-through to FilterSidebar
  categories: CategoryGroup[];
  qCat: string;
  qSub: string;
  qMin: number;
  qMax: number;
  openCat: string | null;
  onSetOpenCat: (name: string | null) => void;
  onSelectCategory: (cat: string | null, sub: string | null) => void;
  onPriceChange: (key: "minPrice" | "maxPrice", val: number) => void;
  onReset: () => void;
}

function MobileDrawer({
  open,
  onClose,
  activeCount,
  ...sidebarProps
}: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-zinc-900 z-50 flex flex-col shadow-2xl lg:hidden transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={14} className="text-zinc-500" />
            <span className="text-sm font-bold">Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={16} className="text-zinc-500" />
          </button>
        </div>

        {/* Scrollable filter body */}
        <div className="flex-1 overflow-y-auto p-5">
          <FilterSidebar activeCount={activeCount} {...sidebarProps} />
        </div>
      </div>
    </>
  );
}

export default memo(MobileDrawer);
