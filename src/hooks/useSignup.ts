import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;


const CLIENT_ID = process.env.NEXT_PUBLIC_CTP_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET!;
const PROJECT_KEY = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY!;
const AUTH_URL = `${process.env.NEXT_PUBLIC_CTP_AUTH_URL}/oauth/token`; //process.env.NEXT_PUBLIC_CTP_AUTH_URL!;
export const getAnonymousToken = async () => {
  try {
    const response = await axios.post(
      AUTH_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: `create_anonymous_token:${PROJECT_KEY} manage_customers:${PROJECT_KEY}`,
      }),
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching anonymous token:", error);
    return null;
  }
};



// Function to sign up a customer using GraphQL mutation
const customerSignupAPI = async (draft: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  // Get the token first
  const token = await getAnonymousToken();

  // Perform the signup request with authentication
  const response = await axios.post(
    API_URL,
    {
      query: `
        mutation CustomerSignUp($draft: CustomerSignUpDraft!) {
          customerSignUp(draft: $draft) {
            customer {
              id
              firstName
              lastName
              email
            }
          }
        }
      `,
      variables: { draft },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Apply the token here
      },
    }
  );

  return response.data.data.customerSignUp.customer;
};

// Hook to use the signup function
export const useSignup = () => {
  const mutation = useMutation({
    mutationFn: customerSignupAPI,
  });

  return {
    signup: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
