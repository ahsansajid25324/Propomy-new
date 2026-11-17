export interface Pin {
  id: string | number;
  latitude: number;
  longitude: number;
}

export interface PropertyDetail {
  id: string | number;
  estimatedValue: number;
  bathrooms?: number;
  bedrooms?: number;
  buildingSquareFeet?: number;
  lotInfo?: number;
  addressLabel?: string;
  equity?: number;
  latitude: number;
  longitude: number;
  avm?: number;
  avmMin?: number;
  avmMax?: number;
  roundedAverageCompValue?: number;
  equityPercentage?: number;
}

export interface MapPinsQueryResponse {
  getMapPins: {
    resultIndex: number;
    resultCount: number;
    exactMatchDetail: {
      id: string;
      estimatedValue: number;
    } | null;
    data: Pin[];
    isCached: boolean;
  };
}

export interface MapPinsQueryVariables {
  address: string;
  resultIndex?: number;
  radius?: number;
  propertyTypes?: string[];
  beds?: number[];
  absenteeOwner?: boolean;
  cashBuyer?: boolean;
  corporateOwned?: boolean;
  highEquity?: boolean;
}

export interface Mortgage {
  amount?: number;
}

export interface TaxInfo {
  assessedImprovementValue?: number;
  assessedLandValue?: number;
  assessedValue?: number;
  assessmentYear?: number;
  estimatedValue?: number;
  marketImprovementValue?: number;
  marketLandValue?: number;
  marketValue?: number;
  propertyId?: string;
  taxAmount?: string;
  year?: number;
}

export interface PropertyDetails {
  id: string;
  estimatedValue?: number;
  bathrooms?: number;
  bedrooms?: number;
  yearBuilt?: number;
  heatingType?: string;
  basementType?: string;
  buildingSquareFeet?: number;
  livingSquareFeet?: number;
  lotInfo?: number;
  lotWidthFeet?: number;
  lotNumber?: string;
  apn?: string;
  isCached?: boolean;
  propertyClass?: string;
  propertyUse?: string;
  zoning?: string;
  landUse?: string;
  addressLabel?: string;
  owner?: string;
  ownerSecond?: string;
  porchType?: string;
  stories?: number;
  currentMortgageAmountSum?: number;
  zipCode?: string;
  equity?: number;
  equityPercentage?: number;
  roundedAverageCompValue?: number;
  taxInfo?: TaxInfo | null;
  avm?: number;
  avmMin?: number;
  avmMax?: number;
  currentMortgages?: Mortgage[];
}

export interface PropertyDetailQueryResponse {
  propertyDetail: PropertyDetails | null;
}

export interface PropertyDetailQueryVariables {
  id?: string;
  address?: string;
}


export const propertyTypeOptions = [
  { value: "SFR", label: "House (SFR)" },
  { value: "MFR", label: "Multi-Family" },
  { value: "CONDO", label: "Condo" },
  { value: "LAND", label: "Land" },
  { value: "MOBILE", label: "Mobile Home" },
];

export const bedOptions = [
  { value: 1, label: "1 Bed" },
  { value: 2, label: "2 Beds" },
  { value: 3, label: "3 Beds" },
  { value: 4, label: "4+ Beds" },
];