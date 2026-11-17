export const capitalize = (str: string = "") => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const tierClass = (tier: string | null | undefined) => {
  const key = (tier ?? "").toLowerCase();
  if (key.includes("high") || key.includes("excellent")) return "is-high";
  if (key.includes("med") || key.includes("good")) return "is-medium";
  if (key.includes("low")) return "is-low";
  return "is-neutral";
};

export const currency = (value: number | null | undefined) =>
  typeof value === "number"
    ? value.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "N/A";

export const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return new Intl.NumberFormat("en-US").format(val);
};

export const formatPercent = (val: number | null | undefined) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return `${val > 0 ? "+" : ""}${val}%`;
};

export const formatDate = (val: string | null | undefined) => {
  if (!val) return "N/A";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const daysAgo = (val: string | null | undefined) => {
  if (!val) return null;
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return null;
  const diffMs = Date.now() - d.getTime();
  return Math.max(0, Math.round(diffMs / 86_400_000));
};

export const normalizeAddress = (addr: string | null): string => {
  if (!addr) return "";
  try {
    return decodeURIComponent(addr.replace(/\+/g, " ")).trim().toLowerCase();
  } catch {
    return addr.trim().toLowerCase();
  }
};
