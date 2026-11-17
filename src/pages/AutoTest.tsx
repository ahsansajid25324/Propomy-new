import React, { useState } from "react";

const AUTOCOMPLETE_API = "https://api.realestateapi.com/v2/AutoComplete";
const PROPERTY_API = "https://api.realestateapi.com/v2/PropertySearch";
const PROPERTY_DETAIL_API = "https://api.realestateapi.com/v2/PropertyDetail";

const API_KEY = "PROPOMY-f2bd-78cb-807a-db49098a20e3";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

interface Suggestion {
  city?: string;
  state?: string;
  title: string;
  searchType: string;
  line1?: string;
  address?: string;
}

interface Property {
  id?: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  apn: string;
  absenteeOwner: boolean;
  adjustableRate: boolean;
  airConditioningAvailable?: boolean;
  assessedImprovementValue?: number;
  assessedLandValue?: number;
}

interface ApiResponse {
  data: Property[];
}

const CombinedSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (input: string) => {
    if (!input || input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    setError("");

    try {
      let searchTypes: string[] = [];
      if (/\d/.test(input)) searchTypes = ["A"];
      else searchTypes = ["C", "S"];

      const res = await fetch(CORS_PROXY + AUTOCOMPLETE_API, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          search: input,
          search_types: searchTypes,
        }),
      });

      if (!res.ok) throw new Error(`Autocomplete error ${res.status}`);
      const data = await res.json();
      setSuggestions(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Fetch properties list
  const fetchProperties = async (city?: string, state?: string) => {
    if (!city && !state) return;

    setLoadingProperties(true);
    setError("");

    try {
      const res = await fetch(CORS_PROXY + PROPERTY_API, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          ids_only: false,
          size: 50,
          city,
          state,
        }),
      });

      const data: ApiResponse = await res.json();
      setProperties(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Fetch full property detail (FULL JSON)
  const fetchPropertyDetail = async (propertyId: string) => {
    setLoadingDetail(true);
    setLoadingDetailId(propertyId);
    setError("");
    setSelectedDetail(null);

    try {
      const res = await fetch(CORS_PROXY + PROPERTY_DETAIL_API, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          id: propertyId,
        }),
      });

      if (!res.ok) throw new Error("Error loading details");

      const data = await res.json();
      setSelectedDetail(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingDetail(false);
      setLoadingDetailId(null);
    }
  };

  // Handle typing in input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  // Handle suggestion click
  const handleSelect = (s: Suggestion) => {
    if (s.address) setQuery(s.address);
    else if (s.city && s.state) setQuery(`${s.city}, ${s.state}`);
    else setQuery(s.title);

    setSuggestions([]);
    fetchProperties(s.city, s.state);
  };

  return (
    <div style={{ maxWidth: "650px", margin: "20px auto" }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search address, city, or state"
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />

      {loadingSuggestions && <div>Loading suggestions...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {suggestions.length > 0 && (
        <ul style={{ border: "1px solid #ccc", marginTop: 5, padding: 0 }}>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {s.address ||
                (s.city && s.state ? `${s.city}, ${s.state}` : s.title)}
            </li>
          ))}
        </ul>
      )}

      {/* PROPERTY LIST */}
      {loadingProperties && <div>Loading properties...</div>}

      {properties.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Properties:</h3>
          <ul style={{ padding: 0 }}>
            {properties.map((p: any, idx) => (
              <li
                key={idx}
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  listStyle: "none",
                  marginBottom: 10,
                  position: "relative",
                }}
              >
                <strong>{p.address.line1}</strong> <br />
                <strong>City:</strong> {p.address.city}, <strong>State:</strong>{" "}
                {p.address.state} <br />
                <strong>APN:</strong> {p.apn} <br />
                <strong>Assessed Improvement Value:</strong>{" "}
                {p.assessedImprovementValue} <br />
                <strong>Assessed Land Value:</strong> {p.assessedLandValue}{" "}
                <br />
                {p.id && (
                  <button
                    onClick={() => fetchPropertyDetail(p.id)}
                    style={{
                      marginTop: 8,
                      padding: "6px 12px",
                      cursor:
                        loadingDetail && loadingDetailId === p.id
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        loadingDetail && loadingDetailId === p.id ? 0.6 : 1,
                    }}
                    disabled={loadingDetail && loadingDetailId === p.id}
                  >
                    {loadingDetail && loadingDetailId === p.id
                      ? "Loading..."
                      : "View Details"}
                  </button>
                )}
                {/* Overlay for loading */}
                {loadingDetail && loadingDetailId === p.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "#333",
                    }}
                  >
                    Loading details...
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FULL JSON PROPERTY DETAILS */}
      {selectedDetail && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "2px solid black",
            background: "#f1f1f1",
          }}
        >
          <h3>Full Property JSON</h3>
          <pre style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(selectedDetail, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CombinedSearch;
