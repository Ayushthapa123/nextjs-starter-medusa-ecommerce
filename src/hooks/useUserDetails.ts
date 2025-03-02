import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "store/useAuthStore";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

// Function to fetch user details by user_id
const fetchUserDetails = async (user_id: string,token:string) => {


  if (!token) throw new Error("No access token found. Please log in again.");

  const response = await axios.post(
    API_URL,
    {
      query: `
        query GetUserDetails($id: String!) {
          customer(id: $id) {
            id
            firstName
            lastName
            email
            addresses {
              id
              streetName
              postalCode
              city
              country
            }
            dateOfBirth
            createdAt
            lastModifiedAt
          }
        }
      `,
      variables: { id: user_id },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.customer;
};

// React Query hook to fetch user details
export const useUserDetail = (user_id: string,token:string) => {
  const query = useQuery({
    queryKey: ["userDetail", user_id],
    queryFn: () => fetchUserDetails(user_id,token),
    enabled: !!user_id, // Ensures the query runs only if user_id exists
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
