import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyDetailModal } from "../../components/pages/PropertyDetailModal";
import { useAutocomplete } from "../../utils/useAutoComplete";
import {
  RecenterMap,
  SearchBox,
  MapLoadingOverlay,
  MapEmptyState,
} from "../../components/pages/Map";
import { MapPositionPersister } from "../../components/pages/MapPositionPersister";
import { PropertyMarkers } from "../../components/pages/PropertyMarkers";
import { FilterDrawer } from "../../components/pages/FilterDrawer";
import { useInitialMapPosition } from "../../hooks/useInitialMapPosition";
import { useFilters, initialFilters } from "../../hooks/useFilter";
import {
  useMapPropertySearch,
  type SearchOverrides,
} from "../../hooks/useMapPropertySearch";
import { propertyTypeOptions, bedOptions } from "../../types/Map";

import {
  DEFAULT_FALLBACK_CENTER,
  IP_FALLBACK_ZOOM,
} from "../../utils/mapPosition";

import type { PropertyDetail } from "../../types/Map";

import "leaflet/dist/leaflet.css";
import "../../styles/Map.css";

export default function MapSearch() {
  const [address, setAddress] = useState("");

  const {
    filters,
    togglePropertyType,
    toggleBed,
    toggleBool,
    reset: resetFilters,
    activeFilterCount,
    hasActiveFilters,
  } = useFilters();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const autocompleteRef = useRef<HTMLDivElement>(null);
  const { suggestions, loading: suggestionsLoading } = useAutocomplete(address);

  const initialPosition = useInitialMapPosition();

  const searchFilters = useMemo(
    () => ({ address, ...filters }),
    [address, filters],
  );

  const {
    allPins,
    exactPin,
    filteredPins,
    recenterPins,
    pinDetails,
    searchLoading,
    moreLoading,
    error,
    hasSearchedOnce,
    pagination,
    fetchPinDetail,
    handleSearch,
    loadMorePins,
    resetSearch,
    userApiLimit,
  } = useMapPropertySearch(searchFilters);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(
    async (overrides?: SearchOverrides) => {
      setShowSuggestions(false);
      await handleSearch(overrides);
    },
    [handleSearch],
  );

  const handleClearAll = useCallback(() => {
    setAddress("");
    resetFilters();
    setShowSuggestions(false);
    resetSearch();
  }, [resetFilters, resetSearch]);

  const openModal = useCallback(
    (detail: PropertyDetail, lat: number, lng: number) => {
      setSelectedProperty({ ...detail, latitude: lat, longitude: lng });
      setIsModalOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  }, []);

  const center: [number, number] = useMemo(() => {
    if (allPins.length > 0) {
      return [allPins[0].latitude, allPins[0].longitude];
    }
    if (initialPosition) {
      return [initialPosition.lat, initialPosition.lng];
    }
    return DEFAULT_FALLBACK_CENTER;
  }, [allPins, initialPosition]);

  const initialZoom = initialPosition?.zoom ?? IP_FALLBACK_ZOOM;
  const showEmptyHint = !searchLoading && !error && allPins.length === 0;

  return (
    <div className="map-screen">
      <h4 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
        Map View
      </h4>

      <SearchBox
        autocompleteRef={autocompleteRef}
        address={address}
        setAddress={setAddress}
        userApiLimit={userApiLimit}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        suggestionsLoading={suggestionsLoading}
        suggestions={suggestions}
        handleSearch={search}
        handleClear={handleClearAll}
        loading={searchLoading && !isFilterDrawerOpen}
      />

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        disabled={searchLoading}
        hasActiveFilters={hasActiveFilters}
        filters={filters}
        onTogglePropertyType={togglePropertyType}
        onToggleBed={toggleBed}
        onToggleBool={toggleBool}
        propertyTypeOptions={propertyTypeOptions}
        bedOptions={bedOptions}
        onClearAll={async () => {
          resetFilters();
          await search(initialFilters);
          setIsFilterDrawerOpen(false);
        }}
        onApply={async () => {
          await search();
          setIsFilterDrawerOpen(false);
        }}
      />

      {allPins.length > 0 && (
        <div className="mb-4 flex flex-col gap-1">
          <button
            onClick={loadMorePins}
            disabled={!pagination.hasMore || moreLoading}
            className={`load-button-map ${!pagination.hasMore || moreLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {moreLoading
              ? "Loading..."
              : pagination.hasMore
                ? "Load More"
                : "All Loaded"}
          </button>
          <div className="text-sm text-gray-600">
            Loaded {allPins.length} of {pagination.totalCount} results.
          </div>
        </div>
      )}

      {error && <p className="show-error">{error}</p>}

      <div className="mt-md-4 mt-3" style={{ position: "relative" }}>
        <MapContainer center={center} zoom={initialZoom} className="map-container">
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="&copy; Google Maps"
          />

          <MapPositionPersister initialPosition={initialPosition} />

          <PropertyMarkers
            exactPin={exactPin}
            filteredPins={filteredPins}
            pinDetails={pinDetails}
            fetchPinDetail={fetchPinDetail}
            openModal={openModal}
          />

          <RecenterMap pins={recenterPins} />
        </MapContainer>

        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className="filter-button-map"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>

        {searchLoading && (
          <MapLoadingOverlay
            label={
              hasActiveFilters
                ? "Applying filters..."
                : `Searching near "${address}"...`
            }
          />
        )}

        {showEmptyHint && (
          <MapEmptyState
            message={
              hasSearchedOnce
                ? "No properties to show. Try a different address or adjust your filters."
                : "Enter an address above and hit Search to see nearby properties."
            }
          />
        )}
      </div>

      <PropertyDetailModal open={isModalOpen} onClose={closeModal} detail={selectedProperty} />
    </div>
  );
}