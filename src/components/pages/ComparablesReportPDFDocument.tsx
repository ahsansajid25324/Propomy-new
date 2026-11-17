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
import type {
  ComparablesReportResponse,
  ComparableProperty,
} from "../../types/Reports";

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
  // Baseline grid styles
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
  // Table styles
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  colAddress: { width: "35%", fontSize: 8, fontWeight: "bold" },
  colDetails: { width: "25%", fontSize: 8, color: "#475569" },
  colPrice: {
    width: "20%",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "right",
  },
  colScore: {
    width: "20%",
    fontSize: 8,
    color: "#2563eb",
    textAlign: "right",
    fontWeight: "bold",
  },
  thText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  badgeScore: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 7,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
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

interface ComparablesReportPDFProps {
  address: string;
  reportResponse: ComparablesReportResponse | null;
  generatedAt?: string;
}

export const ComparablesReportPDFDocument: React.FC<
  ComparablesReportPDFProps
> = ({ address, reportResponse, generatedAt = new Date().toISOString() }) => {
  const reportData = reportResponse?.reportData;
  if (!reportData) return null;

  const { subject, summary, comps = [] } = reportData;

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
            <Text style={styles.docTitle}>COMPARABLES REPORT</Text>
            <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 2 }}>
              {new Date(generatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Target Address Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Subject Property</Text>
          <Text style={styles.address}>{address}</Text>
        </View>

        {/* 1. Subject Property Baseline */}
        {subject && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subject Property Baseline</Text>
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{subject.address || address}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Beds / Baths</Text>
                <Text style={styles.value}>
                  {subject.beds ?? "N/A"} bd / {subject.baths ?? "N/A"} ba
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Living Area</Text>
                <Text style={styles.value}>
                  {subject.sqft
                    ? `${subject.sqft.toLocaleString()} sqft`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Year Built</Text>
                <Text style={styles.value}>{subject.yearBuilt || "N/A"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Lot Size</Text>
                <Text style={styles.value}>
                  {subject.lotSqft
                    ? `${subject.lotSqft.toLocaleString()} sqft`
                    : subject.lotAcres
                      ? `${subject.lotAcres} acres`
                      : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Baseline $/sqft</Text>
                <Text style={styles.value}>
                  {subject.pricePerSqftBaseline
                    ? `$${Number(subject.pricePerSqftBaseline).toFixed(2)}`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 2. Valuation Summary */}
        {summary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Comps Summary & Valuation Range
            </Text>
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Suggested Range</Text>
                <Text style={styles.value}>
                  {summary.suggestedRangeLow && summary.suggestedRangeHigh
                    ? `$${summary.suggestedRangeLow.toLocaleString()} - $${summary.suggestedRangeHigh.toLocaleString()}`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Median $/sqft</Text>
                <Text style={styles.value}>
                  {summary.medianPricePerSqft
                    ? `$${Number(summary.medianPricePerSqft).toFixed(2)}/sqft`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Comps Analyzed</Text>
                <Text style={styles.value}>
                  {summary.compsFound ?? comps.length}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 3. Comparable Properties Table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Matched Comparable Sales ({comps.length})
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.colAddress, styles.thText]}>Property</Text>
            <Text style={[styles.colDetails, styles.thText]}>
              Beds / Baths / SqFt
            </Text>
            <Text style={[styles.colPrice, styles.thText]}>Sale Price</Text>
            <Text style={[styles.colScore, styles.thText]}>Similarity</Text>
          </View>

          {comps.length > 0 ? (
            comps.map((comp: ComparableProperty, idx: number) => (
              <View key={comp.id || idx} style={styles.tableRow}>
                <View style={styles.colAddress}>
                  <Text style={{ fontWeight: "bold", color: "#0f172a" }}>
                    {comp.address}
                  </Text>
                  {comp.saleDate && (
                    <Text style={{ fontSize: 7, color: "#64748b" }}>
                      Sold: {new Date(comp.saleDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <Text style={styles.colDetails}>
                  {comp.beds ?? "-"}bd | {comp.baths ?? "-"}ba |{" "}
                  {comp.sqft ? `${comp.sqft} sqft` : "-"}
                </Text>
                <Text style={styles.colPrice}>
                  {comp.salePrice
                    ? `$${comp.salePrice.toLocaleString()}`
                    : "N/A"}
                </Text>
                <View style={[styles.colScore, { alignItems: "flex-end" }]}>
                  <Text style={styles.badgeScore}>
                    {comp.similarity?.total != null
                      ? `${comp.similarity.total}% Match`
                      : "N/A"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text
              style={{
                fontSize: 8,
                color: "#94a3b8",
                fontStyle: "italic",
                marginVertical: 6,
              }}
            >
              No comparable sales available for this location.
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Propomy • Confidential • Auto-generated Comparables Report
          </Text>
        </View>
      </Page>
    </Document>
  );
};
