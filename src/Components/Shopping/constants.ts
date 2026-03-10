export const FALLBACK_IMAGE =
  "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";

export const PER_PAGE_OPTIONS = [12, 24, 36, 48] as const;

export const SORT_OPTIONS = [
  { value: "", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-low", label: "Price ↑" },
  { value: "price-high", label: "Price ↓" },
] as const;

/** Returns discount % or 0 */
export const calcDiscountPct = (
  price: number,
  discountPrice: number,
): number =>
  discountPrice > 0 && discountPrice < price
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

/** Returns effective selling price */
export const effectivePrice = (price: number, discountPrice: number): number =>
  calcDiscountPct(price, discountPrice) > 0 ? discountPrice : price;
