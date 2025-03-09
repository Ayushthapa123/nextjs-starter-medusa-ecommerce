import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ADD_TO_CART_MUTATION } from "graphql/mutations/addToCartMutation";
import { getAccessToken } from "utils/getAccessToken";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Retrieve the stored cart ID from local storage
const getStoredCartId = () => {
  return typeof window !== "undefined" ? localStorage.getItem("anonymousCartId") : null;
};

// Store the cart ID in local storage
const storeCartId = (cartId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("anonymousCartId", cartId);
  }
};

// Fetch the active cart for an anonymous user
const fetchAnonymousCart = async (cartId: string) => {
  const token= await getAccessToken() 
  if (!token) throw new Error("Failed to get access token");
  const response = await axios.post(
    API_URL,
    {
      query: `
      query fetchCart {
        cart(id: "${cartId}") {
          id
          version
          totalLineItemQuantity 
          totalPrice {
            centAmount
            currencyCode
          }
          lineItems {
            id
            name(locale: "en-US")
            quantity
            lastModifiedAt
            totalPrice {
              centAmount
              currencyCode
            }
            price {
              value {
                centAmount
                currencyCode
              }
            }
            variant {
              id
              images {
                url
              }
            }
          }
        }
      }
      `,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Token required
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.cart;
};

// Create a new anonymous cart
const createAnonymousCart = async (anonymousId: string) => {

  const token= await getAccessToken() 
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: `
      mutation {
        createCart(
          draft: { currency: "USD", anonymousId: "${anonymousId}" }
        ) {
          id
          version
        }
      }
      `,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Token required
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.createCart;
};

// Add an item to the anonymous cart
const addToAnonymousCartAPI = async ({ cartId, version, id, quantity }) => {
  const token= await getAccessToken() 
  if (!token) throw new Error("Failed to get access token");
  const response = await axios.post(
    API_URL,
    {
      query: ADD_TO_CART_MUTATION,
      variables: { cartId, version, id, quantity },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Token required
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.updateCart;
};

// Hook to manage cart operations for an anonymous user
export const useAnonymousCart = (anonymousId: string) => {


  const queryClient = useQueryClient();
  const storedCartId = getStoredCartId();

  // Fetch cart data
  const { data: cart, isLoading } = useQuery({
    queryKey: ["anonymousCart"],
    queryFn: () => (storedCartId ? fetchAnonymousCart(storedCartId) : null),
    enabled: !!storedCartId ,
  });

  // Create a cart if none exists
  const createCartMutation = useMutation({
    mutationFn: () => createAnonymousCart(anonymousId),
    onSuccess: (newCart) => {
      storeCartId(newCart.id); // Store the cart ID
      queryClient.setQueryData(["anonymousCart"], newCart);
    },
  });

  // Mutation to add product to cart
  const addToCartMutation = useMutation({
    mutationFn: ({ cartId, version, id, quantity }: any) =>
      addToAnonymousCartAPI({ cartId, version, id, quantity }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["anonymousCart"], updatedCart);
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
