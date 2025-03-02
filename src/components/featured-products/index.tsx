"use client"
import { HttpTypes } from "@medusajs/types"
import { useProducts } from "hooks/useProducts";
import ProductRail from "./product-rail";
import ProductPreview from "@modules/products/components/product-preview1";

export default  function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {

    const { data: products, isLoading, error } = useProducts();
  
    if (isLoading) return <p>Loading products...</p>;
    if (error) return <p>Error fetching products</p>;
  

     return <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36 ">
            {products &&
              products?.map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region} isFeatured />
                </li>
              ))}
          </ul>
  
}
