import { useEffect, useState } from "react";
import {
  type SavedPosition,
  readSavedPosition,
  writeSavedPosition,
  resolveFirstVisitPosition,
} from "../utils/mapPosition";

export function useInitialMapPosition(): SavedPosition | null {
  const [initialPosition, setInitialPosition] = useState<SavedPosition | null>(
    null,
  );

  useEffect(() => {
    const saved = readSavedPosition();
    if (saved) {
      setInitialPosition(saved);
      return;
    }

    let cancelled = false;
    resolveFirstVisitPosition().then((position) => {
      if (cancelled) return;
      setInitialPosition(position);
      writeSavedPosition(position);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return initialPosition;
}
