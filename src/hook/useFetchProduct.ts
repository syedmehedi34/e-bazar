import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface ProductQueryParams {
  search?: string;
  category?: string;
  subCategory?: string; // ← added
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

const fetchProducts = async (params: ProductQueryParams) => {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "" && v !== 0)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  const url = `/api/products${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res.data; // expected: { message, products: [], categories: [{name, subCategories}] }
};

export const useFetchProduct = () => {
  const searchParams = useSearchParams();

  const params: ProductQueryParams = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    subCategory: searchParams.get("subCategory") || undefined, // ← added
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    sort: searchParams.get("sort") || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData, // optional: keeps old data while fetching new data on param change
  });

  return {
    products: data?.products || [],
    categories: data?.categories || [], // now CategoryGroup[]
    productsLoading: isLoading,
    productsError: isError ? error : null,
    refetchProducts: refetch,
  };
};

// const { products, categories, productsLoading, productsError, refetchProducts } = useFetchProduct();
