"use client";

interface SortingProps {
  currentSort: string;
  setSort: (value: string) => void;
}

const Sorting: React.FC<SortingProps> = ({ currentSort, setSort }) => {
  return (
    <div className="w-full sm:w-auto z-10">
      <select
        className="w-full sm:w-52 md:w-60 lg:w-72 select dark:bg-gray-700 dark:text-gray-200"
        value={currentSort || "latest"} // controlled
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="">Latest</option>{" "}
        {/* "" = no sort → newest by default */}
        <option value="oldest">Oldest</option>
        <option value="price-low">Low to High</option>
        <option value="price-high">High to Low</option>
        {/* Add more later if needed: rating-desc, name-asc, etc. */}
      </select>
    </div>
  );
};

export default Sorting;
