import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client/react";
import {
  GET_COMPLETE_PROPERTY_DETAIL,
  GET_MAP_PINS_QUERY,
} from "../apollo/graphql/queries/Map";
import { updateUser } from "../features/auth/authSlice";
import type {
  Pin,
  PropertyDetail,
  MapPinsQueryResponse,
  MapPinsQueryVariables,
  PropertyDetailQueryVariables,
  PropertyDetailQueryResponse,
} from "../types/Map";
import type { RootState } from "../store/store";

export type MapSearchFilters = {
  address: string;
  propertyTypes: string[];
  beds: number[];
  absenteeOwner: boolean;
  cashBuyer: boolean;
  corporateOwned: boolean;
  highEquity: boolean;
};

export type SearchOverrides = Partial<Omit<MapSearchFilters, "address">>;

export function useMapPropertySearch(filters: MapSearchFilters) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [allPins, setAllPins] = useState<Pin[]>([]);
  const [exactPin, setExactPin] = useState<
    (Pin & { estimatedValue: number }) | null
  >(null);
  const [pinDetails, setPinDetails] = useState<Record<string, PropertyDetail>>(
    {},
  );

  const [searchLoading, setSearchLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  const [pagination, setPagination] = useState({
    nextIndex: 0,
    totalCount: 0,
    hasMore: true,
  });

  const [fetchPins] = useLazyQuery<MapPinsQueryResponse, MapPinsQueryVariables>(
    GET_MAP_PINS_QUERY,
    { fetchPolicy: "network-only" },
  );

  const [fetchPropertyDetailGQL] = useLazyQuery<
    PropertyDetailQueryResponse,
    PropertyDetailQueryVariables
  >(GET_COMPLETE_PROPERTY_DETAIL, {
    fetchPolicy: "cache-first",
  });

  const fetchPinDetail = useCallback(
    async (pinId: string | number) => {
      if (pinDetails[pinId]) return;
      try {
        const { data } = await fetchPropertyDetailGQL({
          variables: { id: String(pinId) },
        });

        if (data && data.propertyDetail) {
          const detail = data.propertyDetail;
          setPinDetails((prev) => ({
            ...prev,
            [pinId]: detail as PropertyDetail,
          }));
          if (!data.propertyDetail.isCached && user && user.apiLimit > 0) {
            dispatch(updateUser({ apiLimit: user.apiLimit - 1 }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch pin detail via GraphQL", err);
      }
    },
    [pinDetails, fetchPropertyDetailGQL, dispatch, user],
  );

  const handleSearch = useCallback(
    async (overrides?: SearchOverrides) => {
      if (!filters.address.trim()) return setError("Address is required");

      const effectivePropertyTypes =
        overrides?.propertyTypes ?? filters.propertyTypes;
      const effectiveBeds = overrides?.beds ?? filters.beds;
      const effectiveAbsentee =
        overrides?.absenteeOwner ?? filters.absenteeOwner;
      const effectiveCash = overrides?.cashBuyer ?? filters.cashBuyer;
      const effectiveCorporate =
        overrides?.corporateOwned ?? filters.corporateOwned;
      const effectiveEquity = overrides?.highEquity ?? filters.highEquity;

      setSearchLoading(true);
      setAllPins([]);
      setExactPin(null);
      setPagination({ nextIndex: 0, totalCount: 0, hasMore: true });
      setError(null);

      try {
        const { data: gqlData } = await fetchPins({
          variables: {
            address: filters.address,
            resultIndex: 0,
            radius: 3,
            propertyTypes:
              effectivePropertyTypes.length > 0
                ? effectivePropertyTypes
                : undefined,
            beds: effectiveBeds.length > 0 ? effectiveBeds : undefined,
            absenteeOwner: effectiveAbsentee || undefined,
            cashBuyer: effectiveCash || undefined,
            corporateOwned: effectiveCorporate || undefined,
            highEquity: effectiveEquity || undefined,
          },
        });

        const mapPinsResult = gqlData?.getMapPins;
        if (!mapPinsResult?.data?.length) return setError("No results found");

        setAllPins(mapPinsResult.data);
        setPagination({
          nextIndex: mapPinsResult.resultIndex,
          totalCount: mapPinsResult.resultCount,
          hasMore: mapPinsResult.resultIndex < mapPinsResult.resultCount,
        });

        if (mapPinsResult.exactMatchDetail) {
          const exactMatchId = String(mapPinsResult.exactMatchDetail.id);
          const correspondingPin = mapPinsResult.data.find(
            (pin: Pin) => String(pin.id) === exactMatchId,
          );

          if (correspondingPin) {
            setExactPin({
              ...correspondingPin,
              estimatedValue: mapPinsResult.exactMatchDetail.estimatedValue,
            });
          }
        }
        if (!mapPinsResult.isCached && user && user.apiLimit > 0) {
          dispatch(updateUser({ apiLimit: user.apiLimit - 1 }));
        }
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSearchLoading(false);
        setHasSearchedOnce(true);
      }
    },
    [filters, fetchPins, dispatch, user],
  );

  const loadMorePins = useCallback(async () => {
    if (!pagination.hasMore) return;
    setMoreLoading(true);
    try {
      const { data: gqlData, error: gqlErr } = await fetchPins({
        variables: {
          address: filters.address,
          resultIndex: pagination.nextIndex,
          radius: 3,
          propertyTypes:
            filters.propertyTypes.length > 0
              ? filters.propertyTypes
              : undefined,
          beds: filters.beds.length > 0 ? filters.beds : undefined,
          absenteeOwner: filters.absenteeOwner || undefined,
          cashBuyer: filters.cashBuyer || undefined,
          corporateOwned: filters.corporateOwned || undefined,
          highEquity: filters.highEquity || undefined,
        },
      });

      if (gqlErr) throw gqlErr;

      const mapPinsResult = gqlData?.getMapPins;
      if (mapPinsResult?.data) {
        setAllPins((prev) => [...prev, ...mapPinsResult.data]);
        setPagination({
          nextIndex: mapPinsResult.resultIndex,
          totalCount: mapPinsResult.resultCount,
          hasMore: mapPinsResult.resultIndex < mapPinsResult.resultCount,
        });
        if (!mapPinsResult.isCached && user && user.apiLimit > 0) {
          dispatch(updateUser({ apiLimit: user.apiLimit - 1 }));
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setMoreLoading(false);
    }
  }, [filters, pagination, fetchPins, dispatch, user]);

  // Clears pin/search state only. Address + filter *inputs* live in the
  // caller, so a full "clear all" should reset those separately and then
  // call this.
  const resetSearch = useCallback(() => {
    setAllPins([]);
    setExactPin(null);
    setPagination({ nextIndex: 0, totalCount: 0, hasMore: true });
    setError(null);
    setHasSearchedOnce(false);
  }, []);

  const filteredPins = useMemo(() => {
    return allPins.filter(
      (pin) => !exactPin || String(pin.id) !== String(exactPin.id),
    );
  }, [allPins, exactPin]);

  const recenterPins = useMemo(() => {
    return exactPin ? [exactPin, ...allPins] : allPins;
  }, [exactPin, allPins]);

  return {
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
    userApiLimit: user?.apiLimit,
  };
}
