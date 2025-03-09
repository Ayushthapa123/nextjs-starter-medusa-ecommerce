export const GET_PRODUCT_BY_SLUG = `
  query GetProductBySlug($key: String!) {
    product(key: $key) {
      id
   
      masterData {
        current {
          name(locale: "en-US")
         description(locale: "en-US") 
      
        }
      }
    }
  }
`;
