"use client";
import { Button, Container } from "@medusajs/ui";

import ChevronDown from "@modules/common/icons/chevron-down";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { convertToLocale } from "@lib/util/money";
import { HttpTypes } from "@medusajs/types";
import { useUserDetail } from "hooks/useUserDetails";
import { useAuthStore } from "store/useAuthStore";
import { useCart } from "hooks/useCart";
import { useAnonymousCart } from "hooks/useAnonymousCart";
import { useAnonymousCartStore } from "store/useAnonymousCartStore";
import { useEffect } from "react";

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null;
  orders: HttpTypes.StoreOrder[] | null;
};

const Overview = ({ customer, orders }: OverviewProps) => {
  // get the customer info
  const userId = localStorage.getItem("customer_id");
  const { accessToken, setAccessToken } = useAuthStore();
  const { user } = useUserDetail(userId ?? "", accessToken ?? "");

  const { anonymousCartId } = useAnonymousCartStore();

  console.log("uuuuuuuuuuuuu", user);
  const { cart, addToCart } = useCart(accessToken ?? "", userId ?? "");
  const { cart: anonymousCart, isLoading: isAnonymousCartLoading } =
    useAnonymousCart(anonymousCartId);

  // here in useEffect call the hook to set the access token

  const handleSyncCart = () => {
    console.log("Syncing cart...");

    const anonymousCartIdd = localStorage.getItem("anonymousCartId");
    if (
      userId &&
      anonymousCartIdd &&
      anonymousCartId &&
      !isAnonymousCartLoading &&
      anonymousCart?.lineItems?.length
    ) {
      // Merge anonymous cart with the user's cart once both are available
      console.log("Merging anonymous cart items with user cart");
      // alert('ok?')

      // Create an array of promises to add items in parallel
      const addItemPromises = anonymousCart.lineItems.map((item) => {
        return addToCart(item.productId, "1");
      });

      // Wait for all promises to resolve
      Promise.all(addItemPromises)
        .then(() => {
          console.log("All items added to cart");
          // Clear the anonymous cart ID after merging
          localStorage.removeItem("anonymousCartId");
          window.location.reload()
        })
        .catch((error) => {
          console.error("Error adding items to cart:", error);
        });
    }
  };

  // useEffect(() => {
  //   const anonymousCartId = localStorage.getItem("anonymousCartId");
  //   if (anonymousCart?.lineItems?.length && anonymousCartId) {
  //     handleSyncCart();
  //   }
  // }, [anonymousCart]);

  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="text-xl-semi flex justify-between items-center mb-4">
          {anonymousCart?.lineItems.length && anonymousCartId && userId   && (
            <Button onClick={handleSyncCart}>Sync Cart</Button>
          )}
          {anonymousCart?.lineItems.length && userId && accessToken && <AnonymousCartSyncer anonymousCart={anonymousCart} userId={userId} accessToken={accessToken}  />}
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            Hello {user?.firstName} {user?.lastName}
          </span>
          <span className="text-small-regular text-ui-fg-base">
            Signed in as:{" "}
            <span
              className="font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {user?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-8 border-t border-gray-200">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-6">
              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Profile</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="text-large-semi">Addresses</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    Saved
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">Recent orders</h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="bg-gray-50 flex justify-between items-center p-4">
                            <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                              <span className="font-semibold">Date placed</span>
                              <span className="font-semibold">
                                Order number
                              </span>
                              <span className="font-semibold">
                                Total amount
                              </span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Go to order #{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    );
                  })
                ) : (
                  <span data-testid="no-orders-message">No recent orders</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0;

  if (!customer) {
    return 0;
  }

  if (customer.email) {
    count++;
  }

  if (customer.first_name && customer.last_name) {
    count++;
  }

  if (customer.phone) {
    count++;
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  );

  if (billingAddress) {
    count++;
  }

  return (count / 4) * 100;
};

export default Overview;

const AnonymousCartSyncer = ({anonymousCart, userId, accessToken}: {anonymousCart: HttpTypes.Cart, userId: string, accessToken: string}) => {

  const { cart, addToCart } = useCart(accessToken ?? "", userId ?? "");

  const handleSyncCart = () => {
    console.log("Syncing cart...");

    const anonymousCartIdd = localStorage.getItem("anonymousCartId");
    if (

      anonymousCartIdd 
  
    ) {
      // Merge anonymous cart with the user's cart once both are available
      console.log("Merging anonymous cart items with user cart");
      // alert('ok?')

      // Create an array of promises to add items in parallel
      const addItemPromises = anonymousCart.lineItems.map((item) => {
        return addToCart(item.productId, "1");
      });

      // Wait for all promises to resolve
      Promise.all(addItemPromises)
        .then(() => {
          console.log("All items added to cart");
          // Clear the anonymous cart ID after merging
          localStorage.removeItem("anonymousCartId");
          window.location.reload()
        })
        .catch((error) => {
          console.error("Error adding items to cart:", error);
        });
    }
  };

  useEffect(() => {
    // handleSyncCart() // still called many times
  }, [])


  return <div/>;
};
