"use client";

interface PricerangeProps {
  currentMinPrice: number;
  currentMaxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
}

const Pricerange: React.FC<PricerangeProps> = ({
  currentMinPrice,
  currentMaxPrice,
  setMinPrice,
  setMaxPrice,
}) => {
  return (
    <div className="mt-8">
      <p className="text-lg font-bold mb-4 dark:text-white">Price Range</p>
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Min Price
          </label>
          <input
            type="number"
            min={0}
            value={currentMinPrice || ""}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : Number(e.target.value);
              setMinPrice(val);
            }}
            placeholder="0"
            className="input w-full dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Max Price
          </label>
          <input
            type="number"
            min={0}
            value={currentMaxPrice || ""}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : Number(e.target.value);
              setMaxPrice(val);
            }}
            placeholder="∞"
            className="input w-full dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricerange;
