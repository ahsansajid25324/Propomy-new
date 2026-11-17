// src/types/Autocomplete.ts
export interface Suggestion {
  address: string;
}

export interface AutocompleteQueryData {
  autocomplete: {
    suggestions: Suggestion[];
  };
}

export interface AutocompleteQueryVars {
  input: {
    search: string;
  };
}
