// src/components/pages/PropertyDeepDiveReportPDFDocument.tsx
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
import type { PropertyDeepDiveReportData } from "../../types/DeepDive";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0f172a",
    paddingBottom: 6,
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 18,
    height: 18,
    objectFit: "contain",
    marginRight: 6,
  },
  brandName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  docTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  hero: {
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  eyebrow: {
    fontSize: 6,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  address: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statusBanner: {
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
    borderLeftWidth: 3,
  },
  statusBannerDistress: {
    backgroundColor: "#fefce8",
    borderLeftColor: "#eab308",
  },
  statusBannerNormal: {
    backgroundColor: "#f0fdf4",
    borderLeftColor: "#22c55e",
  },
  statusTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 1,
  },
  statusText: {
    fontSize: 6.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 2,
    textTransform: "uppercase",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  gridItem: {
    width: "32%",
    backgroundColor: "#f8fafc",
    padding: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  gridItemHalf: {
    width: "49%",
    backgroundColor: "#f8fafc",
    padding: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  label: {
    fontSize: 5.5,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  value: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#0f172a",
  },
  compRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 4,
    backgroundColor: "#f8fafc",
    borderRadius: 3,
    marginBottom: 2.5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  compAddress: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#0f172a",
  },
  compMeta: {
    fontSize: 5.5,
    color: "#64748b",
    marginTop: 1,
  },
  compPrice: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "right",
  },
  badge: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
    fontSize: 5,
    fontWeight: "bold",
  },
  badgeRed: { backgroundColor: "#fee2e2", color: "#991b1b" },
  badgeGreen: { backgroundColor: "#dcfce7", color: "#166534" },
  badgeAmber: { backgroundColor: "#fef3c7", color: "#92400e" },
  badgeBlue: { backgroundColor: "#dbeafe", color: "#1e40af" },
  badgeNeutral: { backgroundColor: "#f1f5f9", color: "#475569" },
  warningBanner: {
    padding: 5,
    backgroundColor: "#fefce8",
    borderLeftWidth: 3,
    borderLeftColor: "#eab308",
    borderRadius: 3,
    marginBottom: 5,
  },
  warningText: {
    fontSize: 6.5,
    color: "#a16207",
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 24,
    right: 24,
    textAlign: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 6,
    color: "#94a3b8",
  },
});

const formatCurrency = (val?: number | null) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return `$${Math.round(val).toLocaleString()}`;
};

const formatPercent = (val?: number | null, digits = 1) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  const prefix = val > 0 ? "+" : "";
  return `${prefix}${val.toFixed(digits)}%`;
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
};

interface PropertyDeepDiveReportPDFProps {
  address: string;
  reportData: PropertyDeepDiveReportData;
  generatedAt?: string;
}

export const PropertyDeepDiveReportPDFDocument: React.FC<
  PropertyDeepDiveReportPDFProps
> = ({ address, reportData, generatedAt = new Date().toISOString() }) => {
  const {
    overview,
    valuation,
    comparables,
    ownerContact,
    marketArea,
    dealAnalysis,
    distressAndLien,
    meta,
  } = reportData;

  const matchedAddress =
    meta?.matchedAddress || overview?.matchedAddress || address;
  const qualityScore = valuation?.prediction?.quality_score ?? null;
  const hasDistress = !!distressAndLien?.foreclosure?.hasDistressIndicator;

  const comps = comparables?.comps || [];
  const identity = ownerContact?.ownerIdentity;
  const contacts = ownerContact?.contacts;
  const household = ownerContact?.household;
  const relativesText = Array.isArray(household?.relativesAndAssociates)
    ? household.relativesAndAssociates.join(", ")
    : household?.relativesAndAssociates || "N/A";

  const mortgage = distressAndLien?.mortgage;
  const liens = distressAndLien?.liens || [];

  return (
    <Document>
      {/* PAGE 1: OVERVIEW & VALUATION */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image src={LogoAsset} style={styles.logo} />
            <Text style={styles.brandName}>PROPOMY</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docTitle}>PROPERTY DEEP DIVE REPORT</Text>
            <Text style={{ fontSize: 6, color: "#94a3b8", marginTop: 1 }}>
              Generated {formatDate(generatedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Subject Property</Text>
          <Text style={styles.address}>{matchedAddress}</Text>
        </View>

        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            hasDistress
              ? styles.statusBannerDistress
              : styles.statusBannerNormal,
          ]}
        >
          <Text
            style={[
              styles.statusTitle,
              { color: hasDistress ? "#854d0e" : "#15803d" },
            ]}
          >
            {hasDistress
              ? "Distress Flagged on Property"
              : "No distress flags found"}
          </Text>
          <Text
            style={[
              styles.statusText,
              { color: hasDistress ? "#a16207" : "#166534" },
            ]}
          >
            Estimated value {formatCurrency(overview?.estimatedValue)}
            {qualityScore !== null ? ` · ${qualityScore} confidence score` : ""}{" "}
            · Est. equity {formatCurrency(mortgage?.estimatedEquity)}
          </Text>
        </View>

        {/* Core Characteristics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Core Characteristics</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Beds / Baths</Text>
              <Text style={styles.value}>
                {overview?.beds ?? "N/A"} / {overview?.baths ?? "N/A"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Sqft</Text>
              <Text style={styles.value}>
                {overview?.sqft ? overview.sqft.toLocaleString() : "N/A"}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Year Built</Text>
              <Text style={styles.value}>{overview?.yearBuilt ?? "N/A"}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Estimated Value</Text>
              <Text style={styles.value}>
                {formatCurrency(overview?.estimatedValue)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Value Range Low</Text>
              <Text style={styles.value}>
                {formatCurrency(overview?.estimatedValueRangeLow)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Value Range High</Text>
              <Text style={styles.value}>
                {formatCurrency(overview?.estimatedValueRangeHigh)}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Last Sale</Text>
              <Text style={styles.value}>
                {formatCurrency(overview?.lastSaleAmount)}
              </Text>
            </View>
            <View style={styles.gridItemHalf}>
              <Text style={styles.label}>Last Sale Date</Text>
              <Text style={styles.value}>
                {formatDate(overview?.lastSaleDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Automated Valuation Model */}
        {valuation?.prediction && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Automated Valuation Model</Text>
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>AVM Estimate</Text>
                <Text style={styles.value}>
                  {formatCurrency(
                    valuation.prediction.valuation ??
                      valuation.prediction.prediction,
                  )}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Low Estimate</Text>
                <Text style={styles.value}>
                  {formatCurrency(valuation.prediction.low_estimate)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>High Estimate</Text>
                <Text style={styles.value}>
                  {formatCurrency(valuation.prediction.high_estimate)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Quality Score</Text>
                <Text style={styles.value}>
                  {valuation.prediction.quality_score ?? "N/A"}
                </Text>
              </View>
            </View>

            {valuation.prediction.explanation && (
              <Text style={{ fontSize: 6, color: "#64748b", marginTop: 4 }}>
                {valuation.prediction.explanation}
              </Text>
            )}

            {valuation.prediction.top_features &&
              valuation.prediction.top_features.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  <Text style={[styles.label, { marginBottom: 2 }]}>
                    Top Value Drivers
                  </Text>
                  {valuation.prediction.top_features.map((feat, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 1,
                        borderBottomWidth: 0.5,
                        borderBottomColor: "#f1f5f9",
                      }}
                    >
                      <Text style={{ fontSize: 6.5, color: "#334155" }}>
                        {feat.feature}
                      </Text>
                      <Text
                        style={{
                          fontSize: 6.5,
                          fontWeight: "bold",
                          color: feat.impact >= 0 ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {feat.impact}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
          </View>
        )}

        {/* OWNER IDENTITY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Owner Identity</Text>
          {identity ? (
            <View style={styles.gridContainer}>
              <View style={styles.gridItemHalf}>
                <Text style={styles.label}>Recorded Owner (Deed of Record)</Text>
                <Text style={styles.value}>{identity.name || "N/A"}</Text>
              </View>
              <View style={styles.gridItemHalf}>
                <Text style={styles.label}>Mailing Address</Text>
                <Text style={styles.value}>
                  {identity.mailingAddress || "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Age Range</Text>
                <Text style={styles.value}>{identity.ageRange || "N/A"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Marital Status</Text>
                <Text style={styles.value}>
                  {identity.maritalStatus || "N/A"}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ fontSize: 6.5, color: "#64748b" }}>
              No owner identity record available.
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text>Propomy • Confidential • Property Deep Dive Report (Page 1)</Text>
        </View>
      </Page>

      {/* PAGE 2: COMPLETE COMPARABLES & CONTACT DETAILS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image src={LogoAsset} style={styles.logo} />
            <Text style={styles.brandName}>PROPOMY</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docTitle}>PROPERTY DEEP DIVE REPORT</Text>
            <Text style={{ fontSize: 6, color: "#94a3b8", marginTop: 1 }}>
              Comparables & Owner Contacts
            </Text>
          </View>
        </View>

        {/* COMPLETE COMPARABLES LIST */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Comparable Sales ({comps.length} Records Found)
          </Text>
          {comps.length > 0 ? (
            <>
              {comps.map((comp) => (
                <View key={comp.id} style={styles.compRow}>
                  <View style={{ width: "65%" }}>
                    <Text style={styles.compAddress}>{comp.address}</Text>
                    <Text style={styles.compMeta}>
                      {comp.distanceMiles != null
                        ? `${comp.distanceMiles} mi`
                        : "N/A"}{" "}
                      · sold {formatDate(comp.saleDate)} · {comp.beds ?? "N/A"}
                      bd/{comp.baths ?? "N/A"}ba,{" "}
                      {comp.sqft ? comp.sqft.toLocaleString() : "N/A"} sqft
                    </Text>
                  </View>
                  <View style={{ width: "35%", alignItems: "flex-end" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 3,
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.compPrice}>
                        {formatCurrency(comp.salePrice)}
                      </Text>
                      {comp.similarity?.total != null && (
                        <Text style={[styles.badge, styles.badgeBlue]}>
                          Match {comp.similarity.total}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.compMeta}>
                      {comp.pricePerSqft != null
                        ? `$${comp.pricePerSqft}/sqft`
                        : "N/A"}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={[styles.gridContainer, { marginTop: 4 }]}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Median $/Sqft</Text>
                  <Text style={styles.value}>
                    {comparables?.summary?.medianPricePerSqft
                      ? `$${comparables.summary.medianPricePerSqft}`
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Avg $/Sqft</Text>
                  <Text style={styles.value}>
                    {comparables?.summary?.avgPricePerSqft
                      ? `$${comparables.summary.avgPricePerSqft}`
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Suggested Range</Text>
                  <Text style={styles.value}>
                    {formatCurrency(comparables?.summary?.suggestedRangeLow)} -{" "}
                    {formatCurrency(comparables?.summary?.suggestedRangeHigh)}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={{ fontSize: 6.5, color: "#64748b" }}>
              No comparable sales recorded for this property.
            </Text>
          )}
        </View>

        {/* CONTACT DETAILS & HOUSEHOLD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Owner Contact & Household</Text>
          {contacts?.hasContactData ? (
            <>
              {contacts.phones?.map((p, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 2,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#f1f5f9",
                  }}
                >
                  <Text style={{ fontSize: 7, color: "#0f172a" }}>
                    Phone: {p.number} {p.type ? `(${p.type})` : ""}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 3 }}>
                    {p.dncFlag && (
                      <Text style={[styles.badge, styles.badgeRed]}>DNC</Text>
                    )}
                    {p.confidenceRank != null && (
                      <Text style={[styles.badge, styles.badgeNeutral]}>
                        Rank {p.confidenceRank}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              {contacts.emails?.map((e, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontSize: 7, color: "#0f172a" }}>
                    Email: {e.email}
                  </Text>
                  {e.confidenceRank != null && (
                    <Text style={[styles.badge, styles.badgeNeutral]}>
                      Rank {e.confidenceRank}
                    </Text>
                  )}
                </View>
              ))}
            </>
          ) : (
            <Text style={{ fontSize: 6.5, color: "#64748b" }}>
              No verified contact details on file.
            </Text>
          )}

          <View style={[styles.gridContainer, { marginTop: 4 }]}>
            {household?.lengthOfResidence && (
              <View style={styles.gridItemHalf}>
                <Text style={styles.label}>Length of Residence</Text>
                <Text style={styles.value}>{household.lengthOfResidence}</Text>
              </View>
            )}
            <View style={styles.gridItemHalf}>
              <Text style={styles.label}>Relatives & Associates</Text>
              <Text style={styles.value}>{relativesText}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Propomy • Confidential • Property Deep Dive Report (Page 2)</Text>
        </View>
      </Page>

      {/* PAGE 3: MORTGAGE, LIENS, MARKET & DEAL ANALYSIS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image src={LogoAsset} style={styles.logo} />
            <Text style={styles.brandName}>PROPOMY</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docTitle}>PROPERTY DEEP DIVE REPORT</Text>
            <Text style={{ fontSize: 6, color: "#94a3b8", marginTop: 1 }}>
              Liens, Market & Deal Analysis
            </Text>
          </View>
        </View>

        {/* Mortgage Position */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mortgage Position</Text>
          {!mortgage?.hasActiveMortgage ? (
            <Text
              style={{ fontSize: 7, color: "#166534", fontWeight: "bold" }}
            >
              No active mortgage on record.
            </Text>
          ) : (
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Lender / Servicer</Text>
                <Text style={styles.value}>
                  {mortgage?.lenderOrServicer || "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Loan Type</Text>
                <Text style={styles.value}>{mortgage?.loanType || "N/A"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Origination Date</Text>
                <Text style={styles.value}>
                  {formatDate(mortgage?.originationDate)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Original Amount</Text>
                <Text style={styles.value}>
                  {formatCurrency(mortgage?.originalLoanAmount)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Est. Current Balance</Text>
                <Text style={styles.value}>
                  {formatCurrency(mortgage?.estimatedCurrentBalance)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Est. Equity</Text>
                <Text style={styles.value}>
                  {formatCurrency(mortgage?.estimatedEquity)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Involuntary Liens Audit */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Involuntary Liens Audit ({liens.length} Found)
          </Text>
          {liens.length > 0 ? (
            liens.map((lien) => (
              <View
                key={lien.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 2.5,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#f1f5f9",
                }}
              >
                <View>
                  <Text style={{ fontSize: 7, fontWeight: "bold" }}>
                    {lien.type || "JUDGMENT"}
                  </Text>
                  <Text style={{ fontSize: 5.5, color: "#64748b" }}>
                    {lien.holder} · filed {formatDate(lien.filingDate)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 7, fontWeight: "bold" }}>
                    {formatCurrency(lien.amount)}
                  </Text>
                  <Text
                    style={[
                      styles.badge,
                      lien.isReleased ? styles.badgeGreen : styles.badgeAmber,
                    ]}
                  >
                    {lien.isReleased ? "RELEASED" : lien.status || "OPEN"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 6.5, color: "#166534" }}>
              No involuntary liens found.
            </Text>
          )}
        </View>

        {/* Market & Area Snapshot */}
        {marketArea && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Market Snapshot ({marketArea.meta?.radiusMiles ?? "1"} Mi Radius)
            </Text>
            {marketArea.trend?.summaryMessage && (
              <View style={styles.warningBanner}>
                <Text style={styles.warningText}>
                  {marketArea.trend.summaryMessage}
                </Text>
              </View>
            )}
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Median Sale Price</Text>
                <Text style={styles.value}>
                  {formatCurrency(marketArea.snapshot?.medianSalePrice)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Median List Price</Text>
                <Text style={styles.value}>
                  {formatCurrency(marketArea.snapshot?.medianListPrice)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Median DOM</Text>
                <Text style={styles.value}>
                  {marketArea.snapshot?.medianDaysOnMarket != null
                    ? `${marketArea.snapshot.medianDaysOnMarket} days`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Active Listings</Text>
                <Text style={styles.value}>
                  {marketArea.inventory?.activeListings ?? "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Pending Listings</Text>
                <Text style={styles.value}>
                  {marketArea.inventory?.pendingListings ?? "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Total Comparable Inv.</Text>
                <Text style={styles.value}>
                  {marketArea.inventory?.totalComparableInventory ?? "N/A"}
                </Text>
              </View>
            </View>

            {/* Demographics Sub-block */}
            {marketArea.demographics?.isAvailable && (
              <View style={{ marginTop: 4 }}>
                <Text style={[styles.label, { marginBottom: 2 }]}>
                  ZIP {marketArea.demographics.zip} Demographics
                </Text>
                <View style={styles.gridContainer}>
                  <View style={styles.gridItem}>
                    <Text style={styles.label}>Population</Text>
                    <Text style={styles.value}>
                      {marketArea.demographics.population
                        ? marketArea.demographics.population.toLocaleString()
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.label}>Households</Text>
                    <Text style={styles.value}>
                      {marketArea.demographics.households
                        ? marketArea.demographics.households.toLocaleString()
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.label}>Median HH Income</Text>
                    <Text style={styles.value}>
                      {formatCurrency(
                        marketArea.demographics.medianHouseholdIncome,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Deal Analysis & Comps Sanity Check */}
        {dealAnalysis && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AVM & Comps Sanity Check</Text>
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>AVM Value</Text>
                <Text style={styles.value}>
                  {formatCurrency(dealAnalysis.avm?.value)}
                </Text>
              </View>
              <View style={styles.gridItemHalf}>
                <Text style={styles.label}>Range</Text>
                <Text style={styles.value}>
                  {formatCurrency(dealAnalysis.avm?.rangeLow)} –{" "}
                  {formatCurrency(dealAnalysis.avm?.rangeHigh)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Confidence</Text>
                <Text style={styles.value}>
                  {dealAnalysis.avm?.confidence != null
                    ? `${dealAnalysis.avm.confidence}%`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Comps Used</Text>
                <Text style={styles.value}>
                  {dealAnalysis.compsSanityCheck?.compsUsed ?? "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Median Comp $/Sqft</Text>
                <Text style={styles.value}>
                  {dealAnalysis.compsSanityCheck?.medianPricePerSqft != null
                    ? `$${dealAnalysis.compsSanityCheck.medianPricePerSqft}`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>AVM $/Sqft</Text>
                <Text style={styles.value}>
                  {dealAnalysis.compsSanityCheck?.avmPricePerSqft != null
                    ? `$${dealAnalysis.compsSanityCheck.avmPricePerSqft}`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.gridItemHalf}>
                <Text style={styles.label}>Delta</Text>
                <Text style={styles.value}>
                  {formatPercent(dealAnalysis.compsSanityCheck?.percentDelta)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Propomy • Confidential • Property Deep Dive Report (Page 3)</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PropertyDeepDiveReportPDFDocument;