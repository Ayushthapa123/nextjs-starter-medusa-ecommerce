import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import { useCart } from "hooks/useCart"
import { useAuthStore } from "store/useAuthStore"
import { useEffect, useState } from "react"

export default  function CartButton() {
  // const cart = await retrieveCart().catch(() => null)

  const [userId,setUserId]=useState(null)

  useEffect(()=> {
    const userId=localStorage.getItem("customer_id")
    setUserId(userId)
  },[])

  const {accessToken}=useAuthStore()
  const {cart}=useCart(accessToken??"",userId??"")

  return <CartDropdown cart={cart} />
}
