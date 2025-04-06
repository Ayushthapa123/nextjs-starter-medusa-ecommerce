"use client"

import { Badge, Divider, Heading, Input, Label, Text, Tooltip } from "@medusajs/ui"
import React, { useActionState } from "react";

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { InformationCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"
import { useCart } from "hooks/useCart";
import { useAnonymousCart } from "hooks/useAnonymousCart";

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  userId:string 
  accessToken:string
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart ,userId,accessToken}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const {applyPromoCode}=useCart(userId,accessToken)
  const {applyPromoCodeAnonymous}=useAnonymousCart(cart.id)

  const { items = [], promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) {
      return
    }
 
    if(userId) {
       applyPromoCode(code.toString()).then((res)=> {
        if(res?.errors){
          alert(res.errors?.[0]?.message)
          window.location.reload()

        }else {
          alert("Promo code applied successfully!");
          window.location.reload()
        }
      }); 
    }else {
     
      applyPromoCodeAnonymous(code.toString()).then((res)=> {
        if(res?.errors){
          alert(res.errors?.[0]?.message)
          window.location.reload()

        }else {
          alert("Promo code applied successfully!");
          window.location.reload()
        }
      }
    )}

 
    // return
    // const input = document.getElementById("promotion-input") as HTMLInputElement
    // const codes = promotions
    //   .filter((p) => p.code === undefined)
    //   .map((p) => p.code!)
    // codes.push(code.toString())

    // await applyPromotions(codes)

    // if (input) {
    //   input.value = ""
    // }
  }

  const [message, formAction] = useActionState(submitPromotionForm, null)
  const activeDiscountCodes=cart.discountCodes
  const codeList=activeDiscountCodes?.map((code) => {
    return code.discountCode.code
  }).join(", ")
  console.log('dddddddddddddd',activeDiscountCodes)

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
          <Label className="flex gap-x-1 my-2 items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="add-discount-button"
            >
              Add Promotion Code(s)
            </button>
            
{/* 
            <Tooltip content="You can add multiple promotion codes">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip> */}
          </Label>
          <Divider/>
            <Text className="txt-medium text-ui-fg-muted">Applied Codes: {codeList} </Text>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  className="size-full"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  data-testid="discount-input"
                />
                <SubmitButton
                  variant="secondary"
                  data-testid="discount-apply-button"
                >
                  Apply
                </SubmitButton>
              </div>

              <ErrorMessage
                error={message}
                data-testid="discount-error-message"
              />
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">
                Promotion(s) applied:
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount: promotion.application_method.value,
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                        {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
