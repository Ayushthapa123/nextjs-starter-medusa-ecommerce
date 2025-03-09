"use client"
import { useAnonymousCart } from "hooks/useAnonymousCart";
import { useCart } from "hooks/useCart";
import { useProducts } from "hooks/useProducts";
import { useAnonymousCartStore } from "store/useAnonymousCartStore";
import { useAuthStore } from "store/useAuthStore";

const ProductList = () => {

 
const {anonymousCartId}=useAnonymousCartStore()
  const { cart, isLoading, } = useAnonymousCart(anonymousCartId);

  if (isLoading) return <p>Loading...</p>;

  if (isLoading) return <p>Loading products...</p>;

  return (
    <ul>
      All active carts: {JSON.stringify(cart?.lineItems)}
    </ul>
  );
};

export default ProductList;
