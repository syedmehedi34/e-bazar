// app/dashboard/admin/add-product/_components/types.ts

export type FormState = {
  title: string;
  description: string;
  images: string[];
  price: number | "";
  discountPrice: number | "";
  costPrice: number | "";
  currency: string;
  category: string;
  subCategory: string;
  brand: string;
  tags: string[];
  sku: string;
  sizes: string[];
  colors: string[];
  stock: number | "";
  status: "active" | "inactive" | "out-of-stock" | "discontinued";
  weight: number | "";
  dimensions: { length: number | ""; width: number | ""; height: number | "" };
  freeShipping: boolean;
  countryOfOrigin: string;
  specifications: { key: string; value: string }[];
  warranty: string;
  featured: boolean;
};

export type PreviewImage = {
  id: string; // stable ID for async tracking
  objectUrl: string; // local blob URL for instant preview
  url: string; // cloudinary secure_url
  publicId: string; // cloudinary public_id for deletion
  loading: boolean;
};

export const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  images: [],
  price: "",
  discountPrice: "",
  costPrice: "",
  currency: "BDT",
  category: "",
  subCategory: "",
  brand: "",
  tags: [],
  sku: "",
  sizes: [],
  colors: [],
  stock: "",
  status: "active",
  weight: "",
  dimensions: { length: "", width: "", height: "" },
  freeShipping: false,
  countryOfOrigin: "",
  specifications: [],
  warranty: "",
  featured: false,
};

// ── Shared Tailwind classes ───────────────────────────
export const inputCls = [
  "w-full px-3 py-2.5 rounded-xl text-sm",
  "bg-gray-50 dark:bg-gray-800",
  "border border-gray-200 dark:border-gray-700",
  "text-gray-900 dark:text-white",
  "placeholder-gray-400 dark:placeholder-gray-600",
  "focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15",
  "transition-all duration-200",
].join(" ");

export const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1.5";
