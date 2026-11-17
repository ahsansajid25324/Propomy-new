import { gql } from "@apollo/client";

export const ADD_DEAL_MUTATION = gql`
  mutation AddDeal($input: AddDealInput!) {
    addDeal(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_DEAL = gql`
  mutation DeleteDeal($id: ID!) {
    deleteDeal(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_DEAL_MUTATION = gql`
  mutation UpdateDeal($id: ID!, $input: UpdateDealInput!) {
    updateDeal(id: $id, input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_DEAL_STATUS_MUTATION = gql`
  mutation UpdateDealStatus($id: ID!, $input: UpdateDealInput!) {
    updateDeal(id: $id, input: $input) {
      success
      message
    }
  }
`;
