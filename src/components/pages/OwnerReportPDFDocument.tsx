import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type {
  OwnerContactReportResponse,
  PersonRecord,
} from "../../types/Reports";

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

  // Alert Box Styles
  alertBox: {
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  alertCorporate: {
    backgroundColor: "#f0f9ff",
    borderLeftColor: "#0284c7",
  },
  alertWarning: {
    backgroundColor: "#fefce8",
    borderLeftColor: "#eab308",
  },
  alertDanger: {
    backgroundColor: "#fdf2f2",
    borderLeftColor: "#d9534f",
  },
  alertTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  alertBody: {
    fontSize: 8,
    color: "#334155",
  },

  // Card & Details Styles
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 6,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
  },
  badgePrimary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  badgeSecondary: {
    backgroundColor: "#cbd5e1",
    color: "#334155",
    fontSize: 7,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  gridTwoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailRow: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  label: {
    color: "#64748b",
    fontSize: 8,
    maxWidth: "50%",
  },
  value: {
    fontWeight: "bold",
    color: "#0f172a",
    fontSize: 8,
    textAlign: "right",
    maxWidth: "48%",
  },

  // Contact Lists
  subSectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
    marginTop: 8,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  listMainText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1e293b",
    maxWidth: "65%",
  },
  listSubText: {
    fontSize: 7,
    color: "#64748b",
    textAlign: "right",
    maxWidth: "32%",
  },
  complianceNote: {
    color: "#dc2626",
    fontSize: 7,
    marginTop: 2,
  },
  mutedText: {
    fontSize: 8,
    color: "#94a3b8",
    fontStyle: "italic",
    marginVertical: 4,
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

const PHONE_TYPE_LABEL: Record<string, string> = {
  mobile: "Mobile",
  landline: "Landline",
  voip: "VoIP",
  unknown: "Unknown",
};

interface OwnerReportPDFProps {
  address: string;
  reportResponse: OwnerContactReportResponse;
  generatedAt?: string;
}

const PersonContactsPDF: React.FC<{ person: PersonRecord }> = ({ person }) => (
  <View style={{ marginTop: 6 }}>
    {/* Phone Numbers */}
    <Text style={styles.subSectionTitle}>
      Phone Numbers ({person.phones.length})
    </Text>
    {person.phones.length > 0 ? (
      person.phones.map((phone) => (
        <View key={phone.number} style={{ marginBottom: 4 }}>
          <View style={styles.listItem}>
            <Text style={styles.listMainText}>{phone.number}</Text>
            <Text style={styles.listSubText}>
              {PHONE_TYPE_LABEL[phone.type ?? "unknown"] ?? "Unknown"} • Rank{" "}
              {phone.confidenceRank}
            </Text>
          </View>
          {(phone.dncFlag || phone.litigatorFlag) &&
            phone.complianceNotes?.map((note, idx) => (
              <Text key={idx} style={styles.complianceNote}>
                • {note}
              </Text>
            ))}
        </View>
      ))
    ) : (
      <Text style={styles.mutedText}>
        No phones directly linked to this record.
      </Text>
    )}

    {/* Email Addresses */}
    <Text style={styles.subSectionTitle}>
      Email Addresses ({person.emails.length})
    </Text>
    {person.emails.length > 0 ? (
      person.emails.map((email) => (
        <View key={email.email} style={styles.listItem}>
          <Text style={styles.listMainText}>{email.email}</Text>
          <Text style={styles.listSubText}>Rank {email.confidenceRank}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.mutedText}>
        No emails directly linked to this record.
      </Text>
    )}
  </View>
);

export const OwnerReportPDFDocument: React.FC<OwnerReportPDFProps> = ({
  address,
  reportResponse,
  generatedAt = new Date().toISOString(),
}) => {
  const reportData = reportResponse.reportData;
  if (!reportData) return null;

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
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Image src={LogoAsset} style={styles.logo} />
            <Text style={styles.brandName}>PROPOMY</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.docTitle}>OWNER & CONTACT REPORT</Text>
            <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 2 }}>
              {new Date(generatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Target Address</Text>
          <Text style={styles.address}>{address}</Text>
        </View>

        {/* Corporate / LLC Warning */}
        {ownerIdentity.isCorporateOrLLC && (
          <View style={[styles.alertBox, styles.alertCorporate]}>
            <Text style={[styles.alertTitle, { color: "#0369a1" }]}>
              Corporate or LLC Property
            </Text>
            <Text style={styles.alertBody}>
              {ownerIdentity.name} is registered as a business entity or LLC.
              Direct individual skip-trace records are limited for corporate
              owners.
            </Text>
          </View>
        )}

        {/* No Skip-Trace Data Alert */}
        {hasNoSkipTraceData && !ownerIdentity.isCorporateOrLLC && (
          <View style={[styles.alertBox, styles.alertWarning]}>
            <Text style={[styles.alertTitle, { color: "#854d0e" }]}>
              No Direct Contact Records Found
            </Text>
            <Text style={styles.alertBody}>
              No phone numbers or email addresses were returned in public telco
              records for this address.
            </Text>
          </View>
        )}

        {/* Compliance Warning */}
        {contacts.hasDncOrLitigatorWarning && (
          <View style={[styles.alertBox, styles.alertDanger]}>
            <Text style={[styles.alertTitle, { color: "#c0392b" }]}>
              Compliance Warning
            </Text>
            <Text style={styles.alertBody}>
              One or more numbers contain active National DNC registry status or
              TCPA Litigation flags.
            </Text>
          </View>
        )}

        {/* Primary Owner Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Property Owner Record</Text>
            {primaryPerson && (
              <Text style={styles.badgePrimary}>Primary Match</Text>
            )}
          </View>

          <View style={styles.gridTwoCol}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Owner of Record</Text>
              <Text style={styles.value}>{ownerIdentity.name || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Ownership Type</Text>
              <Text style={styles.value}>
                {ownerIdentity.isCorporateOrLLC
                  ? "Corporate / LLC"
                  : "Individual"}
              </Text>
            </View>
            {ownerIdentity.isCorporateOrLLC && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Unwound Individual</Text>
                <Text style={styles.value}>
                  {ownerIdentity.unwoundIndividualName || "Not found"}
                </Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Mailing Address</Text>
              <Text style={styles.value}>
                {ownerIdentity.mailingAddress || "N/A"}
              </Text>
            </View>
            {primaryPerson && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.value}>{primaryPerson.fullName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Age</Text>
                  <Text style={styles.value}>{primaryPerson.age || "N/A"}</Text>
                </View>
              </>
            )}
          </View>

          {primaryPerson ? (
            <PersonContactsPDF person={primaryPerson} />
          ) : (
            <Text style={styles.mutedText}>
              {ownerIdentity.isCorporateOrLLC
                ? "Individual skip-trace contact data is unavailable for corporate entities."
                : "No phone or email contacts were found for this owner."}
            </Text>
          )}
        </View>

        {/* Associated Persons Section */}
        {secondaryPersons.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Associated Persons ({secondaryPersons.length})
              </Text>
            </View>

            {secondaryPersons.map((person) => (
              <View
                key={person.personId}
                style={{
                  marginBottom: 8,
                  paddingBottom: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f1f5f9",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                      color: "#1e293b",
                    }}
                  >
                    {person.fullName}{" "}
                    <Text style={{ fontSize: 7, color: "#64748b" }}>
                      {person.age ? `(Age: ${person.age})` : ""}
                    </Text>
                  </Text>
                  <Text style={styles.badgeSecondary}>Associated Record</Text>
                </View>

                {person.previousAddress && (
                  <Text style={{ fontSize: 7, color: "#64748b", marginTop: 2 }}>
                    Prev. Address: {person.previousAddress}
                  </Text>
                )}

                <PersonContactsPDF person={person} />
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Propomy • Confidential • Auto-generated Owner Contact Report
          </Text>
        </View>
      </Page>
    </Document>
  );
};
