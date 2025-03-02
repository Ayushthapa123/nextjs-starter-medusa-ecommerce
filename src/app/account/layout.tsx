
import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import AccountPageDecider from "./AccountPageDecider"
import Nav from "@modules/layout/templates/nav"
import ReactQueryProvider from "app/QueryClientProvider"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  // const customer = await retrieveCustomer().catch(() => null)


  return (
    <>
<ReactQueryProvider><Nav /></ReactQueryProvider>

    <AccountLayout customer={null}>
<AccountPageDecider login={login} dashboard={dashboard}/>
      <Toaster />
    </AccountLayout>
    </>
  )
}


