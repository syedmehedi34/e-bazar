import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async () => {
  const res = await axios.get(
    "https://e-bazaar-server-three.vercel.app/shopping?limit=1000",
    {
      withCredentials: true,
    },
  );

  return res.data;
};

export const useFetchProduct = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return {
    products: data?.product || [],
    allProducts: data?.allProducts || [],
    loading: isLoading,
    error: isError ? error : null,
    refetch,
  };
};
