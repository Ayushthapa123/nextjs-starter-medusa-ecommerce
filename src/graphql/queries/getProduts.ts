export const GET_PRODUCTS_QUERY = `
 query GetProducts {
  products {
    results {
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
