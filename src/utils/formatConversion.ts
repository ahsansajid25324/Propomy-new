export const formatPriceShort = (value?: number) => {
  if (!value) return "$0";

  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions % 1 === 0 ? millions : millions.toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }

  return `$${value.toLocaleString()}`;
};

export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactCurrency = (
  value: number | null | undefined,
): string => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDate = (isoString: string | null): string => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};
