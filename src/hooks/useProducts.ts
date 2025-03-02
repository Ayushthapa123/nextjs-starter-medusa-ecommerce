import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken";
import { GET_PRODUCTS_QUERY } from "../graphql/queries/getProduts"

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

const fetchProducts = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    { query: GET_PRODUCTS_QUERY },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.products.results;
};

export const useProducts = () => {
    return useQuery({
      queryKey: ["products"],
      queryFn: fetchProducts, // <-- This was missing
    });
  };
  