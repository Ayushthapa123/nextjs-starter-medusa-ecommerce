import { useAuthStore } from "store/useAuthStore";
import { useEffect, useState, ComponentType } from "react";
import { useSetGetAccessToken } from "hooks/useSetGetAccessToken";
import { useRouter } from "next/navigation";
import WithAuthDetailProps from "./types/withAuthDetailProps";




const WithAuthDetail = <P extends object>(WrappedComponent: ComponentType<P & WithAuthDetailProps>) => {
  return (props: P) => {
    // const [loading, setLoading] = useState(true);
    const { accessToken } = useAuthStore();

    const [userId,setUserId]=useState(null);
    useEffect(()=> {
      const userId=localStorage.getItem("customer_id")
      setUserId(userId)
    },[])

    if (!accessToken || !userId ) {
      return <div>Loading...</div>; // Replace with a proper loading component if needed
    }

    return (
        <WrappedComponent {...props} userId={userId} accessToken={accessToken} />
    );
  };
};

export default WithAuthDetail;
