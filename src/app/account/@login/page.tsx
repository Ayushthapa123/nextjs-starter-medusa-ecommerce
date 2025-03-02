import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import ReactQueryProvider from "app/QueryClientProvider"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Graco Store account.",
}

export default function Login() {
  return <ReactQueryProvider><LoginTemplate /></ReactQueryProvider>
}
