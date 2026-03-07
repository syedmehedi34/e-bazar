"use client";
import { useEffect, useState } from "react";

interface PaginationProps<T> {
  data?: T[];
  itemsPerPage?: number;
  onPageDataChange: (items: T[]) => void;
}

const Pagination = <T,>({
  data = [],
  itemsPerPage = 6,
  onPageDataChange,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startItem =
    data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, data.length);

  // Send current page items to parent
  useEffect(() => {
    const currentItems = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    onPageDataChange(currentItems);
  }, [currentPage, data, itemsPerPage, onPageDataChange]);

  // Reset to page 1 when data changes (e.g. filter applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-5 flex-wrap">
      {/* Showing X to Y of Z */}
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{data.length}</span> items
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Previous */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border font-medium transition-colors
            ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
            }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-all
                ${
                  currentPage === page
                    ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200"
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border font-medium transition-colors
            ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

// const [paginatedDoctors, setPaginatedDoctors] = useState([]);
// const itemsPerPage = 10;

{
  /* <Pagination
  data={filteredDoctors}
  itemsPerPage={itemsPerPage}
  onPageDataChange={setPaginatedDoctors}
/>; */
}
