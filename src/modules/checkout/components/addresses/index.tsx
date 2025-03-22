"use client";

import { setAddresses } from "@lib/data/cart";
import compareAddresses from "@lib/util/compare-addresses";
import { CheckCircleSolid } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Heading, Text, useToggleState } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import Spinner from "@modules/common/icons/spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import BillingAddress from "../billing_address";
import ErrorMessage from "../error-message";
import ShippingAddress from "../shipping-address";
import { SubmitButton } from "../submit-button";
import { useCart } from "hooks/useCart";

const Addresses = ({
  cart,
  customer,
  accessToken,
  customerId,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  accessToken: string;
  customerId: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "address";

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shippingAddress && cart?.billingAddress
      ? compareAddresses(cart?.shippingAddress, cart?.billingAddress)
      : true
  );

  const handleEdit = () => {
    router.push(pathname + "?step=address");
  };

  const [message, formAction] = useActionState(setAddresses, null);
  const { setShippingAddress } = useCart(accessToken, customerId);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault(); // Prevent page reload

    const formData = new FormData(e.currentTarget); // Get form data
    const data = Object.fromEntries(formData.entries()); // Convert to object
    console.log("aaaaaaa", data, data.shipping_address);
    // Transform into nested structure
    const shippingAddress = {
      first_name: data["shipping_address.first_name"],
      last_name: data["shipping_address.last_name"],
      address_1: data["shipping_address.address_1"],
      address_2: data["shipping_address.address_2"] || "", // Optional
      company: data["shipping_address.company"],
      postal_code: data["shipping_address.postal_code"],
      city: data["shipping_address.city"],
      country_code: data["shipping_address.country_code"],
      province: data["shipping_address.province"],
      phone: data["shipping_address.phone"],
    };
    const billingAddress={
      first_name: data["billing_address.first_name"],
      last_name: data["billing_address.last_name"],
      address_1: data["billing_address.address_1"],
      address_2: data["billing_address.address_2"] || "", // Optional
      company: data["billing_address.company"],
      postal_code: data["billing_address.postal_code"],
      city: data["billing_address.city"],
      country_code: data["billing_address.country_code"],
      province: data["billing_address.province"],
      phone: data["billing_address.phone"],
    }

    console.log("Reconstructed Shipping Address:", shippingAddress);

    // Convert to the desired format
    const address = {
      firstName: shippingAddress.first_name,
      lastName: shippingAddress.last_name,
      country: shippingAddress.country_code ?? "US",
      state: shippingAddress.province,
      city: shippingAddress.city,
      streetName: shippingAddress.address_1,
      postalCode: shippingAddress.postal_code,
      company: shippingAddress.company,
      phone: shippingAddress.phone,
    };

    const billingAddressModified={
      firstName: billingAddress.first_name,
      lastName: billingAddress.last_name,
      country: billingAddress.country_code ?? "US",
      state: billingAddress.province,
      city: billingAddress.city,
      streetName: billingAddress.address_1,
      postalCode: billingAddress.postal_code,
      company: billingAddress.company,
      phone: billingAddress.phone,
    }

    setShippingAddress(address,sameAsBilling?address:billingAddressModified);
    // alert(JSON.stringify(data)); // Debugging: Check collected data
    router.push(pathname + "?step=delivery");
  };

  const billingAddress = cart.billingAddress;
  const shippingAddress = cart.shippingAddress;


  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Shipping Address
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shippingAddress && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form onSubmit={handleSubmit}>
          <div className="pb-8">
            {customer && (
              <ShippingAddress
                customer={customer?.customer}
                checked={sameAsBilling}
                onChange={toggleSameAsBilling}
                cart={cart}
                shippingAddress={shippingAddress}
              />
            )}

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} customer={customer?.customer}  billingAddress={billingAddress}/>
              </div>
            )}
            <SubmitButton className="mt-6" data-testid="submit-address-button">
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shippingAddress ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Shipping Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shippingAddress.firstName}{" "}
                      {cart.shippingAddress.lastName}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shippingAddress.streetName}{" "}
                      {cart.shippingAddress.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shippingAddress?.postalCode},{" "}
                      {cart.shippingAddress?.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shippingAddress?.country?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shippingAddress?.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shippingAddress?.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Billing Address
                    </Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Billing- and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billingAddress?.firstName}{" "}
                          {cart.billingAddress?.lastName}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billingAddress?.streetName}{" "}
                          {cart.billingAddress?.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billingAddress?.postalCode},{" "}
                          {cart.billingAddress?.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billingAddress?.country?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Addresses;
