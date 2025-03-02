import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken";
import { CUSTOMER_SIGNUP_MUTATION } from "graphql/mutations/customerSignupMutation";
import { getAnonymousToken } from "utils/getAnonymousToken";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

export const fetchSignup = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

}) => {
  const token = await getAnonymousToken();
  console.log("ttttttttttt",token)
  if (!token) throw new Error("Failed to get access token");

  const response = await axios.post(
    API_URL,
    {
      query: CUSTOMER_SIGNUP_MUTATION,
      variables: {
        draft: {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
     
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data?.customerSignUp?.customer;
};
