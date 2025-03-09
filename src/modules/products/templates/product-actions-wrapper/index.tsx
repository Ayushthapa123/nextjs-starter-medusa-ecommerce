"use client"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import ReactQueryProvider from "app/QueryClientProvider"
import { useEffect, useState } from "react"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default  function ProductActionsWrapper({
  id,
  region,
  product
}: {
  id: string
  region: HttpTypes.StoreRegion,
  product:any
}) {
  // const product = await listProducts({
  //   queryParams: { id: [id] },
  //   regionId: region.id,
  // }).then(({ response }) => response.products[0])

  // if (!product) {
  //   return null
  // }

  const [userId,setUserId]=useState(null)

  useEffect(()=> {
    const userId=localStorage.getItem("customer_id")
    setUserId(userId)
  },[])
  
  return <ReactQueryProvider><ProductActions product={product} region={region}  userId={userId}/></ReactQueryProvider>
}
