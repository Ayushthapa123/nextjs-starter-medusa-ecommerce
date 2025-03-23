export const GET_FULL_PRODUCT_BY_SLUG = `
   query GetFullProductBySlug($key: String!){
    product(key: $key) {
      id
   
      masterData {
        current {
        
          name(locale: "en-US")
         description(locale: "en-US") 
        masterVariant {
          images {
            url
          }
          prices{
            value {
              centAmount 
            }
          }
        }
     variants {
          id
          
          attributesRaw {
            name
            value
          }
          assets {
            name
          }
          images {
            url
          }
          prices {
            value {
              centAmount
              currencyCode
            }
            discounted {
              value {
                centAmount
              }
              discount {
                predicate 
                isValid
                
              }
            }
          }
        }
      
      
        }
      }
    }
  }
`;
