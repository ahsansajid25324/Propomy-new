import { useCallback, useMemo, useReducer } from "react";

export type BooleanFilterKey =
  | "absenteeOwner"
  | "cashBuyer"
  | "corporateOwned"
  | "highEquity";

export interface FilterState {
  propertyTypes: string[];
  beds: number[];
  absenteeOwner: boolean;
  cashBuyer: boolean;
  corporateOwned: boolean;
  highEquity: boolean;
}

export const initialFilters: FilterState = {
  propertyTypes: [],
  beds: [],
  absenteeOwner: false,
  cashBuyer: false,
  corporateOwned: false,
  highEquity: false,
};

type FilterAction =
  | { type: "TOGGLE_PROPERTY_TYPE"; value: string }
  | { type: "TOGGLE_BED"; value: number }
  | { type: "TOGGLE_BOOL"; key: BooleanFilterKey }
  | { type: "RESET" };

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function filtersReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "TOGGLE_PROPERTY_TYPE":
      return { ...state, propertyTypes: toggleInArray(state.propertyTypes, action.value) };
    case "TOGGLE_BED":
      return { ...state, beds: toggleInArray(state.beds, action.value) };
    case "TOGGLE_BOOL":
      return { ...state, [action.key]: !state[action.key] };
    case "RESET":
      return initialFilters;
    default:
      return state;
  }
}

function countActive(filters: FilterState): number {
  return (
    filters.propertyTypes.length +
    filters.beds.length +
    (filters.absenteeOwner ? 1 : 0) +
    (filters.cashBuyer ? 1 : 0) +
    (filters.corporateOwned ? 1 : 0) +
    (filters.highEquity ? 1 : 0)
  );
}

export function useFilters() {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  const togglePropertyType = useCallback(
    (value: string) => dispatch({ type: "TOGGLE_PROPERTY_TYPE", value }),
    [],
  );
  const toggleBed = useCallback(
    (value: number) => dispatch({ type: "TOGGLE_BED", value }),
    [],
  );
  const toggleBool = useCallback(
    (key: BooleanFilterKey) => dispatch({ type: "TOGGLE_BOOL", key }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const activeFilterCount = useMemo(() => countActive(filters), [filters]);

  return {
    filters,
    togglePropertyType,
    toggleBed,
    toggleBool,
    reset,
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
  };
}