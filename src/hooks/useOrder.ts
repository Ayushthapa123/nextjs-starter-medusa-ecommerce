import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken";

// Define your API URL
const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Define the GraphQL query for getting order details
const GET_ORDER_QUERY = `
  query GetOrder($orderId: String!) {
    order(id: $orderId) {
      id
      orderNumber
      customerEmail
      orderState
      totalPrice {
        centAmount
        currencyCode
      }
      shippingAddress {
        firstName
        lastName
        streetName
        city
        state
        postalCode
        country
        phone
      }
      billingAddress {
        firstName
        lastName
        streetName
        city
        state
        postalCode
        country
        phone
      }
      lineItems {
        id
        productId
        name(locale: "en-US")
        quantity
        price {
          value {
            centAmount
            currencyCode
          }
        }
        totalPrice {
          centAmount
          currencyCode
        }
            variant {
          images {
            url
            label
          }
        }
      }
      createdAt
      lastModifiedAt
      customerEmail
    }
  }
`;

// Function to fetch order details by order ID
const fetchOrderDetails = async (orderId: string) => {
  const token = await getAccessToken();
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: GET_ORDER_QUERY,
      variables: { orderId },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.order;
};

// The custom hook to get order details
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId, // Only fetch when the orderId is available
  });
};
