import { useEffect } from "react";
import "../../styles/FilterDrawer.css";
import type { FilterState, BooleanFilterKey } from "../../hooks/useFilter";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClearAll: () => void;
  disabled: boolean;
  hasActiveFilters: boolean;
  filters: FilterState;
  onTogglePropertyType: (value: string) => void;
  onToggleBed: (value: number) => void;
  onToggleBool: (key: BooleanFilterKey) => void;
  propertyTypeOptions: { value: string; label: string }[];
  bedOptions: { value: number; label: string }[];
}

const BOOLEAN_FILTERS: { key: BooleanFilterKey; label: string }[] = [
  { key: "absenteeOwner", label: "Absentee Owner" },
  { key: "cashBuyer", label: "Cash Buyer" },
  { key: "corporateOwned", label: "Corporate Owned" },
  { key: "highEquity", label: "High Equity" },
];

function FilterOptionButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={`filter-row-btn ${active ? "is-active" : ""}`}
    >
      <span className={`filter-checkbox ${active ? "is-checked" : ""}`}>
        {active && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="filter-row-label">{label}</span>
    </button>
  );
}

export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onClearAll,
  disabled,
  hasActiveFilters,
  filters,
  onTogglePropertyType,
  onToggleBed,
  onToggleBool,
  propertyTypeOptions,
  bedOptions,
}: FilterDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !disabled) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, disabled]);

  return (
    <>
      <div
        onClick={() => !disabled && onClose()}
        aria-hidden={!isOpen}
        className={`filter-overlay ${isOpen ? "is-open" : ""}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        aria-busy={disabled}
        className={`filter-panel ${isOpen ? "is-open" : ""}`}
      >
        <div className="filter-header">
          <span className="filter-title">Filters</span>
          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            aria-label="Close filters"
            className="filter-close-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="filter-body">
          <div className="filter-section">
            <div className="filter-section-title">Property type</div>
            <div className="filter-options-list">
              {propertyTypeOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  disabled={disabled}
                  active={filters.propertyTypes.includes(opt.value)}
                  onClick={() => onTogglePropertyType(opt.value)}
                />
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-title">Bedrooms</div>
            <div className="filter-options-list">
              {bedOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  disabled={disabled}
                  active={filters.beds.includes(opt.value)}
                  onClick={() => onToggleBed(opt.value)}
                />
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-title">Property Status & Ownership</div>
            <div className="filter-options-list">
              {BOOLEAN_FILTERS.map(({ key, label }) => (
                <FilterOptionButton
                  key={key}
                  label={label}
                  disabled={disabled}
                  active={filters[key]}
                  onClick={() => onToggleBool(key)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button
            type="button"
            disabled={!hasActiveFilters || disabled}
            onClick={onClearAll}
            className="filter-btn-clear"
          >
            Clear all
          </button>
          <button type="button" onClick={onApply} disabled={disabled} className="filter-btn-submit">
            {disabled ? (
              <>
                <span className="filter-spinner" aria-hidden="true" /> Applying...
              </>
            ) : (
              "Show results"
            )}
          </button>
        </div>
      </div>
    </>
  );
}