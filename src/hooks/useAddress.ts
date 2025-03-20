import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Fetch customer addresses
const fetchAddresses = async (accessToken: string) => {
  const response = await axios.post(
    API_URL,
    {
      query: `
      query fetchAddresses {
        me {
          addresses {
            id
            firstName
            lastName
            streetName
            streetNumber
            postalCode
            city
            country
            phone
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

  return response.data.data.me.addresses;
};

// Add a new address
const addAddressAPI = async ({ accessToken, address }) => {
  const response = await axios.post(
    API_URL,
    {
      query: `
      mutation addAddress($address: AddressInput!) {
        me {
          addAddress(address: $address) {
            id
            version
            addresses {
              id
              firstName
              lastName
              streetName
              streetNumber
              postalCode
              city
              country
              phone
            }
          }
        }
      }
      `,
      variables: { address },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.me.addAddress;
};

// Hook to manage customer addresses
export const useAddress = (accessToken: string) => {
  const queryClient = useQueryClient();

  // Fetch addresses
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => fetchAddresses(accessToken),
    enabled: !!accessToken,
  });

  // Mutation to add a new address
  const addAddressMutation = useMutation({
    mutationFn: addAddressAPI,
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData(["addresses"], updatedCustomer.addresses);
    },
  });

  const addAddress = async (address) => {
    await addAddressMutation.mutateAsync({
      accessToken,
      address,
    });
  };

  return { addresses, isLoading, addAddress };
};
