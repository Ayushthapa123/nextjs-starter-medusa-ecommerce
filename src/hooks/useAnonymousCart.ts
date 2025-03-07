import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getAccessTokenForCartManagement as getAccessTokenToManageMyCart } from "../utils/getAccessTokenForCartManagement";
import { ADD_TO_CART_MUTATION } from "graphql/mutations/addToCartMutation";
import { getAccessTokenForFetchingAnonymousCart } from "utils/getAccessTokenForFetchingAnonymousCart";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Fetch active cart
const fetchCart = async () => {
  const token = await getAccessTokenForFetchingAnonymousCart();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: `
     query fetchCart {
  me {
    activeCart {
      id
      version
      lineItems {
        id
        name(locale: "en-US")
        quantity
      }
    }
  }
}
      `,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.me.activeCart;
};

// Create a new cart if none exists
const createCart = async () => {
  
  const token = await getAccessTokenToManageMyCart();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: `
        mutation {
          createCart(
            draft: { currency: "USD" }
          ) {
            id
            version
          }
        }
      `,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.createCart;
};

// Add an item to the cart
const addToCartAPI = async ({ cartId, version, id, quantity }) => {
  const token = await getAccessTokenToManageMyCart();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: ADD_TO_CART_MUTATION,
      variables: { cartId, version, id, quantity },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.updateCart;
};

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  // Create a cart if none exists
  const createCartMutation = useMutation({
    mutationFn: createCart,
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart); // Store new cart in cache
    },
  });

  // Mutation to add product to cart
  const addToCartMutation = useMutation({
    mutationFn: addToCartAPI,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart); // Store updated cart in cache
    },
  });

  const addToCart = async (id: string, quantity = "1") => {
    let activeCart = cart;

    if (!activeCart) {
      activeCart = await createCartMutation.mutateAsync();
    }

    await addToCartMutation.mutateAsync({
      cartId: activeCart.id,
      version: activeCart.version,
      id, // Product ID
      quantity,
    });
  };

  return { cart, isLoading, addToCart };
};
