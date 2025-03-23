import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ADD_TO_CART_MUTATION, APPLY_PROMO_CODE_MUTATION, SET_SHIPPING_ADDRESS_MUTATION } from "graphql/mutations/addToCartMutation";
import { getAccessToken } from "utils/getAccessToken";

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
                 price(currency:"USD") {
                    value {
                      centAmount
                    }
                  }
                id
                images {
                url
                }
                }
            }
          }
             customer {
              
            id 
            firstName 
            lastName 
            email 
            companyName 
            customerNumber 
              
              
         
           
            
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



const setShippingAddressAPI = async ({ cartId, version, address, billingAddress,accessToken }) => {
  const response = await axios.post(
    API_URL,
    {
      query: SET_SHIPPING_ADDRESS_MUTATION,
      variables: { cartId, version, address,billingAddress },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data.updateCart;
};


const applyPromoCodeAPI = async ({ cartId, version, code, accessToken }) => {
   const token= await getAccessToken() 
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
  console.log('rrrrrrrrrrrrrrrrrrrrrrrraaaa',response.data)

  return response.data;
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

    // Mutation to set shipping address
    const setShippingAddressMutation = useMutation({
      mutationFn: setShippingAddressAPI,
      onSuccess: (updatedCart) => {
        // queryClient.setQueryData(['cart'], updatedCart);
        queryClient.invalidateQueries({queryKey:["cart"]})
      },
    });
  
    const setShippingAddress = async (address,billingAddress) => {
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      await setShippingAddressMutation.mutateAsync({
        cartId: cart.id,
        version: cart.version,
        address,
        billingAddress,
        accessToken,
      });
    };
  
 
    const applyPromoCodeMutation = useMutation({
      mutationFn: applyPromoCodeAPI,
      onSuccess: (updatedCart) => {
        // queryClient.setQueryData(["cart"], updatedCart);
      },
    });
    
    const applyPromoCode = async (code: string) => {
      if (!cart) {
        throw new Error("Cart not found");
      }
    
      const res=await applyPromoCodeMutation.mutateAsync({
        cartId: cart.id,
        version: cart.version,
        code,
        accessToken,
      });
      return res
    };






    // Mutation to place an order
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
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
  const placeOrder = async () => {
    return await placeOrderMutation.mutateAsync();
  };
    

  return { cart, isLoading, addToCart,setShippingAddress,applyPromoCode,placeOrder };
};
