import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "store/useUserStore";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

const CLIENT_ID = process.env.NEXT_PUBLIC_CTP_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET!;
const PROJECT_KEY = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY!;
const AUTH_URL = `${process.env.NEXT_PUBLIC_CTP_AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`;

// Function to obtain access token for login
export const getLoginToken = async (email: string, password: string) => {

  try {
    const response = await axios.post(
      AUTH_URL,
      new URLSearchParams({
        grant_type: "password",
        username: email,
        password: password,
        scope: `manage_customers:${PROJECT_KEY} view_customers:${PROJECT_KEY} manage_project:${PROJECT_KEY}`,
      }),
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    localStorage.setItem("refresh_token", response.data.refresh_token);

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching login token:", error);
    throw new Error("Invalid credentials or authentication failed.");
  }
};

// Function to log in a customer using GraphQL mutation
const customerLoginAPI = async ({ email, password }: { email: string; password: string }) => {
  // Get the authentication token
  const token = await getLoginToken(email, password);
  console.log('tttttttttttttttttt',token)


  const response = await axios.post(
    API_URL,
    {
      query: `
        query CustomerLogin {
          me {
            customer {
              id
              firstName
              lastName
              email
            }
          }
        }
      `,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

localStorage.setItem("customer_id",response.data.data.me.customer.id)
  return response.data.data.me.customer;
};

// Hook to use the login function
export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: customerLoginAPI,
  });

  return {
    login: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
