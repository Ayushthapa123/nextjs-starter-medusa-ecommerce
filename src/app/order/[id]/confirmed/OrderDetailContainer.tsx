"use client"
import Nav from "@modules/layout/templates/nav";
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template";
import { useAnonymousCart } from "hooks/useAnonymousCart";
import { useCart } from "hooks/useCart";
import { useOrder } from "hooks/useOrder";
import { useProducts } from "hooks/useProducts";
import { useAnonymousCartStore } from "store/useAnonymousCartStore";
import { useAuthStore } from "store/useAuthStore";

const OrderDetailContainer = ({id}:{id:string}) => {

 
  const { data,isLoading } = useOrder(id);

  if (isLoading) return <p>Loading...</p>;


  return (
    <>
    <Nav/>
    <OrderCompletedTemplate order={data}/>
      {/* {JSON.stringify(data)} */}
    </>
  );
};

export default OrderDetailContainer;
