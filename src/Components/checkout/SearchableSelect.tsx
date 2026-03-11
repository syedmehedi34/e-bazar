"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X, CheckCircle2 } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`w-full flex items-center justify-between bg-white border rounded-xl px-4 py-3 text-sm
                    transition-all focus:outline-none
                    ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : "cursor-pointer hover:border-teal-400 border-gray-200"}
                    ${open ? "border-teal-500 ring-2 ring-teal-500/20" : ""}
                    ${value ? "text-gray-800" : "text-gray-400"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full pl-8 pr-8 py-2 text-xs bg-gray-50 rounded-lg focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No results found
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700
                              ${value === opt ? "bg-teal-50 text-teal-700 font-semibold" : "text-gray-700"}`}
                >
                  {opt}
                  {value === opt && (
                    <CheckCircle2 className="inline w-3.5 h-3.5 ml-2 text-teal-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
