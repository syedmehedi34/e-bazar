"use client";

import { memo, RefObject } from "react";
import {
  ArrowUpDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ViewMode } from "./types";
import { PER_PAGE_OPTIONS, SORT_OPTIONS } from "./constants";

interface ToolbarProps {
  search: string;
  qSort: string;
  view: ViewMode;
  perPage: number;
  activeCount: number;
  searchRef: RefObject<HTMLInputElement>;
  onSearchChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onViewChange: (v: ViewMode) => void;
  onPerPageChange: (n: number) => void;
  onOpenDrawer: () => void;
}

function Toolbar({
  search,
  qSort,
  view,
  perPage,
  activeCount,
  searchRef,
  onSearchChange,
  onSortChange,
  onViewChange,
  onPerPageChange,
  onOpenDrawer,
}: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm">
      {/* Left: mobile filter btn + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onOpenDrawer}
          className="lg:hidden relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm font-semibold transition-colors shrink-0"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={13}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-500 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X size={11} className="text-zinc-400" />
            </button>
          )}
        </div>
      </div>

      {/* Right: sort + view + per-page */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Sort */}
        <div className="relative flex items-center">
          <ArrowUpDown
            size={11}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <select
            value={qSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-7 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer appearance-none font-medium transition-all"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-6 w-px bg-zinc-100 dark:bg-zinc-800" />

        {/* View toggle */}
        <div className="flex items-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1 gap-0.5">
          {(
            [
              ["grid", LayoutGrid],
              ["list", List],
            ] as const
          ).map(([mode, Icon]) => (
            <button
              key={mode}
              onClick={() => onViewChange(mode)}
              aria-label={`${mode} view`}
              className={`p-2 rounded-lg transition-all duration-150 ${
                view === mode
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        {/* Per page */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium hidden sm:block">
            Show
          </span>
          <select
            value={perPage}
            onChange={(e) => {
              const v = Number(e.target.value);
              if ((PER_PAGE_OPTIONS as readonly number[]).includes(v))
                onPerPageChange(v);
            }}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer font-medium transition-all"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default memo(Toolbar);
