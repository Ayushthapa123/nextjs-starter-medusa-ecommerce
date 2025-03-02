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
