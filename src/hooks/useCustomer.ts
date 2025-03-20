import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Fetch customer information
const fetchCustomer = async (accessToken: string) => {
  const response = await axios.post(
    API_URL,
    {
      query: `
         query fetchCustomer {
        me {
          customer {
            id 
            firstName 
            lastName 
            email 
            companyName 
            customerNumber 
            defaultShippingAddress {
              city 
              country  
              postalCode 
              phone 
              pOBox 
              state
              additionalAddressInfo 
              streetName
              
            }
             defaultBillingAddress {
              city 
              country  
              postalCode 
              phone 
              pOBox 
              state
              additionalAddressInfo 
              streetName
              
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

  return response.data.data.me;
};

// Hook to fetch customer data
export const useCustomer = (accessToken: string) => {
  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer"],
    queryFn: () => fetchCustomer(accessToken),
    enabled: !!accessToken,
  });

  return { customer, isLoading };
};
