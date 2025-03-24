import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken } from "utils/getAccessToken";

const API_URL = `${process.env.NEXT_PUBLIC_CTP_API_URL}/${process.env.NEXT_PUBLIC_CTP_PROJECT_KEY}/graphql`;

interface Location {
  country: string;
  state: string;
}

interface Zone {
  id: string;
  name: string;
  locations: Location[];
}

interface ZoneResponse {
  zones: {
    exists: boolean;
    results: Zone[];
  };
}

// Fetch zones data
const fetchZones = async () => {
  const accessToken = await getAccessToken();
  
  const response = await axios.post(
    API_URL,
    {
      query: `
        query getZones {
          zones {
            exists 
            results {
              id 
              name 
              locations {
                country
                state
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

  return response.data.data.zones;
};

// Hook to fetch zones data
export const useZone = () => {
  const { data: zones, isLoading, error } = useQuery<ZoneResponse>({
    queryKey: ["zones"],
    queryFn: fetchZones,
  });

  return {
    zones: zones?.results || [],
    isLoading,
    error,
  };
};
