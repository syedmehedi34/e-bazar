"use client";

import React, { useState } from "react";
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";

type Product = {
  category: string;
  subCategory: string;
};

interface CategoryProps {
  products: Product[];
  selectedCategory: string; // ← এটা যোগ করো (string | null ও করতে পারো)
  setSelectedCategory: (category: string) => void;
}

export const Category: React.FC<CategoryProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const categories = products?.reduce(
    (acc: Record<string, Set<string>>, product) => {
      if (!acc[product.category]) {
        acc[product.category] = new Set<string>();
      }
      acc[product.category].add(product.subCategory);
      return acc;
    },
    {} as Record<string, Set<string>>,
  );

  const handleSubCategoryClick = (sub: string) => {
    setSelectedCategory(sub);
  };

  return (
    <div className="mb-8">
      <p className="text-lg font-bold mb-5 text-gray-900 dark:text-white">
        Category
      </p>

      <div className="space-y-1">
        {Object.keys(categories || {}).map((category) => {
          const isOpen = openCategory === category;
          const subCategories = Array.from(categories[category] || []);

          return (
            <div key={category} className="rounded-md overflow-hidden">
              {/* Main category */}
              <button
                className={`
                  flex items-center justify-between w-full 
                  px-4 py-3 text-left font-medium
                  bg-gray-100 hover:bg-gray-200 
                  dark:bg-gray-800 dark:hover:bg-gray-700
                  dark:text-gray-200
                  transition-colors duration-150
                `}
                onClick={() => setOpenCategory(isOpen ? null : category)}
              >
                <span>{category}</span>
                <MdOutlineArrowDropDown
                  className={`text-xl transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Subcategories */}
              {isOpen && (
                <ul className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  {subCategories.map((sub) => {
                    const isActive = selectedCategory === sub;

                    return (
                      <li key={sub}>
                        <button
                          onClick={() => handleSubCategoryClick(sub)}
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ✓
                            </span>
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
