import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useLazyQuery } from "@apollo/client/react";
import { PUBLIC_AUTOCOMPLETE_QUERY } from "../../apollo/graphql/queries/AutoComplete";
import { trackReportFunnelAction } from "../../libs/posthog/index";
import "../../styles/AddressAutoComplete.css";

export interface AddressSuggestion {
  address: string;
}

interface PublicAutocompleteData {
  publicAutocomplete: { suggestions: AddressSuggestion[] } | null;
}

interface PublicAutocompleteVars {
  input: { search: string };
}

const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;

export interface PublicAddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  reportType?: string; // Optional prop to pass report context (e.g. "valuation", "market")
  label?: string;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path
      d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const PublicAddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  reportType = "general",
  label = "Property address",
  placeholder = "e.g. 4821 Oakmont Dr, Silver Spring, MD",
  error = null,
  disabled = false,
  autoFocus = false,
  className = "",
}: PublicAddressAutocompleteProps) => {
  const reactId = useId();
  const inputId = `aa-input-${reactId}`;
  const listId = `aa-list-${reactId}`;
  const errorId = `aa-err-${reactId}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestTermRef = useRef("");
  const committedValueRef = useRef<string | null>(null);

  const [runQuery, { loading }] = useLazyQuery<
    PublicAutocompleteData,
    PublicAutocompleteVars
  >(PUBLIC_AUTOCOMPLETE_QUERY, { fetchPolicy: "network-only" });

  const fetchSuggestions = useCallback(
    async (term: string) => {
      latestTermRef.current = term;

      trackReportFunnelAction("search_started", reportType, {
        search_query: term,
      });

      try {
        const { data } = await runQuery({
          variables: { input: { search: term } },
        });
        if (latestTermRef.current !== term) return; // a newer keystroke won

        const newSuggestions = data?.publicAutocomplete?.suggestions ?? [];
        setSuggestions(newSuggestions);
        setActiveIndex(-1);

        // Only open if input is still focused by the user
        if (document.activeElement === inputRef.current) {
          setOpen(true);
        }
      } catch {
        if (latestTermRef.current !== term) return;
        setSuggestions([]);
        setOpen(false);
      }
    },
    [runQuery, reportType],
  );

  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setSuggestions([]);
    }
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;
    if (committedValueRef.current === value) return;

    const term = value.trim();
    if (term.length < MIN_CHARS) {
      latestTermRef.current = term;
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(() => fetchSuggestions(term), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, fetchSuggestions, disabled]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const commit = (suggestion: AddressSuggestion) => {
    committedValueRef.current = suggestion.address;

    trackReportFunnelAction("search_started", reportType, {
      selected_address: suggestion.address,
      action: "suggestion_selected",
    });

    onChange(suggestion.address);
    onSelect?.(suggestion);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActiveIndex(suggestions.length - 1);
        }
        break;
      case "Enter":
        if (open && activeIndex >= 0) {
          e.preventDefault();
          commit(suggestions[activeIndex]);
        }
        break;
      default:
        break;
    }
  };

  const showList = open && suggestions.length > 0;
  const showEmpty =
    open &&
    !loading &&
    suggestions.length === 0 &&
    value.trim().length >= MIN_CHARS;

  return (
    <div className={`aa-root ${className}`.trim()} ref={rootRef}>
      {label && (
        <label className="aa-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={`aa-field${open ? " is-open" : ""}`}>
        <div
          className={`aa-input-wrap${error ? " has-error" : ""}${
            disabled ? " is-disabled" : ""
          }`}
        >
          <span className="aa-input-icon" aria-hidden="true">
            <PinIcon />
          </span>

          <input
            ref={inputRef}
            id={inputId}
            className="aa-input"
            type="text"
            role="combobox"
            autoComplete="off"
            autoFocus={autoFocus}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onBlur={() => setOpen(false)}
            aria-expanded={showList || showEmpty}
            aria-controls={showList ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              showList && activeIndex >= 0
                ? `${listId}-opt-${activeIndex}`
                : undefined
            }
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />

          {loading && <span className="aa-spinner" aria-hidden="true" />}
        </div>

        {showList && (
          <ul
            className="aa-list"
            id={listId}
            role="listbox"
            onMouseDown={(e) => e.preventDefault()}
          >
            {suggestions.map((s, i) => (
              <li
                key={`${s.address}-${i}`}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`aa-option${i === activeIndex ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(s)}
              >
                {s.address}
              </li>
            ))}
          </ul>
        )}

        {showEmpty && (
          <div className="aa-list aa-empty" role="status">
            No matching addresses. Try adding the city or ZIP.
          </div>
        )}
      </div>

      {error && (
        <p className="aa-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};

export default PublicAddressAutocomplete;
