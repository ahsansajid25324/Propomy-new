import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { PropertyPopupContent } from "./PropertyPopupContent";
import { SkeletonUI } from "./Map";
import type { Pin, PropertyDetail } from "../../types/Map";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const blueIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PropertyMarkersProps {
  exactPin: (Pin & { estimatedValue: number }) | null;
  filteredPins: Pin[];
  pinDetails: Record<string, PropertyDetail>;
  fetchPinDetail: (pinId: string | number) => void;
  openModal: (detail: PropertyDetail, lat: number, lng: number) => void;
}

export const PropertyMarkers = React.memo(function PropertyMarkers({
  exactPin,
  filteredPins,
  pinDetails,
  fetchPinDetail,
  openModal,
}: PropertyMarkersProps) {
  return (
    <>
      {/* Exact Match Red Marker Pin Bubble */}
      {exactPin && (
        <Marker
          position={[exactPin.latitude, exactPin.longitude]}
          icon={L.divIcon({
            className: "custom-red-pin",
            html: `<div class="red-pin-bubble">${
              exactPin.estimatedValue >= 1_000_000
                ? (exactPin.estimatedValue / 1_000_000).toFixed(exactPin.estimatedValue % 1_000_000 === 0 ? 0 : 1) + "M"
                : (exactPin.estimatedValue / 1000).toFixed(0) + "K"
            }</div>`,
            iconSize: [48, 32],
            iconAnchor: [24, 32],
            popupAnchor: [0, -32],
          })}
          eventHandlers={{
            popupopen: () => fetchPinDetail(exactPin.id),
          }}
        >
          <Popup closeButton={false}>
            {pinDetails[exactPin.id] ? (
              <PropertyPopupContent
                detail={pinDetails[exactPin.id]}
                onAddressClick={openModal}
                lat={exactPin.latitude}
                lng={exactPin.longitude}
              />
            ) : (
              <SkeletonUI />
            )}
          </Popup>
        </Marker>
      )}

      {/* Surrounding Blue Marker Pins */}
      {filteredPins.map((pin, idx) => {
        const detail = pinDetails[pin.id];
        return (
          <Marker
            key={`${pin.id}-${idx}`}
            position={[pin.latitude, pin.longitude]}
            icon={blueIcon}
            eventHandlers={{
              popupopen: () => fetchPinDetail(pin.id),
            }}
          >
            <Popup closeButton={false}>
              {detail ? (
                <PropertyPopupContent
                  detail={detail}
                  onAddressClick={openModal}
                  lat={pin.latitude}
                  lng={pin.longitude}
                />
              ) : (
                <SkeletonUI />
              )}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
});