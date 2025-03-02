"use client"
import { useCart } from "hooks/useCart";
import { useProducts } from "hooks/useProducts";
import { useAuthStore } from "store/useAuthStore";

const ProductList = () => {

  const {accessToken}=useAuthStore()
  const { cart, isLoading, } = useCart(accessToken??"");

  if (isLoading) return <p>Loading...</p>;

  if (isLoading) return <p>Loading products...</p>;

  return (
    <ul>
      All active carts: {JSON.stringify(cart?.lineItems?.length)}
    </ul>
  );
};

export default ProductList;
