import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import LogoAsset from "../../assets/logo.png";
import type { DebtPositionReportResponse } from "../../types/Reports";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#0f172a",
    paddingBottom: 12,
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    objectFit: "contain",
    marginRight: 8,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  docTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  hero: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  eyebrow: {
    fontSize: 7,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  address: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  summaryBanner: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 6,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: "31%",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  label: {
    fontSize: 7,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  lienItem: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 7,
    color: "#94a3b8",
  },
});

const formatCurrency = (val?: number | null) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return `$${Math.round(val).toLocaleString()}`;
};

const formatPercent = (val?: number | null, digits = 1) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return `${val.toFixed(digits)}%`;
};

interface DebtPositionReportPDFProps {
  address: string;
  reportResponse: DebtPositionReportResponse | null;
  generatedAt?: string;
}

export const DebtPositionReportPDFDocument: React.FC<
  DebtPositionReportPDFProps
> = ({ address, reportResponse, generatedAt = new Date().toISOString() }) => {
  const reportData = reportResponse?.reportData;
  if (!reportData) return null;

  const {
    subjectAddress,
    mortgage,
    foreclosure,
    liens,
    distressSummaryMessage,
  } = reportData;

  const openLiens = liens.filter((l) => !l.isReleased);
  const isDistressFree =
    !foreclosure.hasDistressIndicator && openLiens.length === 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image src={LogoAsset} style={styles.logo} />
            <Text style={styles.brandName}>PROPOMY</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docTitle}>DEBT POSITION REPORT</Text>
            <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 2 }}>
              {new Date(generatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Subject Property</Text>
          <Text style={styles.address}>{subjectAddress || address}</Text>
        </View>

        {/* Distress Summary Banner */}
        <View
          style={[
            styles.summaryBanner,
            {
              backgroundColor: isDistressFree ? "#f0fdf4" : "#fefce8",
              borderLeftColor: isDistressFree ? "#22c55e" : "#eab308",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: isDistressFree ? "#15803d" : "#854d0e",
            }}
          >
            {distressSummaryMessage}
          </Text>
        </View>

        {/* Mortgage Position */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mortgage Position</Text>
          {!mortgage.hasActiveMortgage ? (
            <Text style={{ fontSize: 9, color: "#64748b" }}>
              {mortgage.summaryMessage || "No active mortgage on record."}
            </Text>
          ) : (
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Lender / Servicer</Text>
                <Text style={styles.value}>
                  {mortgage.lenderOrServicer || "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Loan Type</Text>
                <Text style={styles.value}>{mortgage.loanType || "N/A"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Origination Date</Text>
                <Text style={styles.value}>
                  {mortgage.originationDate || "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Original Balance</Text>
                <Text style={styles.value}>
                  {formatCurrency(mortgage.originalLoanAmount)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Est. Current Balance</Text>
                <Text style={styles.value}>
                  {formatCurrency(mortgage.estimatedCurrentBalance)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Interest Rate</Text>
                <Text style={styles.value}>
                  {formatPercent(mortgage.interestRate, 2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Foreclosure & Auction Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Foreclosure & Auction Status</Text>
          {!foreclosure.hasDistressIndicator ? (
            <Text style={{ fontSize: 9, color: "#64748b" }}>
              No pre-foreclosure or auction records found for this address.
            </Text>
          ) : (
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>NOD Status</Text>
                <Text style={styles.value}>
                  {foreclosure.isPreForeclosureOrNod ? "Active Flag" : "None"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Default Amount</Text>
                <Text style={styles.value}>
                  {formatCurrency(foreclosure.defaultAmount)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Auction Date</Text>
                <Text style={styles.value}>
                  {foreclosure.auctionDate || "Not Scheduled"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Involuntary Liens Audit */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Involuntary Liens Audit</Text>
          {liens.length === 0 ? (
            <Text style={{ fontSize: 9, color: "#64748b" }}>
              No open or historical involuntary lien filings on record.
            </Text>
          ) : (
            liens.map((lien) => (
              <View key={lien.id} style={styles.lienItem}>
                <View>
                  <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                    {lien.type} LIEN — {lien.status}
                  </Text>
                  <Text style={{ fontSize: 8, color: "#64748b" }}>
                    Holder: {lien.holder || "N/A"} | Filed:{" "}
                    {lien.filingDate || "N/A"}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: lien.isReleased ? "#64748b" : "#b91c1c",
                  }}
                >
                  {formatCurrency(lien.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Propomy • Confidential • Auto-generated Debt Position Report
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DebtPositionReportPDFDocument;
