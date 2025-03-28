import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { centsToDollars } from "utils/priceUtils"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  // const { cheapestPrice, variantPrice } = getProductPrice({
  //   product,
  //   variantId: variant?.id,
  // }) 

  console.log('pppppppppppppppppp',product)
  const masterVariant=product.masterVariant 
  const variants=product.variants


  const variantPrice={
    calculated_price:masterVariant.prices[0].value.centAmount,
    calculated_price_number:masterVariant.prices[0].value.centAmount,
    original_price:masterVariant.prices[0].value.centAmount,
    original_price_number:masterVariant.prices[0].value.centAmount,
    // price_type:"sale",
    // percentage_diff:"10"
  }; 

  const cheapestPrice={
    calculated_price:masterVariant.prices[0].value.centAmount,
    calculated_price_number:masterVariant.prices[0].value.centAmount,
    original_price:masterVariant.prices[0].value.centAmount,
    original_price_number:masterVariant.prices[0].value.centAmount,
  }; 


  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          ${centsToDollars(selectedPrice.calculated_price)}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
