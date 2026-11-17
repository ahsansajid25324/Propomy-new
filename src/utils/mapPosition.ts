export type SavedPosition = {
  lat: number;
  lng: number;
  zoom: number;
};

export const LAST_POSITION_STORAGE_KEY = "propomy_last_map_position";
export const STILLNESS_SAVE_DELAY_MS = 2000;
export const GEOLOCATION_ZOOM = 12;
export const IP_FALLBACK_ZOOM = 11;
export const DEFAULT_FALLBACK_CENTER: [number, number] = [37.421567, -122.084028];

export function readSavedPosition(): SavedPosition | null {
  try {
    const raw = localStorage.getItem(LAST_POSITION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.lat === "number" &&
      typeof parsed?.lng === "number" &&
      typeof parsed?.zoom === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeSavedPosition(position: SavedPosition) {
  try {
    localStorage.setItem(LAST_POSITION_STORAGE_KEY, JSON.stringify(position));
  } catch {
    // localStorage may be unavailable (private browsing, quota, etc.) - fail silently
  }
}

export async function resolveFirstVisitPosition(): Promise<SavedPosition> {
  const geoResult = await new Promise<SavedPosition | null>((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          zoom: GEOLOCATION_ZOOM,
        });
      },
      () => resolve(null), 
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 },
    );
  });

  if (geoResult) return geoResult;


  try {
    const res = await fetch("/api/geo/ip-location");
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.lat === "number" && typeof data?.lng === "number") {
        return { lat: data.lat, lng: data.lng, zoom: IP_FALLBACK_ZOOM };
      }
    }
  } catch {
    // network/backend failure - fall through to hardcoded default
  }

  return {
    lat: DEFAULT_FALLBACK_CENTER[0],
    lng: DEFAULT_FALLBACK_CENTER[1],
    zoom: IP_FALLBACK_ZOOM,
  };
}