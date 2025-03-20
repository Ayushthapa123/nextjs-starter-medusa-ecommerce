export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: String!, $version: Long!, $id: String!, $quantity: Long!) {
    updateCart(
      id: $cartId,
      version: $version,
      actions: [
        {
          addLineItem: {
            productId: $id,
            quantity: $quantity,
            externalPrice: {centPrecision: {centAmount: "1000", currencyCode: "USD"}}
          }
        }
      ]
    ) {
      id
      version
      lineItems {
        id
        quantity
      }
    }
  }
`;



export const SET_SHIPPING_ADDRESS_MUTATION = `
  mutation SetShippingAddress($cartId: String!, $version: Long!, $address: AddressInput!,$billingAddress: AddressInput!) {
    updateCart(
      id: $cartId, 
      version: $version, 
      actions: [
        { setShippingAddress: { address: $address } }, 
        { setBillingAddress: { address: $billingAddress } }
      ]
    ) {
      id
      version
      shippingAddress {
        firstName
        lastName
        streetName
        postalCode
        city
        country
      }
    }
  }
`;



export const APPLY_PROMO_CODE_MUTATION = `
  mutation applyDiscountCode($cartId: String!, $version: Long!, $code: String!) {
    updateCart(
      id: $cartId
      version: $version
      actions: [{ addDiscountCode: { code: $code } }]
    ) {
      id
      version
      discountCodes {
        discountCode {
          id
          code
        }
      }
    }
  }
`;
