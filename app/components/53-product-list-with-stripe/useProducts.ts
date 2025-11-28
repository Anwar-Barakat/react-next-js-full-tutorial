import { PaginatedResponse } from '@/app/types';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "./types";

interface UseProductsParams {
  page?: number;
  perPage?: number;
}

const fetchProducts = async (
  params: UseProductsParams
): Promise<PaginatedResponse<Product>> => {
  const response = await axios.get(
    `http://127.0.0.1:8000/api/v4/products`,
    { params }
  );
  return response.data;
};

export const useProducts = (params: UseProductsParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
};