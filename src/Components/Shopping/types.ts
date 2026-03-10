export interface CategoryGroup {
  name: string;
  subCategories: string[];
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  discountPrice: number;
  category: string;
  subCategory: string;
  brand: string;
  colors: string[];
  sizes: string[];
  stock: number;
  totalSold: number;
  status: "active" | "inactive" | "out-of-stock" | "discontinued";
  freeShipping: boolean;
  featured: boolean;
  averageRating: number;
  reviews: { user: string; rating: number; comment: string }[];
}

export type ViewMode = "grid" | "list";
