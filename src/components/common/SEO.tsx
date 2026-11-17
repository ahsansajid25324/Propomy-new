import React from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_SEO } from "../../config/seoConfig";
import { sanitizeJsonLd } from "../../libs/schema";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  path?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = "https://www.propomy.com";

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  ogImage = DEFAULT_SEO.ogImage,
  path = "",
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} – Propomy` : DEFAULT_SEO.title;

  // Clean trailing slashes, hashes, and query params
  const cleanPath = path.split("?")[0].split("#")[0];
  const normalizedPath =
    cleanPath.length > 1 && cleanPath.endsWith("/")
      ? cleanPath.slice(0, -1)
      : cleanPath;

  const canonicalUrl = `${SITE_URL}${normalizedPath}`;

  const schemasToRender = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];


  return (
    <Helmet>
      {/* Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Clean Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Indexing Policy */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Propomy" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema Blocks */}
      {schemasToRender.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(schema) }}
        />
      ))}
    </Helmet>
  );
};