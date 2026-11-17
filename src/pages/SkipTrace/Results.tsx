import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import "../../styles/SkipTrace.css";
import { useMutation } from "@apollo/client/react";
import { CREATE_SKIP_TRACE_CHECKOUT } from "../../apollo/graphql/mutations/SkipTrace";
import type {
  CreateSkipTraceCheckoutData,
  CreateSkipTraceCheckoutVariables,
  ApiResult,
  Phone,
} from "../../types/SkipTrace";

const Results: React.FC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const [apiData, setApiData] = useState<ApiResult | null>(
    (location.state as { apiResult: ApiResult })?.apiResult || null,
  );
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [createCheckout] = useMutation<
    CreateSkipTraceCheckoutData,
    CreateSkipTraceCheckoutVariables
  >(CREATE_SKIP_TRACE_CHECKOUT);

  // Helper to safely format cells for CSV
  const formatCSVCell = (
    cell: string | number | boolean | null | undefined,
  ): string => {
    const stringValue = cell === null || cell === undefined ? "" : String(cell);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const fetchPreviewData = useCallback(async (reqId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skip-trace/preview/${reqId}`,
        { credentials: "include" },
      );
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
      }
    } catch (err) {
      console.error("Preview fetch failed", err);
    }
  }, []);

  const attemptFullUnlock = useCallback(
    async (reqId: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/skip-trace/full-data/${reqId}`,
          { credentials: "include" },
        );
        if (response.ok) {
          const fullData = await response.json();
          setApiData(fullData);
          setIsUnlocked(true);
        } else {
          if (!apiData) await fetchPreviewData(reqId);
          setIsUnlocked(false);
        }
      } catch (err) {
        console.error("Full data fetch failed", err);
      } finally {
        setLoading(false);
      }
    },
    [apiData, fetchPreviewData],
  );

  useEffect(() => {
    const reqId = searchParams.get("requestId");
    if (!reqId) return;
    attemptFullUnlock(reqId);
  }, [searchParams, attemptFullUnlock]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsRedirecting(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleDownloadCSV = () => {
    if (!apiData?.persons) return;

    const rows: string[] = [];
    const executionDate = apiData.requestDate 
      ? new Date(apiData.requestDate).toLocaleDateString() 
      : new Date().toLocaleDateString();

    // --- BRANDING HEADER SECTION ---
    rows.push(formatCSVCell("PROPOMY"));
    rows.push(formatCSVCell("Platform URL: https://www.propomy.com"));
    rows.push(formatCSVCell(`Report Generated On: ${executionDate}`));
    rows.push(""); // Spacer block to isolate branding metadata

    // --- SECTION 1: TOP SUMMARY ---
    rows.push(formatCSVCell("SEARCH SUMMARY"));
    rows.push(
      [
        "RequestId",
        "Date",
        "Input Address",
        "City",
        "State",
        "Match",
        "Results",
        "Live",
        "Execution",
      ]
        .map(formatCSVCell)
        .join(","),
    );

    rows.push(
      [
        apiData.requestId,
        apiData.requestDate || "",
        apiData.input?.address || "",
        apiData.input?.city || "",
        apiData.input?.state || "",
        apiData.match ? "Yes" : "No",
        apiData.resultCount,
        apiData.live ? "True" : "False",
        `${apiData.requestExecutionTimeMS || 0}ms`,
      ]
        .map(formatCSVCell)
        .join(","),
    );

    rows.push(""); // Spacer

    // --- SECTION 2: PERSON RESULTS ---
    rows.push(formatCSVCell("PERSON RESULTS"));
    const personHeaders = [
      "PersonId",
      "FullName",
      "FirstName",
      "LastName",
      "Age",
      "Gender",
      "Occupation",
      "Current Address",
      "Prev Address",
      "Last Update",
      "Email",
      "Phone",
      "Type",
      "LastSeen",
      "Usage12m",
      "DNC",
    ];
    rows.push(personHeaders.map(formatCSVCell).join(","));

    const personsToExport = isUnlocked
      ? apiData.persons
      : apiData.persons.slice(0, 2);

    personsToExport.forEach((person) => {
      const emails = isUnlocked
        ? person.emails?.length
          ? person.emails
          : ["None"]
        : ["LOCKED"];
      const phones: Partial<Phone>[] =
        isUnlocked && person.phones?.length
          ? person.phones
          : [
              {
                phone: isUnlocked ? "None" : "LOCKED",
                phoneType: "",
                phoneLastSeen: "",
                phoneUsage12Month: 0,
                phoneFtcDnc: false,
              },
            ];

      const rowCount = Math.max(emails.length, phones.length);

      for (let i = 0; i < rowCount; i++) {
        const currentEmail = emails[i] || "";
        const p = phones[i] || {};

        const typeLabel =
          p.phoneType === "W"
            ? "Wireless"
            : p.phoneType === "L"
              ? "Landline"
              : p.phoneType || "";
        const dncLabel = p.phone ? (p.phoneFtcDnc ? "Yes" : "No") : "";

        const personRow = [
          // Basic info only on the first row for this person
          i === 0 ? person.personId : "",
          i === 0 ? person.fullName : "",
          i === 0 ? person.firstName : "",
          i === 0 ? person.lastName : "",
          i === 0 ? person.age || "" : "",
          i === 0 ? person.gender || "" : "",
          i === 0 ? person.occupationDescription || "" : "",
          i === 0 ? person.address?.address || "" : "",
          i === 0 ? person.previousAddress?.address || "" : "",
          i === 0 ? person.lastUpdateDate || "" : "",

          // Contact info repeats/aligns for each email/phone
          currentEmail,
          p.phone || "",
          typeLabel,
          p.phoneLastSeen || "",
          p.phoneUsage12Month ?? "",
          dncLabel,
        ];

        rows.push(personRow.map(formatCSVCell).join(","));
      }
      rows.push(""); // Row gap between people
    });

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SkipTrace_${apiData.requestId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUnlockClick = async () => {
    if (!apiData?.requestId) return;
    setIsRedirecting(true);
    try {
      const { data } = await createCheckout({
        variables: { requestId: apiData.requestId },
      });
      if (data?.createSkipTraceCheckout?.stripeUrl) {
        window.location.href = data.createSkipTraceCheckout.stripeUrl;
      }
    } catch (err) {
      console.error("Stripe redirect failed", err);
      setIsRedirecting(false);
    }
  };

  if (loading && !apiData) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fw-bold text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!apiData)
    return (
      <div className="text-center mt-5">
        <button onClick={() => nav("/skip-trace")} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="skip-trace-container d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold">
              {isUnlocked ? "Full Owner Report" : "Preview Results"}
            </h1>
            <p className="text-muted">Request ID: {apiData.requestId}</p>
          </div>

          <div className="results-main-card shadow-lg bg-white rounded-4 overflow-hidden position-relative">
            {!isUnlocked && !loading && (
              <div className="unlock-overlay-container">
                <div className="unlock-card shadow-lg border">
                  <div className="d-flex flex-column align-items-center gap-3">
                    <h4 className="fw-bold mb-1">
                      {apiData.resultCount} Records Found
                    </h4>
                    <div className="h3 fw-bold mb-0 text-dark">$0.50</div>
                    <button
                      onClick={handleUnlockClick}
                      disabled={isRedirecting}
                      className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                    >
                      {isRedirecting ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        "Unlock Report"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`p-4 ${!isUnlocked ? "blur-content" : ""}`}
              style={{ minHeight: "300px" }}
            >
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Full Name</th>
                      <th>Age</th>
                      <th>Phones</th>
                      <th>Emails</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiData.persons.slice(0, 4).map((person, idx) => (
                      <tr key={idx}>
                        <td>{person.fullName}</td>
                        <td>{person.age || "??"}</td>
                        <td className="text-primary">
                          {isUnlocked
                            ? person.phones?.map((p) => p.phone).join(", ")
                            : "XXX-XXX-XXXX"}
                        </td>
                        <td className="text-primary">
                          {isUnlocked
                            ? person.emails?.join(", ")
                            : "••••@••••.com"}
                        </td>
                        <td>
                          <span
                            className={`badge ${isUnlocked ? "bg-success" : "bg-warning"}`}
                          >
                            {isUnlocked ? "Verified" : "Locked"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {isUnlocked && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                onClick={handleDownloadCSV}
                className="btn btn-success rounded-pill px-4"
              >
                Download CSV
              </button>
              <button
                onClick={() => nav("/skip-trace/single")}
                className="btn btn-primary rounded-pill px-4"
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Results;