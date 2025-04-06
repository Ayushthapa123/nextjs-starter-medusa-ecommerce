import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ADD_TO_CART_MUTATION, APPLY_PROMO_CODE_MUTATION, SET_SHIPPING_ADDRESS_MUTATION } from "graphql/mutations/addToCartMutation";
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
            discountOnTotalPrice {
              discountedAmount {
                centAmount 
                currencyCode
              }
              discountedAmount {
                centAmount 
                currencyCode
              }
              
            }
            taxedPrice {
              totalNet  {
                centAmount
              }
              totalTax {
                centAmount
              }
              totalGross {
                centAmount
              }
              
            }
           discountCodes {
              state
              discountCode {
                code 
                key
              }
            }
            shippingAddress {
              firstName 
              lastName 
              company 
              streetName 
              city
              state 
              country 
              postalCode
              phone
            }
             billingAddress {
              firstName 
              lastName 
              company 
              streetName 
              city
              state 
              country 
              postalCode
              phone
            }
            
            id
            version
            totalLineItemQuantity 
        
          lineItems {
            id
            productId
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
const addToAnonymousCartAPI = async ({ cartId, version, id, quantity,centAmount }) => {
  const token= await getAccessToken() 
  if (!token) throw new Error("Failed to get access token");
  const response = await axios.post(
    API_URL,
    {
      query: ADD_TO_CART_MUTATION,
      variables: { cartId, version, id, quantity,centAmount },
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



const setAnonymousShippingAddressAPI = async ({ cartId, version, address, billingAddress }) => {
  const token = await getAccessToken();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: SET_SHIPPING_ADDRESS_MUTATION,
      variables: { cartId, version, address, billingAddress },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data.updateCart;
};

const applyPromoCodeAPI = async ({ cartId, version, code }) => {
  const token = await getAccessToken();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: APPLY_PROMO_CODE_MUTATION,
      variables: { cartId, version, code },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
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
      // queryClient.setQueryData(["anonymousCart"], newCart);
      queryClient.invalidateQueries({queryKey:["anonymousCart"]})
    },
  });

  // Mutation to add product to cart
  const addToCartMutation = useMutation({
    mutationFn: ({ cartId, version, id, quantity,centAmount }: any) =>
      addToAnonymousCartAPI({ cartId, version, id, quantity,centAmount }),
    onSuccess: (updatedCart) => {
      // queryClient.setQueryData(["anonymousCart"], updatedCart);
      queryClient.invalidateQueries({queryKey:["anonymousCart"]})
    },
  });

  const addToCart = async (id: string, quantity = "1",centAmount:string) => {
    let activeCart = cart;

    if (!activeCart) {
      activeCart = await createCartMutation.mutateAsync();
    }

    await addToCartMutation.mutateAsync({
      cartId: activeCart.id,
      version: activeCart.version,
      id, // Product ID
      quantity,
      centAmount
    });
  };


  const setShippingAddressMutation = useMutation({
    mutationFn: ({ cartId, version, address, billingAddress }: any) =>
      setAnonymousShippingAddressAPI({ cartId, version, address, billingAddress }),
    onSuccess: (updatedCart) => {
      queryClient.invalidateQueries({ queryKey: ["anonymousCart"] });
    },
  });

  const setAnonymousShippingAddress = async (address: any, billingAddress: any) => {
    if (!cart) throw new Error("No active cart found");

    await setShippingAddressMutation.mutateAsync({
      cartId: cart.id,
      version: cart.version,
      address,
      billingAddress,
    });
  };


  const applyPromoCodeMutation = useMutation({
    mutationFn: ({ cartId, version, code }: any) =>
      applyPromoCodeAPI({ cartId, version, code }),
    onSuccess: (updatedCart) => {
      queryClient.invalidateQueries({ queryKey: ["anonymousCart"] });
    },
  });
  
  const applyPromoCodeAnonymous = async (code: string) => {
    if (!cart) throw new Error("No active cart found");
  
    const res = await applyPromoCodeMutation.mutateAsync({
      cartId: cart.id,
      version: cart.version,
      code,
    });

    return res
  };
  

    // Mutation to place an order
const placeOrderMutation = useMutation({
  mutationFn: async ({ cart, accessToken }: { cart: any; accessToken: string }) => {
    if (!cart) {
      throw new Error("Cart not found");
    }

    const response = await axios.post(
      API_URL,
      {
        query: `
          mutation PlaceOrder($cartId: String!, $version: Long!) {
            createOrderFromCart(draft: { id: $cartId, version: $version }) {
              id
              orderNumber
              totalPrice {
                centAmount
                currencyCode
              }
              lineItems {
                id
                name(locale: "en-US")
                quantity
                totalPrice {
                  centAmount
                  currencyCode
                }
              }
              orderState
            }
          }
        `,
        variables: { cartId: cart.id, version: cart.version },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.createOrderFromCart;
  },
  onSuccess: (order) => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});

  
    // Function to trigger placeOrder mutation
    const placeOrderAnonymous = async () => {
      const accessToken= await getAccessToken()
      if (!accessToken) throw new Error("Failed to get access token");
      return await placeOrderMutation.mutateAsync({cart,accessToken});
    };
  

  return { cart, isLoading, addToCart,setAnonymousShippingAddress,applyPromoCodeAnonymous ,placeOrderAnonymous};
};
