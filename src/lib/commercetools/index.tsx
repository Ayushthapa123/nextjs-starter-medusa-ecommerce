import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "utils/getAccessToken";

const COMMERCE_TOOLS_AUTH_URL = process.env.NEXT_PUBLIC_CTP_AUTH_URL!;
const COMMERCE_TOOLS_API_URL = process.env.NEXT_PUBLIC_CTP_API_URL!;
const CLIENT_ID = process.env.NEXT_PUBLIC_CTP_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CTP_CLIENT_SECRET!;
const PROJECT_KEY = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY!;

// Function to fetch the access token securely


// Function to create a commercetools GraphQL client
export async function createCommercetoolsClient(): Promise<GraphQLClient> {
  const token = await getAccessToken();
  return new GraphQLClient(`${COMMERCE_TOOLS_API_URL}/${PROJECT_KEY}/graphql`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
