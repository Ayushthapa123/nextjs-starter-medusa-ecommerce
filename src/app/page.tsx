import Link from "next/link"
import ReactQueryProvider from "./QueryClientProvider"
import ProductList from "./ProductsList"
import Hero from "@modules/home/components/hero"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FeaturedProducts from "components/featured-products"

export default function Component() {
  return (
    <div className="">
      <ReactQueryProvider>
      <Nav/>
     </ReactQueryProvider>
      <Hero/>
        <ReactQueryProvider>
         <div className="px-4 py-8 ">
          <h1 className="text-2xl-semi text-ui-fg-base">Our Products</h1>
         <FeaturedProducts collections={[]} region={null}/>
         </div>
         </ReactQueryProvider>
         <ReactQueryProvider>
         <ProductList/>
         </ReactQueryProvider>
   
    <Footer/>
    </div>
  )
}