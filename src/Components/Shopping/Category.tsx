"use client";

import React, { useState } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";

interface CategoryGroup {
  name: string;
  subCategories: string[];
}

interface CategoryProps {
  categories: CategoryGroup[];
  selectedCategory: string;
  selectedSubCategory: string;
  setSelectedCategory: (cat: string) => void;
  setSelectedSubCategory: (sub: string) => void;
}

export const Category: React.FC<CategoryProps> = ({
  categories,
  selectedCategory,
  selectedSubCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <p className="text-lg font-bold mb-5 text-gray-900 dark:text-white">
        Categories
      </p>

      <div className="space-y-1">
        {/* All Categories */}
        <button
          onClick={() => {
            setSelectedCategory("");
            setSelectedSubCategory("");
            setOpenCategory(null);
          }}
          className={`
            flex items-center justify-between w-full 
            px-4 py-3 text-left font-medium
            transition-colors
            hover:bg-gray-100 dark:hover:bg-gray-800/50
            ${
              !selectedCategory
                ? "bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-600 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-300"
            }
          `}
        >
          <span>All Categories</span>
          {!selectedCategory && <span className="text-xs">✓</span>}
        </button>

        {categories.map((group) => {
          const isOpen = openCategory === group.name;
          const isCategoryActive = selectedCategory === group.name;

          return (
            <div key={group.name} className="rounded-md overflow-hidden">
              {/* Main category header */}
              <button
                className={`
                  flex items-center justify-between w-full 
                  px-4 py-3 text-left font-medium
                  bg-gray-100 hover:bg-gray-200 
                  dark:bg-gray-800 dark:hover:bg-gray-700
                  dark:text-gray-200
                  transition-colors duration-150
                  ${isCategoryActive ? "border-l-4 border-gray-600" : ""}
                `}
                onClick={() => {
                  setOpenCategory(isOpen ? null : group.name);
                  // Optional: auto-select main category when opening
                  // setSelectedCategory(group.name);
                  // setSelectedSubCategory("");
                }}
              >
                <span>{group.name}</span>
                <MdOutlineArrowDropDown
                  className={`text-xl transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Subcategories */}
              {isOpen && (
                <ul className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  {group.subCategories.map((sub) => {
                    const isActive = selectedSubCategory === sub;

                    return (
                      <li key={sub}>
                        <button
                          onClick={() => {
                            setSelectedCategory(group.name); // ensure parent is selected
                            setSelectedSubCategory(sub);
                          }}
                          className={`
                            flex items-center justify-between w-full 
                            px-8 py-3 text-sm
                            transition-colors duration-150
                            hover:bg-gray-50 dark:hover:bg-gray-800/50
                            ${
                              isActive
                                ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white border-l-4 border-gray-600"
                                : "text-gray-700 dark:text-gray-300"
                            }
                          `}
                        >
                          <span>{sub}</span>
                          {isActive ? (
                            <span className="text-xs">✓</span>
                          ) : (
                            <MdOutlineArrowRight className="text-gray-400" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
