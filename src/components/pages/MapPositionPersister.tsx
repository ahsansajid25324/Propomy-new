import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import {
  type SavedPosition,
  STILLNESS_SAVE_DELAY_MS,
  writeSavedPosition,
} from "../../utils/mapPosition";

export function MapPositionPersister({
  initialPosition,
}: {
  initialPosition: SavedPosition | null;
}) {
  const map = useMap();
  const hasAppliedInitialPosition = useRef(false);
  const stillnessTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!initialPosition || hasAppliedInitialPosition.current) return;
    hasAppliedInitialPosition.current = true;
    map.setView(
      [initialPosition.lat, initialPosition.lng],
      initialPosition.zoom,
    );
  }, [initialPosition, map]);

  useMapEvents({
    moveend: () => {
      if (stillnessTimer.current) clearTimeout(stillnessTimer.current);
      stillnessTimer.current = setTimeout(() => {
        const center = map.getCenter();
        writeSavedPosition({
          lat: center.lat,
          lng: center.lng,
          zoom: map.getZoom(),
        });
      }, STILLNESS_SAVE_DELAY_MS);
    },
  });

  useEffect(() => {
    return () => {
      if (stillnessTimer.current) clearTimeout(stillnessTimer.current);
    };
  }, []);

  return null;
}
