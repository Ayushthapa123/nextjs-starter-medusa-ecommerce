import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import { useCart } from "hooks/useCart"
import { useAuthStore } from "store/useAuthStore"

export default  function CartButton() {
  // const cart = await retrieveCart().catch(() => null)

  const {accessToken}=useAuthStore()
  const {cart}=useCart(accessToken??"")

  return <CartDropdown cart={cart} />
}
