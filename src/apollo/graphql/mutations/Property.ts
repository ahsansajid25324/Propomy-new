import { gql } from "@apollo/client";

export const ADD_PROPERTY_MUTATION = gql`
  mutation AddProperty($input: PropertyInput!) {
    addProperty(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: ID!) {
    deleteProperty(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($id: ID!, $input: PropertyInput!) {
    updateProperty(id: $id, input: $input) {
      success
      message
    }
  }
`;
