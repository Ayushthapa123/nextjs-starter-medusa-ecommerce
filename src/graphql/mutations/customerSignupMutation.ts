export const CUSTOMER_SIGNUP_MUTATION = `
  mutation CustomerSignUp($draft: CustomerSignUpDraft!) {
    customerSignUp(draft: $draft) {
      customer {
        id
        firstName
        lastName
        email
      }
     
    }
  }
`;
