import React from "react";
import { useParams } from "react-router-dom";

// FEATURE FLAG: Keep set to false until MVP-296 & FRED/Zillow pipeline are ready.
const IS_GEO_PAGES_ENABLED = false;

// Fallback 404 Component (Adjust path/import to match your actual 404 component if you have one)
const NotFoundPage = () => (
  <div style={{ padding: "4rem", textAlign: "center" }}>
    <h1>404 - Page Not Found</h1>
    <p>The requested tool or city calculator is not available.</p>
  </div>
);

const GeoCalculatorPage: React.FC = () => {
  const { tool, city } = useParams<{ tool: string; city: string }>();

  // AC #3: Return 404 when requested in production while feature flag is disabled
  if (!IS_GEO_PAGES_ENABLED) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold capitalize">
        {tool?.replace("-", " ")} Calculator in {city?.replace("-", " ")}
      </h1>
      <p className="mt-4 text-gray-600">
        Local market data and calculator tools coming soon.
      </p>
    </div>
  );
};

export default GeoCalculatorPage;
