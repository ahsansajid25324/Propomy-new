import React, { useState } from "react";

const REAL_ESTATE_API = "https://api.realestateapi.com/v2/PropertySearch";
const API_KEY = "PROPOMY-f2bd-78cb-807a-db49098a20e3";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

interface Property {
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
}

interface ApiResponse {
  live: boolean;
  input: any;
  data: Property[];
  resultCount: number;
  resultIndex: number;
  recordCount: number;
  requestExecutionTimeMS: string;
  statusCode: number;
  statusMessage: string;
}

const TestAPI = () => {
  const [query, setQuery] = useState(""); // single input for user
  const [size, setSize] = useState(2);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API call
  const runSearch = async (city?: string, state?: string, street?: string) => {
    const body: any = {
      ids_only: false,
      obfuscate: false,
      summary: false,
      size,
    };
    if (city) body.city = city;
    if (state) body.state = state;
    if (street) body.street = street;

    const response = await fetch(CORS_PROXY + REAL_ESTATE_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text}`);
    }

    return await response.json();
  };

  // Handle form submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    const parts = query.split(",").map((p) => p.trim());

    let street: string | undefined;
    let city: string | undefined;
    let state: string | undefined;

    if (parts.length === 3) {
      // "Street, City, State"
      street = parts[0] || undefined;
      city = parts[1] || undefined;
      state = parts[2] ? parts[2].toUpperCase() : undefined;
    } else if (parts.length === 2) {
      // "City, State"
      city = parts[0] || undefined;
      state = parts[1] ? parts[1].toUpperCase() : undefined;
    } else if (parts.length === 1) {
      if (parts[0].length === 2) {
        state = parts[0].toUpperCase();
      } else {
        street = parts[0];
      }
    }

    if (!street && !city && !state) {
      setError("Please enter at least street, city, or state.");
      setLoading(false);
      return;
    }

    try {
      const data = await runSearch(city, state, street);
      setResults(data || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="d-flex justify-content-center pt-3" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Street, City, State"
          style={{ marginRight: "10px", width: "350px" }}
        />
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          min={1}
          placeholder="No of records"
          style={{ width: "120px", marginRight: "10px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {results && (
        <div style={{ marginTop: "20px" }}>
          <div>
            <strong>Live:</strong> {results.live ? "Yes" : "No"} <br />
            <strong>Search Input:</strong>{" "}
            {(results.input.street || "") +
              " " +
              (results.input.city || "") +
              " " +
              (results.input.state || "")}{" "}
            <br />
            <strong>Total Results:</strong> {results.resultCount} <br />
            <strong>Status:</strong> {results.statusMessage} <br />
            <strong>Execution Time:</strong> {results.requestExecutionTimeMS} <br />
            <strong>Records Returned:</strong> {results.recordCount}
          </div>

          <h3>Properties:</h3>
          {results.data.length > 0 ? (
            <ul>
              {results.data.map((item, idx) => (
                <li key={idx}>
                  <strong>Address:</strong> {item.address.line1}, {item.address.city},{" "}
                  {item.address.state} {item.address.postalCode} <br />
                  <strong>APN:</strong> {item.apn} <br />
                  <strong>Absentee Owner:</strong> {item.absenteeOwner ? "Yes" : "No"} <br />
                  <strong>Adjustable Rate:</strong> {item.adjustableRate ? "Yes" : "No"} <br />
                  <strong>Air Conditioning Available:</strong>{" "}
                  {item.airConditioningAvailable ?? "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <div>No properties found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestAPI;
