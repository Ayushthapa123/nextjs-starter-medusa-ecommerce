"use client"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { useCart } from "hooks/useCart"
import { useAuthStore } from "store/useAuthStore"

const CartTemplate = ({
  cart:asCart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const {accessToken}=useAuthStore()
  const {cart}=useCart(accessToken??"")
console.log('cccccccccccccccccccccc',cart)
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.lineItems?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {/* {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )} */}
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
