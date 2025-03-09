import CartDropdown from "../cart-dropdown";
import { useCart } from "hooks/useCart";
import { useAuthStore } from "store/useAuthStore";
import { useEffect, useState, useRef } from "react";
import { useAnonymousCart } from "hooks/useAnonymousCart";
import { useAnonymousCartStore } from "store/useAnonymousCartStore";

export default function CartButton() {
  const [userId, setUserId] = useState(null);
  const hasMergedRef = useRef(false); // Ref to track merging state, does not trigger re-render
  const { anonymousCartId } = useAnonymousCartStore();

  useEffect(() => {
    const userId = localStorage.getItem("customer_id");
    setUserId(userId);
  }, []);

  const { accessToken } = useAuthStore();
  const { cart, addToCart } = useCart(accessToken ?? "", userId ?? "");
  const { cart: anonymousCart, isLoading: isAnonymousCartLoading } = useAnonymousCart(anonymousCartId);

  // Not in the useEffect but ask the user to if he wants to merge carts
  // useEffect(() => {
  //   const anonymousCartIdd = localStorage.getItem("anonymousCartId");
  //   if (userId && anonymousCartId && anonymousCartIdd && !isAnonymousCartLoading && anonymousCart?.lineItems?.length && !hasMergedRef.current) {
  //     // Merge anonymous cart with the user's cart once both are available
  //     console.log('Merging anonymous cart items with user cart');
   
  //     // Create an array of promises to add items in parallel
  //     const addItemPromises = anonymousCart.lineItems.map((item) => {
  //       return addToCart(item.id, "1");
  //     });
  
  //     // Wait for all promises to resolve
  //     Promise.all(addItemPromises)
  //       .then(() => {
  //         console.log('All items added to cart');
  //         // Clear the anonymous cart ID after merging
  //         localStorage.removeItem("anonymousCartId");
  //         hasMergedRef.current = true; // Set flag in ref to true after merging
  //       })
  //       .catch((error) => {
  //         console.error('Error adding items to cart:', error);
  //       });
  //   }
  // }, [userId, anonymousCartId, anonymousCart, isAnonymousCartLoading, addToCart]);

  return <CartDropdown cart={userId ? cart : anonymousCart} />;
}
