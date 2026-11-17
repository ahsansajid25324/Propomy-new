import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { Phone, Mail, AlertTriangle, Building } from "lucide-react";
import { GET_OWNER_CONTACT_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import type {
  GetOwnerContactReportData,
  GetOwnerContactReportVars,
  OwnerContactReportResponse,
  OwnerResultState,
  PersonRecord,
} from "../../../types/Reports";
import { OwnerReportPDFDocument } from "../../../components/pages/OwnerReportPDFDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";

const PHONE_TYPE_LABEL: Record<string, string> = {
  mobile: "Mobile",
  landline: "Landline",
  voip: "VoIP",
  unknown: "Unknown",
};

export const OwnerReportResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: OwnerResultState | null };

  const urlAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const paymentStatus = searchParams.get("payment");

  const storageKey = urlAddress
    ? `owner_session_${urlAddress.trim().toLowerCase()}`
    : null;

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (rawSessionId) return rawSessionId;
    return storageKey ? localStorage.getItem(storageKey) : null;
  });

  const [reportResponse, setReportResponse] =
    useState<OwnerContactReportResponse | null>(null);

  const [fetchReport, { loading }] = useLazyQuery<
    GetOwnerContactReportData,
    GetOwnerContactReportVars
  >(GET_OWNER_CONTACT_REPORT, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (rawSessionId && storageKey) {
      localStorage.setItem(storageKey, rawSessionId);
      setSessionId(rawSessionId);
      searchParams.delete("sessionId");
      setSearchParams(searchParams, { replace: true });
    }
  }, [rawSessionId, storageKey, searchParams, setSearchParams]);

  useEffect(() => {
    if (state?.reportData) {
      setReportResponse({
        success: true,
        message: "",
        reportData: state.reportData,
      });
      return;
    }

    if (paymentStatus === "success" && sessionId && urlAddress) {
      let attempts = 0;
      let timeoutId: NodeJS.Timeout;

      const loadReport = async () => {
        try {
          const { data } = await fetchReport({
            variables: { input: { address: urlAddress, sessionId } },
          });

          const res = data?.getOwnerContactReport;
          if (res?.success && res.reportData) {
            setReportResponse(res);
          } else if (attempts < 3) {
            attempts++;
            timeoutId = setTimeout(loadReport, 2000);
          } else if (res) {
            setReportResponse(res);
          }
        } catch (err) {
          console.error("Error fetching report:", err);
        }
      };

      loadReport();
      return () => clearTimeout(timeoutId);
    }
  }, [paymentStatus, sessionId, urlAddress, state, fetchReport]);

  if (
    loading ||
    (!reportResponse && paymentStatus === "success" && sessionId)
  ) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">Owner & contact report</p>
            <h1 className="vrr-address">
              {urlAddress || "Preparing report..."}
            </h1>
          </div>
        </section>

        <main className="vrr-main">
          <section
            className="vrr-card"
            style={{
              textAlign: "center",
              padding: "3.5rem 2rem",
              marginTop: "2rem",
            }}
          >
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "2rem", height: "2rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h2
              className="vrr-card-title"
              style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}
            >
              Unlocking your owner report…
            </h2>
            <p
              className="text-muted"
              style={{ margin: 0, fontSize: "0.95rem" }}
            >
              Skip-tracing owner records and mapping contact relationships...
            </p>
          </section>
        </main>
      </div>
    );
  }

  if (
    paymentStatus === "canceled" ||
    (!reportResponse && !state) ||
    !sessionId
  ) {
    navigate("/reports/owner");
    return null;
  }

  const address = urlAddress || state?.address || "";
  const reportData = reportResponse?.reportData || state?.reportData || null;
  const generatedAt = state?.generatedAt || new Date().toISOString();

  if (!reportData) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <button
              type="button"
              className="vrr-back"
              onClick={() => navigate("/reports/owner")}
            >
              &larr; New owner report
            </button>
            <p className="vrr-eyebrow">Owner & contact report</p>
            <h1 className="vrr-address">{address}</h1>
          </div>
        </section>
        <main className="vrr-main">
          <section className="vrr-card" style={{ padding: "2.5rem 2rem" }}>
            <h2 className="vrr-card-title">
              We couldn&rsquo;t generate this report
            </h2>
            <p className="text-muted" style={{ margin: 0 }}>
              {reportResponse?.message ||
                "Something went wrong while generating this report."}
            </p>
          </section>
        </main>
      </div>
    );
  }

  const { ownerIdentity, contacts, persons = [] } = reportData;

  const isUnverifiedEntity =
    contacts.identityUnverified ||
    (ownerIdentity.isCorporateOrLLC && !ownerIdentity.unwoundIndividualName);

  const primaryPerson = isUnverifiedEntity
    ? undefined
    : persons.find((p) => p.isPrimaryOwnerMatch) || persons[0];

  const secondaryPersons = persons.filter(
    (p) => p.personId !== primaryPerson?.personId,
  );

  const hasNoSkipTraceData = !contacts.hasContactData && persons.length === 0;

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/owner")}
          >
            &larr; New owner report
          </button>
          <p className="vrr-eyebrow">Owner & contact report</p>
          <h1 className="vrr-address">{address}</h1>
          {generatedAt && (
            <p className="vrr-generated">
              Generated {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      <main className="vrr-main">
        {/* CORPORATE / LLC NOTICE */}
        {ownerIdentity.isCorporateOrLLC && (
          <section
            className="vrr-card"
            style={{
              borderLeft: "4px solid #0284c7",
              background: "#f0f9ff",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <Building
              size={24}
              style={{ color: "#0284c7", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <h2
                className="vrr-card-title"
                style={{ color: "#0369a1", marginBottom: "0.25rem" }}
              >
                Corporate or LLC Property
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#334155" }}>
                <strong>{ownerIdentity.name}</strong> is registered as a
                business entity or LLC. Direct individual phone and email
                skip-trace records are not publicly indexed for corporate
                owners.
              </p>
            </div>
          </section>
        )}

        {/* NO SKIP-TRACE DATA FOUND ALERT */}
        {hasNoSkipTraceData && !ownerIdentity.isCorporateOrLLC && (
          <section
            className="vrr-card"
            style={{
              borderLeft: "4px solid #eab308",
              background: "#fefce8",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle
              size={24}
              style={{ color: "#ca8a04", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <h2
                className="vrr-card-title"
                style={{ color: "#854d0e", marginBottom: "0.25rem" }}
              >
                No Direct Contact Records Found
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#451a03" }}>
                No phone numbers or email addresses were returned for this
                address or owner in public telco records.
              </p>
            </div>
          </section>
        )}

        {contacts.hasDncOrLitigatorWarning && (
          <section
            className="vrr-card"
            style={{ borderLeft: "4px solid #d9534f", background: "#fdf2f2" }}
          >
            <h2 className="vrr-card-title" style={{ color: "#c0392b" }}>
              Compliance Warning
            </h2>
            <p style={{ margin: 0 }}>
              One or more numbers contain active National DNC registry status or
              TCPA Litigation flags.
            </p>
          </section>
        )}

        {/* PRIMARY OWNER CARD */}
        <section className="vrr-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="vrr-card-title">Property Owner Record</h2>
            {primaryPerson && (
              <span
                style={{
                  padding: "0.25rem 0.6rem",
                  background: "#0d6efd",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Primary Match
              </span>
            )}
          </div>

          <dl className="vrr-details" style={{ marginTop: "1rem" }}>
            <div className="vrr-detail">
              <dt>Owner of Record</dt>
              <dd>{ownerIdentity.name || "N/A"}</dd>
            </div>
            <div className="vrr-detail">
              <dt>Ownership Type</dt>
              <dd>
                {ownerIdentity.isCorporateOrLLC
                  ? "Corporate / LLC"
                  : "Individual"}
              </dd>
            </div>
            {ownerIdentity.isCorporateOrLLC && (
              <div className="vrr-detail">
                <dt>Unwound Individual</dt>
                <dd>{ownerIdentity.unwoundIndividualName || "Not found"}</dd>
              </div>
            )}
            <div className="vrr-detail">
              <dt>Mailing Address</dt>
              <dd>{ownerIdentity.mailingAddress || "N/A"}</dd>
            </div>
            {primaryPerson && (
              <>
                <div className="vrr-detail">
                  <dt>Full Name</dt>
                  <dd>{primaryPerson.fullName}</dd>
                </div>
                <div className="vrr-detail">
                  <dt>Age</dt>
                  <dd>{primaryPerson.age || "N/A"}</dd>
                </div>
                <div className="vrr-detail">
                  <dt>Marital Status</dt>
                  <dd>{primaryPerson.maritalStatus || "N/A"}</dd>
                </div>
              </>
            )}
          </dl>

          {primaryPerson ? (
            <PersonContactsSubSection person={primaryPerson} />
          ) : (
            <p
              className="text-muted"
              style={{
                fontSize: "0.9rem",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px dashed #cbd5e1",
              }}
            >
              {ownerIdentity.isCorporateOrLLC
                ? "Individual skip-trace contact data is unavailable for corporate entities."
                : "No phone or email contacts were found for this owner."}
              {secondaryPersons.length > 0 && " See associated persons below."}
            </p>
          )}
        </section>

        {/* ASSOCIATED PERSONS / OCCUPANTS SECTION */}
        {secondaryPersons.length > 0 && (
          <section className="vrr-card">
            <h2 className="vrr-card-title">
              Associated Persons & Occupants ({secondaryPersons.length})
            </h2>
            <p
              className="text-muted"
              style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}
            >
              Other individuals identified at this address or associated with
              the primary record.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {secondaryPersons.map((person) => (
                <div
                  key={person.personId}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          margin: "0 0 0.25rem",
                          color: "#1e293b",
                        }}
                      >
                        {person.fullName}
                      </h3>
                      <p
                        className="text-muted"
                        style={{ margin: 0, fontSize: "0.85rem" }}
                      >
                        {person.age ? `Age: ${person.age} · ` : ""}
                        {person.maritalStatus
                          ? `Status: ${person.maritalStatus}`
                          : ""}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        background: "#e2e8f0",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      Associated Record
                    </span>
                  </div>

                  {person.previousAddress && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        margin: "0.5rem 0 0",
                      }}
                    >
                      <strong>Prev. Address:</strong> {person.previousAddress}
                    </p>
                  )}

                  <PersonContactsSubSection person={person} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="vrr-actions">
          <PDFDownloadLink
            document={
              <OwnerReportPDFDocument
                address={address}
                reportResponse={reportResponse!}
                generatedAt={generatedAt}
              />
            }
            fileName={`Owner_Report_${address.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`}
            className="vrr-btn is-primary text-center"
            style={{ textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : "Download PDF Report"
            }
          </PDFDownloadLink>
          <button
            type="button"
            className="vrr-btn"
            onClick={() => navigate("/reports/owner")}
          >
            Look up another owner
          </button>
        </div>
      </main>
    </div>
  );
};

const PersonContactsSubSection: React.FC<{ person: PersonRecord }> = ({
  person,
}) => {
  return (
    <div
      style={{
        marginTop: "1rem",
        paddingTop: "1rem",
        borderTop: "1px dashed #cbd5e1",
      }}
    >
      <h4
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.9rem",
          color: "#475569",
          marginBottom: "0.5rem",
        }}
      >
        <Phone size={14} style={{ flexShrink: 0 }} />
        Phone Numbers ({person.phones.length})
      </h4>
      {person.phones.length > 0 ? (
        <ul className="vrr-drivers" style={{ marginBottom: "1rem" }}>
          {person.phones.map((phone) => (
            <li
              className="vrr-driver"
              key={phone.number}
              style={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  width: "100%",
                }}
              >
                <span
                  className="vrr-driver-name"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    minWidth: 0,
                  }}
                >
                  <Phone
                    size={13}
                    style={{ flexShrink: 0, color: "#94a3b8" }}
                  />
                  {phone.number}
                </span>
                <span className="text-muted" style={{ flexShrink: 0 }}>
                  {PHONE_TYPE_LABEL[phone.type ?? "unknown"] ??
                    phone.type ??
                    "Unknown"}{" "}
                  · Rank {phone.confidenceRank}
                </span>
              </div>
              {(phone.dncFlag || phone.litigatorFlag) && (
                <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1.1rem" }}>
                  {phone.complianceNotes.map((note, idx) => (
                    <li
                      key={idx}
                      style={{ color: "#c0392b", fontSize: "0.8rem" }}
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p
          className="text-muted"
          style={{ fontSize: "0.85rem", margin: "0 0 1rem" }}
        >
          No phones directly linked to this record.
        </p>
      )}

      <h4
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.9rem",
          color: "#475569",
          marginBottom: "0.5rem",
        }}
      >
        <Mail size={14} style={{ flexShrink: 0 }} />
        Email Addresses ({person.emails.length})
      </h4>
      {person.emails.length > 0 ? (
        <ul className="vrr-drivers" style={{ margin: 0 }}>
          {person.emails.map((email) => (
            <li
              className="vrr-driver"
              key={email.email}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <span
                className="vrr-driver-name"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  minWidth: 0,
                  wordBreak: "break-all",
                }}
              >
                <Mail size={13} style={{ flexShrink: 0, color: "#94a3b8" }} />
                {email.email}
              </span>
              <span className="text-muted" style={{ flexShrink: 0 }}>
                Rank {email.confidenceRank}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted" style={{ fontSize: "0.85rem", margin: 0 }}>
          No emails directly linked to this record.
        </p>
      )}
    </div>
  );
};

export default OwnerReportResult;
