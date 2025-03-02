
import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import ReactQueryProvider from "app/QueryClientProvider"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function OverviewTemplate() {
  // const customer = await retrieveCustomer().catch(() => null)
  // const orders = (await listOrders().catch(() => null)) || null
  // call the hook to retrive customer info

  // if (!customer) {
  //   notFound()
  // }

  return <ReactQueryProvider><Overview customer={null} orders={null} /></ReactQueryProvider>
}
