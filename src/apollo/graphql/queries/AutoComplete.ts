import { gql } from "@apollo/client";

export const AUTOCOMPLETE_QUERY = gql`
  query Autocomplete($input: AutocompleteInput!) {
    autocomplete(input: $input) {
      suggestions {
        address
      }
    }
  }
`;

export const PUBLIC_AUTOCOMPLETE_QUERY = gql`
  query PublicAutocomplete($input: AutocompleteInput!) {
    publicAutocomplete(input: $input) {
      suggestions {
        address
      }
    }
  }
`;
