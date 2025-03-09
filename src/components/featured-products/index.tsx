"use client";
import { HttpTypes } from "@medusajs/types";
import {v4 as uuid} from 'uuid'
import { useProducts } from "hooks/useProducts";
import ProductRail from "./product-rail";
import ProductPreview from "@modules/products/components/product-preview1";
import { useEffect, useState } from "react";

export default function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[];
  region: HttpTypes.StoreRegion;
}) {
  const { data: products, isLoading, error } = useProducts();
  const [anonymousCartId,setAnonymousCartId] = useState<string>("")

  useEffect(()=>{
    const anonymousCartId = localStorage.getItem("anonymousCartId");
    if (!anonymousCartId) {
      localStorage.setItem("anonymousCartId", uuid());  
    }
    setAnonymousCartId(anonymousCartId ?? "")
  },[])


  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products</p>;

  return (
    <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36 ">
      {products &&
        products?.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured anonymousCartId={anonymousCartId} />
          </li>
        ))}
    </ul>
  );
}
