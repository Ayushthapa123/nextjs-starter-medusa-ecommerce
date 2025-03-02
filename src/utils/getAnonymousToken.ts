import axios from "axios";

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

