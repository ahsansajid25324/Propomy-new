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
  DealAnalysisReportResponse,
  ResolvedPurchaseTerms,
  InvestmentMetrics,
  BrrrrSnapshot,
} from "../../types/Reports";
import {
  resolvePurchaseTerms,
  buildInvestmentMetrics,
  buildBrrrrSnapshot,
} from "../../utils/dealReport";

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

interface DealAnalysisReportPDFProps {
  address: string;
  reportResponse: DealAnalysisReportResponse | null;
  generatedAt?: string;
  termsOverride?: ResolvedPurchaseTerms | null;
  metricsOverride?: InvestmentMetrics | null;
  brrrrOverride?: BrrrrSnapshot | null;
}

export const DealAnalysisReportPDFDocument: React.FC<
  DealAnalysisReportPDFProps
> = ({
  address,
  reportResponse,
  generatedAt = new Date().toISOString(),
  termsOverride,
  metricsOverride,
  brrrrOverride,
}) => {
  const reportData = reportResponse?.reportData;
  if (!reportData) return null;

  const { subject, avm, compsSanityCheck } = reportData;

  const terms = termsOverride || resolvePurchaseTerms({}, avm, subject);
  const metrics = metricsOverride || buildInvestmentMetrics(terms);
  const brrrr = brrrrOverride || buildBrrrrSnapshot(terms);

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
            <Text style={styles.docTitle}>DEAL ANALYSIS REPORT</Text>
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

        {/* Baseline Property Snapshot */}
        {subject && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Subject Property Baseline</Text>
            <View style={styles.gridContainer}>
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
                  {subject.lotAcres ? `${subject.lotAcres} acres` : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Annual Tax</Text>
                <Text style={styles.value}>
                  {formatCurrency(subject.annualTax)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Valuation & Comps Check */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AVM Estimate & Comps Check</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Estimated Value</Text>
              <Text style={styles.value}>{formatCurrency(avm.value)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Value Range</Text>
              <Text style={styles.value}>
                {formatCurrency(avm.rangeLow)} - {formatCurrency(avm.rangeHigh)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Comps Analyzed</Text>
              <Text style={styles.value}>
                {compsSanityCheck.compsUsed || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Purchase Terms */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Purchase Terms & Modeling</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Purchase Price</Text>
              <Text style={styles.value}>
                {formatCurrency(terms.purchasePrice)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Down Payment</Text>
              <Text style={styles.value}>{terms.downPaymentPct}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Interest Rate</Text>
              <Text style={styles.value}>{terms.interestRatePct}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Loan Amount</Text>
              <Text style={styles.value}>
                {formatCurrency(terms.loanAmount)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Monthly P&I</Text>
              <Text style={styles.value}>
                {formatCurrency(terms.monthlyPI)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Est. Cash to Close</Text>
              <Text style={styles.value}>
                {formatCurrency(terms.estCashToClose)}
              </Text>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Investment Return Metrics</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Cap Rate</Text>
              <Text style={styles.value}>
                {formatPercent(metrics.capRatePct, 2)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Cash-on-Cash</Text>
              <Text style={styles.value}>
                {formatPercent(metrics.cashOnCashPct, 2)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Monthly Cash Flow</Text>
              <Text style={styles.value}>
                {formatCurrency(metrics.monthlyCashFlow)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>GRM</Text>
              <Text style={styles.value}>{metrics.grm ?? "N/A"}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>DSCR</Text>
              <Text style={styles.value}>{metrics.dscr ?? "N/A"}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>1-Yr ROI</Text>
              <Text style={styles.value}>
                {formatPercent(metrics.roi1yrPct)}
              </Text>
            </View>
          </View>
        </View>

        {/* BRRRR Strategy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BRRRR Strategy Snapshot</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Current Loan Balance</Text>
              <Text style={styles.value}>
                {formatCurrency(brrrr.currentLoanBalance)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Refinance Loan (75% LTV)</Text>
              <Text style={styles.value}>
                {formatCurrency(brrrr.refinanceLoanAmount)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Cash Left in Deal</Text>
              <Text style={styles.value}>
                {formatCurrency(brrrr.cashLeftInDeal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Propomy • Confidential • Auto-generated Deal Analysis Report
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DealAnalysisReportPDFDocument;
