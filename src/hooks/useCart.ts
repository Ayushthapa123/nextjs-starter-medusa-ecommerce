import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getAccessTokenForCartManagement as getAccessTokenToManageMyCart } from "../utils/getAccessTokenForCartManagement";
import { ADD_TO_CART_MUTATION } from "graphql/mutations/addToCartMutation";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Fetch the active cart for a logged-in user
const fetchCart = async (accessToken:string) => {

  const response = await axios.post(
    API_URL,
    {
      query: `
      query fetchCart {
        me {
          activeCart {
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
      }
      `,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.me.activeCart;
};

// Create a new cart for the authenticated user
const createCart = async (accessToken:string,customerId:string) => {

  const response = await axios.post(
    API_URL,
    {
      query: `
      mutation {
        createCart(
          draft: { currency: "USD",customerId: "${customerId}" }
        ) {
          id
          version
        }
      }
      `,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.createCart;
};

// Add an item to the cart
const addToCartAPI = async ({ cartId, version, id, quantity,accessToken }) => {

  const response = await axios.post(
    API_URL,
    {
      query: ADD_TO_CART_MUTATION,
      variables: { cartId, version, id, quantity },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.updateCart;
};

// Hook to manage cart operations for a logged-in user
export const useCart = (accessToken:string,customerId:string) => {
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: ()=>fetchCart(accessToken),
    enabled: !!accessToken,
  });

  // Create a cart if none exists
  // Create a cart if none exists
  const createCartMutation = useMutation({
    mutationFn: (accessToken: string) => createCart(accessToken, customerId),
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  // Mutation to add product to cart
  const addToCartMutation = useMutation({
    mutationFn: addToCartAPI,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });

  const addToCart = async (id: string, quantity = "1") => {
    let activeCart = cart;

    if (!activeCart) {
      activeCart = await createCartMutation.mutateAsync(accessToken);
    }

    await addToCartMutation.mutateAsync({
      cartId: activeCart.id,
      version: activeCart.version,
      id, // Product ID
      quantity,
      accessToken
    });
  };

  return { cart, isLoading, addToCart };
};
