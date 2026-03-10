"use client";

import { memo } from "react";
import { X } from "lucide-react";

interface Chip {
  label: string;
  clear: () => void;
}

interface ActiveFiltersProps {
  qCat: string;
  qSub: string;
  qMin: number;
  qMax: number;
  qSearch: string;
  onClearCat: () => void;
  onClearSub: () => void;
  onClearPrice: () => void;
  onClearSearch: () => void;
}

function ActiveFilters({
  qCat,
  qSub,
  qMin,
  qMax,
  qSearch,
  onClearCat,
  onClearSub,
  onClearPrice,
  onClearSearch,
}: ActiveFiltersProps) {
  const chips: Chip[] = [
    ...(qCat ? [{ label: qCat, clear: onClearCat }] : []),
    ...(qSub ? [{ label: qSub, clear: onClearSub }] : []),
    ...(qMin > 0 || qMax > 0
      ? [
          {
            label: `৳${qMin || 0}–${qMax > 0 ? `৳${qMax}` : "∞"}`,
            clear: onClearPrice,
          },
        ]
      : []),
    ...(qSearch ? [{ label: `"${qSearch}"`, clear: onClearSearch }] : []),
  ];

  if (!chips.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
        Active:
      </span>
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.clear}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors group"
        >
          {chip.label}
          <X
            size={10}
            strokeWidth={2.5}
            className="opacity-60 group-hover:opacity-100"
          />
        </button>
      ))}
    </div>
  );
}

export default memo(ActiveFilters);
