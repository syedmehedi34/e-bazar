export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  discountPrice: number;
  costPrice: number;
  currency: string;
  category: string;
  subCategory: string;
  brand: string;
  tags: string[];
  sku: string;
  sizes: string[];
  colors: string[];
  stock: number;
  totalSold: number;
  status: "active" | "inactive" | "out-of-stock" | "discontinued";
  weight: number;
  dimensions: { length: number; width: number; height: number };
  freeShipping: boolean;
  countryOfOrigin: string;
  specifications: { key: string; value: string }[];
  warranty: string;
  featured: boolean;
  averageRating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export type TabType = "description" | "specifications" | "reviews" | "shipping";
