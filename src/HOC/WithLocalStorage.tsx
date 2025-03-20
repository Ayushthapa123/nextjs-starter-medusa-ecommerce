import { ComponentType, useEffect, useState } from "react";
import { WithLocalStoreProps } from "./types/localStorageTypes";


const WithLocalStore = <P extends object>(WrappedComponent: ComponentType<P & WithLocalStoreProps>) => {
  return (props: P) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [anonymousCartId, setAnonymousCartId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setUserId(localStorage.getItem("customer_id"));
        setRefreshToken(localStorage.getItem("refresh_token"));
        setAnonymousCartId(localStorage.getItem("anonymous_cart_id"));
        setLoading(false);
      }
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Replace with a proper loading component if needed
    }

    return <WrappedComponent {...props} userId={userId} refreshToken={refreshToken} anonymousCartId={anonymousCartId} />;
  };
};

export default WithLocalStore;
