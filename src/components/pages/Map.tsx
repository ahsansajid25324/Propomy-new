import { useEffect } from "react";
import type { RefObject } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { Pin } from "../../types/Map";
import { Spinner } from "react-bootstrap";

export function RecenterMap({ pins }: { pins: Pin[] }) {
  const map = useMap();
  useEffect(() => {
    if (!pins.length) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [pins, map]);
  return null;
}

export function SkeletonUI() {
  return (
    <div className="map-popup-card skeleton-active">
      <div className="skeleton-box sk-img" />
      <div className="map-popup-content">
        <div className="skeleton-box sk-price" />
        <div className="skeleton-box sk-text" />
        <div className="skeleton-box sk-details" />
        <div className="map-popup-avm">
          <div className="skeleton-box sk-avm-item" />
          <div className="skeleton-box sk-avm-item" />
          <div className="skeleton-box sk-avm-item" />
        </div>
        <div className="skeleton-box sk-equity" />
      </div>
    </div>
  );
}

export function MapLoadingOverlay({
  label = "Searching properties...",
}: {
  label?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 18px",
          borderRadius: "999px",
          background: "#ffffff",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          fontSize: "14px",
          fontWeight: 500,
          color: "#374151",
        }}
      >
        <Spinner animation="border" size="sm" variant="primary" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function MapEmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "24px",
      }}
    >
      <div
        style={{
          padding: "10px 18px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          fontSize: "14px",
          fontWeight: 500,
          color: "#4b5563",
          textAlign: "center",
          maxWidth: "320px",
        }}
      >
        {message}
      </div>
    </div>
  );
}

interface SearchBoxProps {
  autocompleteRef: RefObject<HTMLDivElement | null>;
  address: string;
  setAddress: (val: string) => void;
  userApiLimit?: number;
  showSuggestions: boolean;
  setShowSuggestions: (val: boolean) => void;
  suggestionsLoading: boolean;
  suggestions: Array<{ address: string }>;
  handleSearch: () => void;
  handleClear: () => void;
  loading: boolean;
}

export function SearchBox({
  autocompleteRef,
  address,
  setAddress,
  userApiLimit,
  showSuggestions,
  setShowSuggestions,
  suggestionsLoading,
  suggestions,
  handleSearch,
  handleClear,
  loading,
}: SearchBoxProps) {
  const isLimitReached = userApiLimit === 0;

  return (
    <div ref={autocompleteRef} className="search-container-map">
      <input
        type="text"
        value={address}
        disabled={isLimitReached}
        onChange={(e) => {
          setAddress(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder={isLimitReached ? "API Limit Reached" : "Search address"}
        className={`input-map ${
          showSuggestions &&
          (suggestionsLoading ||
            suggestions.length > 0 ||
            address.trim().length >= 2)
            ? "input-map--dropdown-open"
            : ""
        }`}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && address.trim().length >= 2 && (
        <ul className="autocomplete-dropdown">
          {suggestionsLoading ? (
            <li className="autocomplete-item loading">
              <Spinner animation="border" size="sm" variant="primary" />{" "}
              Searching Addresses
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setAddress(s.address);
                  setShowSuggestions(false);
                }}
                className="autocomplete-item"
              >
                <span className="pin-icon"></span> {s.address}
              </li>
            ))
          ) : (
            <li className="autocomplete-item no-results">
              No matching addresses found
            </li>
          )}
        </ul>
      )}

      <button
        onClick={handleSearch}
        className="search-button-map"
        disabled={loading || isLimitReached}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" variant="light" />
            Searching...
          </>
        ) : isLimitReached ? (
          "API Limit Reached"
        ) : (
          "Search"
        )}
      </button>
      <button onClick={handleClear} className="clear-button-map">
        Clear All
      </button>
    </div>
  );
}
