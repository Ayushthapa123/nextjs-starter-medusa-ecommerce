import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes, StoreCartShippingOption } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { useCustomer } from "hooks/useCustomer"
import { useAuthStore } from "store/useAuthStore"

const sampleShippingOptions: StoreCartShippingOption[] = [
  {
    id: "ship_opt_001",
    name: "Express Delivery",
    price_type: "flat", // Can be "flat" or "calculated"
    service_zone_id: "zone_123",
    shipping_profile_id: "profile_456",
    provider_id: "provider_789",
    data: {
      estimated_delivery_days: 2,
      carrier: "DHL"
    },
    type: {
      id: "type_001",
      label: "Express",
      description: "Fast delivery within 1-3 business days",
      code: "EXPRESS"
    },
    provider: {
      id: "provider_789",
      is_enabled: true
    },
    amount: 1500, // Price in cents (e.g., $15.00)
    prices: [
      {
        id: "price_001",
        amount: 1500,
        currency_code: "USD",
        min_quantity: null,
        max_quantity: null
      },
      {
        id: "price_002",
        amount: 1300,
        currency_code: "EUR",
        min_quantity: null,
        max_quantity: null
      }
    ],
    calculated_price: {
      currency_code: "USD",
      id: "",
      calculated_amount: null,
      original_amount: null
    },
    insufficient_inventory: false
  },
  {
    id: "ship_opt_002",
    name: "Standard Delivery",
    price_type: "flat",
    service_zone_id: "zone_456",
    shipping_profile_id: "profile_789",
    provider_id: "provider_123",
    data: {
      estimated_delivery_days: 5,
      carrier: "FedEx"
    },
    type: {
      id: "type_002",
      label: "Standard",
      description: "Economical delivery within 4-7 business days",
      code: "STANDARD"
    },
    provider: {
      id: "provider_123",
      is_enabled: true
    },
    amount: 800, // Price in cents (e.g., $8.00)
    prices: [
      {
        id: "price_003",
        amount: 800,
        currency_code: "USD",
        min_quantity: null,
        max_quantity: null
      },
      {
        id: "price_004",
        amount: 700,
        currency_code: "EUR",
        min_quantity: null,
        max_quantity: null
      }
    ],
    calculated_price: {
      currency_code: "USD",
      id: "",
      calculated_amount: null,
      original_amount: null
    },
    insufficient_inventory: false
  }
];

const availablePaymentMethods = [
  {
    id: "stripe",
    name: "Credit/Debit Card",
    provider: "Stripe",
  },
  {
    id: "paypal",
    name: "PayPal",
    provider: "PayPal",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    provider: "Razorpay",
  },
  {
    id: "gift_card",
    name: "Gift Card",
    provider: "GiftCard",
  },
];



export default  function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
const {accessToken}=useAuthStore()

  const {customer:ourCustomer}=useCustomer(accessToken??"")

  if (!cart && !ourCustomer) {
    return null
  }

  console.log('cccccccccccccccccccccccc',ourCustomer)

  // const shippingMethods = await listCartShippingMethods(cart.id)
  // const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")
  const shippingMethods = sampleShippingOptions 
  const paymentMethods = availablePaymentMethods

  // if (!shippingMethods || !paymentMethods) {
  //   return null
  // }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      {accessToken && cart &&<Addresses cart={cart} customer={ourCustomer}  accessToken={accessToken} customerId={ourCustomer?.customer.id}/>}

      {cart &&<Shipping cart={cart} availableShippingMethods={shippingMethods} />}

     {cart && <Payment cart={cart} availablePaymentMethods={paymentMethods} />}

      {cart && accessToken &&<Review cart={cart} customerId={ourCustomer?.customer.id} accessToken={accessToken} /> }
    </div>
  )
}
