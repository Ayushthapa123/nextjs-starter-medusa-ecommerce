import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"

import { useCart } from "hooks/useCart"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import CheckoutContent from "./CheckoutContent"
import ReactQueryProvider from "app/QueryClientProvider"


export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {

  return (
   <ReactQueryProvider><CheckoutContent/></ReactQueryProvider>
  )
}


