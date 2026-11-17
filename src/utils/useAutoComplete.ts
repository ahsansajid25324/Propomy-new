import { useState, useEffect, useRef, useCallback } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { AUTOCOMPLETE_QUERY } from "../apollo/graphql/queries/AutoComplete";
import type {
  Suggestion,
  AutocompleteQueryData,
  AutocompleteQueryVars,
} from "../types/AutoComplete";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 200;

export function useAutocomplete(search: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const latestQuery = useRef("");
  const lastResult = useRef<{ query: string; suggestions: Suggestion[] }>({
    query: "",
    suggestions: [],
  });

  const [fetchSuggestions, { loading }] = useLazyQuery<
    AutocompleteQueryData,
    AutocompleteQueryVars
  >(AUTOCOMPLETE_QUERY, { fetchPolicy: "cache-first" });

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const runQuery = useCallback(
    (normalized: string, raw: string) => {
      const prev = lastResult.current;
      if (
        prev.query &&
        normalized.startsWith(prev.query) &&
        prev.suggestions.length
      ) {
        const filtered = prev.suggestions.filter((s) =>
          s.address.toLowerCase().includes(normalized),
        );
        if (filtered.length) setSuggestions(filtered);
      }

      latestQuery.current = normalized;
      fetchSuggestions({ variables: { input: { search: raw } } })
        .then((res) => {
          if (latestQuery.current !== normalized) return;
          const next = res.data?.autocomplete?.suggestions ?? [];
          lastResult.current = { query: normalized, suggestions: next };
          setSuggestions(next);
        })
        .catch((err) => {
          if (latestQuery.current !== normalized) return;
          console.error("Autocomplete failed", err);
        });
    },
    [fetchSuggestions],
  );

  useEffect(() => {
    const normalized = debouncedSearch.toLowerCase();

    if (normalized.length < MIN_CHARS) {
      setSuggestions([]);
      latestQuery.current = "";
      lastResult.current = { query: "", suggestions: [] };
      return;
    }

    runQuery(normalized, debouncedSearch);
  }, [debouncedSearch, runQuery]);

  return { suggestions, loading };
}
