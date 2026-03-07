"use client";

interface PageProps {
  setSort: (value: string) => void;
}

const Sorting: React.FC<PageProps> = ({ setSort }) => {
  return (
    <div className="w-full sm:w-auto z-10">
      <select
        className="w-full sm:w-52 md:w-60 lg:w-72 select dark:bg-gray-700"
        defaultValue="latest"
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="older">Older</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>
    </div>
  );
};

export default Sorting;
