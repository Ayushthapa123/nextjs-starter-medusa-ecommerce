import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import ReactQueryProvider from "app/QueryClientProvider"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  // const cart = await retrieveCart()
  // const customer = await retrieveCustomer()

  // if (!cart) {
  //   return notFound()
  // }
  const cart=null 
  const customer=null

  return <ReactQueryProvider><CartTemplate cart={cart} customer={customer} /></ReactQueryProvider>
}
