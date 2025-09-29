"use client";
import React from "react";
import { IoIosArrowRoundForward ,IoIosArrowRoundBack } from "react-icons/io";
type PaginationProps = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageArray: number[];
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  pageArray,
}) => {
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1 sm:gap-2">
        {/* Previous Button */}
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md disabled:opacity-50 text-sm sm:text-base"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <span className="hidden sm:inline"><IoIosArrowRoundBack  size={20}/></span>
          <span className="sm:hidden">←</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageArray?.map((page) => {
         
            if (
              typeof window !== "undefined" &&
              window.innerWidth < 640 &&
              page !== 0 &&
              page !== pageArray.length - 1 &&
              Math.abs(page - currentPage) > 1
            ) {
              if (Math.abs(page - currentPage) === 2) {
                return (
                  <span key={page} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-sm sm:text-base ${
                  currentPage === page
                    ? "bg-gray-800 text-white"
                    : "border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page }
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md disabled:opacity-50 text-sm sm:text-base"
          disabled={pageArray?.length - 1 === currentPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <span className="hidden sm:inline"><IoIosArrowRoundForward size={20} /></span>
          <span className="sm:hidden">→</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
