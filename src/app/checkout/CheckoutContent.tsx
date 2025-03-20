"use client";

import { useCart } from "hooks/useCart";
import { notFound } from "next/navigation";
import PaymentWrapper from "@modules/checkout/components/payment-wrapper";
import CheckoutForm from "@modules/checkout/templates/checkout-form";
import CheckoutSummary from "@modules/checkout/templates/checkout-summary";
import WithAuthDetail from "HOC/WithAuthDetail";
import { useAuthStore } from "store/useAuthStore";
import WithAuthDetailProps from "HOC/types/withAuthDetailProps";
import { BaseCustomer } from "@medusajs/types/dist/http/customer/common";



const CheckoutContent = ({ userId ,accessToken}: WithAuthDetailProps) => {


  const { cart ,isLoading} = useCart(accessToken??"", userId);
  const sampleCustomer: BaseCustomer = {
    id: "cust_12345",
    email: "john.doe@example.com",
    default_billing_address_id: "addr_98765",
    default_shipping_address_id: "addr_56789",
    company_name: "Doe Enterprises",
    first_name: "John",
    last_name: "Doe",
    addresses: [
        {
          id: "addr_98765",
          customer_id: "cust_12345",

          city: "New York",
          address_1: "123 Main Street",
          address_2: "Suite 400",


          postal_code: "10001",

          phone: "+1 555-1234",
          is_default_billing: true,
          is_default_shipping: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          address_name: null,
          company: null,
          first_name: null,
          last_name: null,
          country_code: null,
          province: null,
          metadata: null,

        },

       
    ],
    phone: "+1 555-7890",
    metadata: {
        preferred_language: "en",
        vip_status: true
    },
    created_by: "admin_001",
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

  const customer = sampleCustomer; // Implement a hook to fetch customer details

  if (!cart || isLoading) {
    return <>...</>;
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        { cart&&<CheckoutForm cart={cart} customer={customer} />}
      </PaymentWrapper>
      {cart && <CheckoutSummary cart={cart} userId={userId}  accessToken={accessToken}/> }
    </div>
  );
};

export default WithAuthDetail(CheckoutContent);
