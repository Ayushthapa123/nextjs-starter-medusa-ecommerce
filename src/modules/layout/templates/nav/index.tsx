"use client";

import { Suspense, useEffect, useState } from "react";
import {v4 as uuid} from 'uuid'


import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@modules/layout/components/cart-button";
import SideMenu from "@modules/layout/components/side-menu";
import { useAuthStore } from "store/useAuthStore";
import { useRouter } from "next/navigation";
import { useSetGetAccessToken } from "hooks/useSetGetAccessToken";
import { useUserDetail } from "hooks/useUserDetails";
import { useCart } from "hooks/useCart";
import { useUserStore } from "store/useUserStore";
import { useAnonymousCartStore } from "store/useAnonymousCartStore";

function NavContent({ userId }: { userId: string }) {
  // const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  const { accessToken, setAccessToken } = useAuthStore();
  const { user } = useUserDetail(userId ?? "", accessToken ?? "");
  const router = useRouter();
  const { refreshAccessToken } = useSetGetAccessToken();
  const { cart, isLoading } = useCart(accessToken ?? "", userId);

  const {setAnonymousCartId}=useAnonymousCartStore()

  // here in useEffect call the hook to set the access token
  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");

    // if no refresh token logout
    if (!refreshToken) {
      localStorage.removeItem("customer_id");
      router.refresh();
    }
    refreshAccessToken(refreshToken ?? "").then((res) => {
      setAccessToken(res);
    });
    // If refreshtoken is present call the api and get and set the access token
  }, []);

  // Here in useEffect set the anonymous cart id
  useEffect(() => { 
    const anonymousCartId = localStorage.getItem("anonymousCartId");
    if (!anonymousCartId && !userId) {

      const generatedId=uuid()
      localStorage.setItem("anonymousCartId", generatedId); 
      setAnonymousCartId(generatedId) 
    } else {
      setAnonymousCartId(anonymousCartId)
    }

  }, []);

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={[]} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              graco store
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account({user?.firstName})
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart ({isLoading ? 0 : cart?.lineItems?.length})
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  );
}

export const Nav = () => {
  const [userId, setUserId] = useState(null);
  const {setUser,setUserId:setUserIdGlobal}=useUserStore()

  useEffect(() => {
    const userId = localStorage.getItem("customer_id");
    setUserId(userId);
    setUserIdGlobal(userId)

  }, []);

  return (
    <>
      <NavContent userId={userId} />
    </>
  );
};

export default Nav;
