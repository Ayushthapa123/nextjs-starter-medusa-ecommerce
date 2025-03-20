"use client"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { useCart } from "hooks/useCart"
import { useAuthStore } from "store/useAuthStore"
import { useEffect, useState } from "react"
import { useAnonymousCart } from "hooks/useAnonymousCart"
import { useAnonymousCartStore } from "store/useAnonymousCartStore"

const CartTemplate = ({
  cart:asCart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {

  const [userId,setUserId]=useState(null);
  useEffect(()=> {
    const userId=localStorage.getItem("customer_id")
    setUserId(userId)
  },[])
  const {accessToken}=useAuthStore() 
  const {anonymousCartId}=useAnonymousCartStore()
  const {cart:normalCart}=useCart(accessToken??"",userId??"") 
  const {cart:anonymousCart}=useAnonymousCart(anonymousCartId) 

  const cart=userId?normalCart:anonymousCart

  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.lineItems?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!normalCart && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.lineItems && (
                  <>
                    <div className="bg-white py-6">
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
