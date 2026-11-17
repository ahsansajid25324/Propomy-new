import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react";
import { downloadResultsCSV } from "../utils/csvHelpers";
import type {
  SkipTraceRecord,
  LocationState,
  CreateBulkCheckoutResponse,
  CreateBulkCheckoutVariables,
} from "../types/SkipTrace";
import { CREATE_BULK_SKIP_TRACE_CHECKOUT } from "../apollo/graphql/mutations/SkipTrace";

export const useBulkResults = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [searchParams] = useSearchParams();

  const [records, setRecords] = useState<SkipTraceRecord[]>(
    state?.bulkData || [],
  );
  const [requestId] = useState<string>(
    state?.requestId || searchParams.get("requestId") || "",
  );
  const [resultCount, setResultCount] = useState<number>(
    state?.resultCount || 0,
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [createBulkCheckout] = useMutation<
    CreateBulkCheckoutResponse,
    CreateBulkCheckoutVariables
  >(CREATE_BULK_SKIP_TRACE_CHECKOUT);

  const fetchFullBulkData = useCallback(async (reqId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skip-trace/bulk-full-data/${reqId}`,
        { credentials: "include" },
      );
      if (response.ok) {
        const fullData = await response.json();
        setRecords(fullData.data);
        setIsUnlocked(true);
      }
    } catch (err) {
      console.error("Failed to retrieve full bulk data:", err);
      toast.error("Could not retrieve full data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPreviewData = useCallback(async (reqId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skip-trace/bulk-preview/${reqId}`,
        { credentials: "include" },
      );
      if (response.ok) {
        const result = await response.json();
        setRecords(result.data);
        setResultCount(result.resultCount);
      }
    } catch (err) {
      console.error("Failed to recover bulk preview", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const reqId = searchParams.get("requestId") || requestId;
    const isSuccess = searchParams.get("payment") === "success";

    if (isSuccess && reqId) {
      fetchFullBulkData(reqId);
    } else if (reqId && records.length === 0) {
      fetchPreviewData(reqId);
    }
  }, [
    searchParams,
    requestId,
    records.length,
    fetchFullBulkData,
    fetchPreviewData,
  ]);

  const handleUnlock = async () => {
    if (!requestId) return;
    setIsRedirecting(true);
    try {
      const { data } = await createBulkCheckout({ variables: { requestId } });
      if (data?.createBulkSkipTraceCheckout?.stripeUrl) {
        window.location.href = data.createBulkSkipTraceCheckout.stripeUrl;
      } else {
        toast.error("Failed to start checkout");
        setIsRedirecting(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout redirect failed");
      setIsRedirecting(false);
    }
  };

  return {
    records,
    requestId,
    resultCount,
    isUnlocked,
    total: state?.total,
    loading,
    isRedirecting,
    handleUnlock,
    handleDownload: () => downloadResultsCSV(records, requestId, isUnlocked),
  };
};
