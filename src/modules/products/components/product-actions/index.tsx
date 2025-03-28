"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useAuthStore } from "store/useAuthStore"
import { useCart } from "hooks/useCart"
import { useQueryClient } from "@tanstack/react-query"
import { useAnonymousCart } from "hooks/useAnonymousCart"
import { useAnonymousCartStore } from "store/useAnonymousCartStore"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  userId:string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.name] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  userId
}: ProductActionsProps) {

  // return <div>{JSON.stringify(product)}</div>
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product?.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product?.variants[0].attributesRaw)
      setOptions(variantOptions ?? {})
    }
  }, [product?.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product?.variants?.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product?.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
    
  }


  const {accessToken}=useAuthStore()
  const {anonymousCartId}=useAnonymousCartStore()

  const { addToCart:addToCart1 } = useCart(accessToken??"",userId);
  const queryClient=useQueryClient() 

   const { addToCart: addToAnonymousCart} = useAnonymousCart(anonymousCartId);
  

  const handleAddToCart1 = async () => {
    // alert(JSON.stringify(product.masterVariant.prices?.[0].value.centAmount))
  
    if(!userId) {
      // alert("Please Login First")
      await addToAnonymousCart(product.id, "1",product.masterVariant.prices?.[0].value.centAmount);  
     queryClient.invalidateQueries({queryKey:["anonymousCart"]}) 
    window.location.reload()

    }else {
     addToCart1(product.id, "1",product.masterVariant.prices?.[0].value.centAmount).then(() => {
    queryClient.invalidateQueries({queryKey:["cart"]})
    window.location.reload()
      
    });  
    // refresh()
    }

  };

  console.log('vvvvvvvvvvvvvvvvvvvvvv',product.variants)

  const getVariantOptions = (variants) => {
    const options = {};
  
    variants.forEach((variant) => {
      variant.attributesRaw.forEach(({ name, value }) => {
        if (!options[name]) options[name] = new Set();
        options[name].add(value);
      });
    });
  
    return Object.fromEntries(
      Object.entries(options).map(([key, value]) => [key, Array.from(value)])
    );
  };
  const actualVariants=getVariantOptions(product.variants)
  console.log('xxxxxxxxxxxxx',actualVariants)
  const sizeVariant=actualVariants?.size 
  console.log('xxxxxxxxxxxsize',sizeVariant)

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          

          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {Object.entries(actualVariants).map(([id, values]) => {
                // Transform values into the format expected by OptionSelect
                const processedValues = Array.isArray(values) ? values.map(value => ({
                  value: typeof value === 'object' && value !== null 
                    ? (value['en-GB'] || value['en-US'] || Object.values(value)[0])?.toString() 
                    : value?.toString()
                })) : [];

                const option = {
                  id,
                  title: id.charAt(0).toUpperCase() + id.slice(1), 
                  values: processedValues
                };

                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
          
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart1}
          disabled={false}
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
        Add To Cart
        </Button>

        {/* <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button> */}



        {/* {JSON.stringify(product.variants?.[0])} */}




        {/* <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        /> */}
      </div>
    </>
  )
}
