export const GET_PRODUCTS_QUERY = `
 query GetProducts {
  products {
    results {
    key
      masterData {
        current {
          slug
          name(locale: "en-US") 
          masterVariant {
            images {
              url
            }
            prices {
              value {
                currencyCode
                centAmount
              }
            }
          }
        }
      }
      id
      skus
    }
  }
}
`;
