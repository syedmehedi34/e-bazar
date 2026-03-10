// client/src/hook/useProductById.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProductById = async (id: string) => {
  const res = await axios.get(`/api/products/${id}`);
  return res.data;
};

export const useProductById = (id: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, // id না থাকলে query run করবে না
  });

  return {
    product: data?.product || null,
    productLoading: isLoading,
    productError: isError ? error : null,
  };
};

// const { product, productLoading, productError } = useProductById(id);
