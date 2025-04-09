"use client"

import { Button, Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCart } from "hooks/useCart"
import { useAnonymousCart } from "hooks/useAnonymousCart"

const Review = ({ cart ,customerId, accessToken,anonymousCartId}: { cart: any ,customerId:string , accessToken:string,anonymousCartId:string}) => {
  const searchParams = useSearchParams()
  const {placeOrder}=useCart(accessToken,customerId)
  const {placeOrderAnonymous}=useAnonymousCart(anonymousCartId)

  const isOpen = searchParams.get("step") === "review"

    const router = useRouter()
    const pathname = usePathname()
  

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

    const handlePlaceOrder = async () => {
      alert('Order Placed Successfully')
      if(customerId) {
      try {
         placeOrder().then((res) => {
           if (res?.errors) {
             alert(res.errors?.[0]?.message)
           }else {
            router.push(`/order/${res.id}/confirmed`, { scroll: false })
           }
         })
  
 
      } catch (error) {
        console.error("Error in placeOrder:", error)
      }
    }else {
      try {
       placeOrderAnonymous().then((res) => {
         if (res?.errors) {
           alert(res.errors?.[0]?.message)
         }else {
          router.push(`/order/${res.id}/confirmed`, { scroll: false })
         }
       })
        localStorage.clear()
      } catch (error) {
        console.error("Error in placeOrder:", error)
      }
    }
    }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {/* {isOpen && previousStepsCompleted && ( */}
      {isOpen && true && (

        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <Button size="large" onClick={handlePlaceOrder}>Place order</Button>
          {/* <PaymentButton cart={cart} data-testid="submit-order-button" /> */}
        </>
      )}
    </div>
  )
}

export default Review
