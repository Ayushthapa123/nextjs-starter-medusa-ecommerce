"use client"
import { Button, Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price1"
import { useCart } from "hooks/useCart"
import { useAuthStore } from "store/useAuthStore"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAnonymousCart } from "hooks/useAnonymousCart"

export default  function ProductPreview({
  product,
  isFeatured,
  region,
  anonymousCartId
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion 
  anonymousCartId:string
}) {
  
  console.log('ppppppppppppppp',product.masterData.current.masterVariant)

  useEffect(()=> {
    const userId=localStorage.getItem("customer_id")
    setUserId(userId)
  
  },[])
  const {accessToken}=useAuthStore()
  const [userId,setUserId]=useState(null)

  const { addToCart } = useCart(accessToken??"",userId);
  const { addToCart: addToAnonymousCart} = useAnonymousCart(anonymousCartId);

  const queryClient=useQueryClient() 





  const handleAddToCart = async () => {

    if(!userId) {
   
      await addToAnonymousCart(product.id, "1");  
      await queryClient.invalidateQueries({queryKey:["anonymousCart"]}) 
      // refresh()
      window.location.reload()
    }else {
    await addToCart(product.id, "1");  
    await queryClient.invalidateQueries({queryKey:["cart"]})
    // refresh()
    window.location.reload()
    }

  };
  const price=Number(product.masterData.current.masterVariant.prices?.[0]?.value?.centAmount??0 )/100

  return (

      <div data-testid="product-wrapper relative w-full h-full ">
        <div className=" relative w-full h-full">
        <Link href={`/products/${product?.key}`} >
        <Thumbnail
          thumbnail={product?.masterData?.current?.masterVariant?.images?.[0]?.url }
          images={product?.masterData?.current?.masterVariant?.images}
          size="full"
          isFeatured={isFeatured}
          
        />
        </Link>
            <div className=" z-10 right-0 absolute  bottom-1">
          <Button variant="secondary" size="small" onClick={handleAddToCart}>Add to Cart </Button>
        </div>
        </div>
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.masterData?.current.name??"Product Title"}
          </Text>
          <div className="flex items-center gap-x-2">
            { <PreviewPrice price={{original_price:'12345',calculated_price:`$${price}`}} />}
          </div>
        </div>
    
      </div>
 
  )
}
