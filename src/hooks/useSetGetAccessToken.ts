import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const PROJECT_KEY = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY!;
const CLIENT_ID = process.env.NEXT_PUBLIC_CTP_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET!;
const AUTH_URL = `${process.env.NEXT_PUBLIC_CTP_AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`;

// Function to get a new access token using refresh token
const fetchNewAccessToken = async (refreshToken: string) => {
  const response = await axios.post(
    AUTH_URL,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
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
};

// React Query hook to refresh access token
export const useSetGetAccessToken = () => {
  const mutation = useMutation({
    mutationFn: (refreshToken: string) => fetchNewAccessToken(refreshToken),
  
  });

  return {
    refreshAccessToken: mutation.mutateAsync, // Exposing mutateAsync to be called in useEffect
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
