import { gql } from "@apollo/client";

export const CREATE_SKIP_TRACE_CHECKOUT = gql`
  mutation CreateSkipTraceCheckout($requestId: String!) {
    createSkipTraceCheckout(requestId: $requestId) {
      success
      stripeUrl
      message
    }
  }
`;

export const CREATE_BULK_SKIP_TRACE_CHECKOUT = gql`
  mutation CreateBulkSkipTraceCheckout($requestId: String!) {
    createBulkSkipTraceCheckout(requestId: $requestId) {
      success
      message
      stripeUrl
    }
  }
`;
