"use client"
import Spinner from "@modules/common/icons/spinner"
import { useEffect, useState } from "react"

export default function AccountPageDecider({login,dashboard}:{login:React.ReactNode,dashboard:React.ReactNode}) {

  const [customerId,setCustomerId]=useState(null)

  useEffect(() => {
    const customer = localStorage.getItem("customer_id")
    setCustomerId(customer)
  }, [])

  return (
    <div className="">
      {customerId?dashboard:login}
    </div>
  )
}
