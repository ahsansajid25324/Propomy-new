import React from "react";
import { X, AlertTriangle, Info } from "lucide-react";
import {
  SAMPLE_REPORTS_DETAILS,
  type SampleReportDetail,
} from "./../../libs/constants/SampleReport";
import "../../styles/ReportHub.css";

interface ModalProps {
  reportId: string | null;
  onClose: () => void;
}

export const SampleReportModal: React.FC<ModalProps> = ({
  reportId,
  onClose,
}) => {
  if (!reportId || !SAMPLE_REPORTS_DETAILS[reportId]) return null;

  const data: SampleReportDetail = SAMPLE_REPORTS_DETAILS[reportId];

  return (
    <div className="modal-overlay" onClick={onClose} style={overlayStyle}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={containerStyle}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ minWidth: 0, flex: 1, paddingRight: "1rem" }}>
            <span style={badgeStyle}>{data.price} Sample</span>
            <h2
              style={{
                margin: "4px 0 2px",
                fontSize: "1.35rem",
                color: "#0F172A",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {data.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#64748B",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {data.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={bodyStyle}>
          <p style={summaryStyle}>{data.summary}</p>

          {data.notice && (
            <div
              style={{
                ...noticeStyle,
                backgroundColor:
                  data.notice.type === "warning" ? "#FFFBEB" : "#EFF6FF",
                borderColor:
                  data.notice.type === "warning" ? "#FCD34D" : "#BFDBFE",
                color: data.notice.type === "warning" ? "#92400E" : "#1E40AF",
              }}
            >
              {data.notice.type === "warning" ? (
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              ) : (
                <Info size={18} style={{ flexShrink: 0 }} />
              )}
              <span style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                {data.notice.text}
              </span>
            </div>
          )}

          {/* Groups & Key-Value Pairs */}
          {data.groups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: "1.25rem", minWidth: 0 }}>
              <h3 style={groupTitleStyle}>{group.sectionTitle}</h3>
              <div style={gridStyle}>
                {group.fields.map((field, fIdx) => (
                  <div key={fIdx} style={fieldCardStyle}>
                    <span style={fieldLabelStyle} title={field.label}>
                      {field.label}
                    </span>
                    <span
                      style={{
                        ...fieldValueStyle,
                        fontWeight: field.highlight ? 700 : 600,
                        color:
                          field.status === "warning"
                            ? "#DC2626"
                            : field.status === "positive"
                              ? "#16A34A"
                              : "#0F172A",
                      }}
                    >
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button onClick={onClose} className="btn" style={btnSecondaryStyle}>
            Close Preview
          </button>
          <a
            href={`/reports/${data.id}`}
            className="btn btn-primary"
            style={btnPrimaryStyle}
          >
            Run Live {data.title} ({data.price})
          </a>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.65)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "1rem",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "680px",
  maxHeight: "85vh",
  display: "flex",
  flexDirection: "column",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  boxSizing: "border-box",
};

const headerStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  borderBottom: "1px solid #E2E8F0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  minWidth: 0,
};

const badgeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 700,
  backgroundColor: "#EFF6FF",
  color: "#2563EB",
  padding: "2px 8px",
  borderRadius: "4px",
  textTransform: "uppercase",
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#64748B",
  padding: "4px",
  borderRadius: "4px",
  flexShrink: 0,
};

const bodyStyle: React.CSSProperties = {
  padding: "1.5rem",
  overflowY: "auto",
  overflowX: "hidden",
  flex: 1,
  minWidth: 0,
  boxSizing: "border-box",
};

const summaryStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#334155",
  marginBottom: "1rem",
  lineHeight: 1.5,
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const noticeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid",
  fontSize: "0.85rem",
  marginBottom: "1.25rem",
};

const groupTitleStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.6rem",
  width: "100%",
  boxSizing: "border-box",
  whiteSpace: "normal",
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "0.6rem",
  width: "100%",
  boxSizing: "border-box",
};

const fieldCardStyle: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  padding: "0.6rem 0.8rem",
  borderRadius: "6px",
  border: "1px solid #F1F5F9",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  overflow: "hidden",
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#64748B",
  marginBottom: "2px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
};

const fieldValueStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const footerStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  borderTop: "1px solid #E2E8F0",
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  backgroundColor: "#F8FAFC",
  flexWrap: "wrap",
};

const btnSecondaryStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "1px solid #CBD5E1",
  background: "#FFF",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.875rem",
};

const btnPrimaryStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  background: "#2563EB",
  color: "#FFF",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
};