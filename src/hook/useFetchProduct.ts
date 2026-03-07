import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API call to fetch products
const fetchProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data; // { message, data: [...] } returns
  console.log(res);
};

export const useFetchProduct = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return {
    products: data?.data || [],
    productsLoading: isLoading,
    productsError: isError ? error : null,
    refetchProducts: refetch,
  };
};

// const { products, productsLoading, productsError, refetchProducts } = useFetchProduct();
