import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import OrderDetailContainer from "./OrderDetailContainer"
import ReactQueryProvider from "app/QueryClientProvider"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  // const order = await retrieveOrder(params.id).catch(() => null)

  return <ReactQueryProvider><OrderDetailContainer id={params.id}/></ReactQueryProvider>
  // if (!order) {
  //   return notFound()
  // }

  // return <OrderCompletedTemplate order={order} />
}
