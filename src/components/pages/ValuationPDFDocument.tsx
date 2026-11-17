import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { PropertyByIdResponse } from "../../types/Property";
import type { ValuationReportResponse } from "../../types/Reports";
import { capitalize } from "../../utils/StringUtils";

// Import the logo asset
import LogoAsset from "../../assets/logo.png";

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
    marginBottom: 16,
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
    marginBottom: 8,
  },
  confidenceBadge: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 6,
  },
  avmGrid: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avmBox: {
    width: "32%", // Fixed overlapping in estimate boxes
  },
  avmLabel: {
    fontSize: 7,
    color: "#64748b",
  },
  avmValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 2,
  },
  explanation: {
    marginTop: 8,
    fontSize: 8,
    color: "#475569",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  gridTwoCol: {
    flexDirection: "row",
    justifyContent: "space-between", // Fixed two-column overlap
  },
  column: {
    width: "48%", // Explicit width for layout calculation
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  label: {
    color: "#64748b",
    fontSize: 8,
    maxWidth: "60%", // Prevents long labels from running into values
  },
  value: {
    fontWeight: "bold",
    color: "#0f172a",
    fontSize: 8,
    textAlign: "right",
    maxWidth: "38%", // Prevents values from overlapping labels
  },
  positiveImpact: {
    fontWeight: "bold",
    color: "#16a34a",
    fontSize: 8,
    textAlign: "right",
  },
  negativeImpact: {
    fontWeight: "bold",
    color: "#dc2626",
    fontSize: 8,
    textAlign: "right",
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

const formatCurrency = (val?: number | null) =>
  val !== undefined && val !== null ? `$${val.toLocaleString()}` : "N/A";

interface ValuationPDFProps {
  property: PropertyByIdResponse;
  prediction?: ValuationReportResponse["prediction"];
  propertyData?: ValuationReportResponse["propertyData"];
  generatedAt?: string;
}

export const ValuationPDFDocument: React.FC<ValuationPDFProps> = ({
  property,
  prediction,
  propertyData,
  generatedAt = new Date().toISOString(),
}) => {
  const details = [
    { label: "Property type", value: propertyData?.propertyType ?? "N/A" },
    {
      label: "Year built",
      value: propertyData?.yearBuilt?.toString() ?? "N/A",
    },
    { label: "Bedrooms", value: propertyData?.bedrooms?.toString() ?? "N/A" },
    { label: "Bathrooms", value: propertyData?.bathrooms?.toString() ?? "N/A" },
    {
      label: "Living area",
      value: propertyData?.livingSqFt
        ? `${propertyData.livingSqFt.toLocaleString()} sq ft`
        : "N/A",
    },
    { label: "Zip code", value: propertyData?.zipcode ?? "N/A" },
  ];

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
            <Text style={styles.docTitle}>VALUATION REPORT</Text>
            <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 2 }}>
              ID: {property._id.slice(-8).toUpperCase()} •{" "}
              {new Date(generatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Property Address</Text>
          <Text style={styles.address}>{property.address}</Text>

          {prediction?.quality_tier && (
            <Text style={styles.confidenceBadge}>
              {capitalize(prediction.quality_tier)} Confidence
              {typeof prediction.quality_score === "number" &&
                ` · ${(prediction.quality_score * 100).toFixed(0)}%`}
            </Text>
          )}

          {/* Value Range */}
          <View style={styles.avmGrid}>
            <View style={styles.avmBox}>
              <Text style={styles.avmLabel}>Low Estimate</Text>
              <Text style={styles.avmValue}>
                {formatCurrency(property.avmLow)}
              </Text>
            </View>
            <View style={styles.avmBox}>
              <Text style={styles.avmLabel}>Estimated Value (Mid)</Text>
              <Text style={[styles.avmValue, { color: "#2563eb" }]}>
                {formatCurrency(property.avmMid)}
              </Text>
            </View>
            <View style={styles.avmBox}>
              <Text style={styles.avmLabel}>High Estimate</Text>
              <Text style={styles.avmValue}>
                {formatCurrency(property.avmHigh)}
              </Text>
            </View>
          </View>

          {prediction?.explanation && (
            <Text style={styles.explanation}>
              {capitalize(prediction.explanation)}
            </Text>
          )}
        </View>

        {/* Content Section: Drivers & Details Side-by-Side */}
        <View style={styles.gridTwoCol}>
          {/* Key Valuation Drivers */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Key Valuation Drivers</Text>
            {prediction?.top_features && prediction.top_features.length > 0 ? (
              prediction.top_features.map((item, idx) => (
                <View style={styles.row} key={idx}>
                  <Text style={styles.label}>{capitalize(item.feature)}</Text>
                  <Text
                    style={
                      item.impact >= 0
                        ? styles.positiveImpact
                        : styles.negativeImpact
                    }
                  >
                    {item.impact > 0 ? `+${item.impact}` : item.impact}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.label}>No driver data available</Text>
            )}
          </View>

          {/* Property Details */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            {details.map((item) => (
              <View style={styles.row} key={item.label}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Propomy • Confidential • Auto-generated Valuation Report</Text>
        </View>
      </Page>
    </Document>
  );
};
