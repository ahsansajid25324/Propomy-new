import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { APP_ROUTES } from "../config/routesConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://www.propomy.com";

// 1. Define interface for geo route objects
interface GeoRoute {
  path: string;
  lastmod?: string;
}

/**
 * AC #2: Stubbed function for querying MongoDB tool/city dynamic combinations.
 * Ready to connect to propomy-db when Rimsha's FRED/Zillow pipeline is active.
 */
async function fetchGeoCalculatorRoutes(): Promise<GeoRoute[]> {
  const IS_GEO_SITEMAP_ENABLED = false; // Feature flag

  if (!IS_GEO_SITEMAP_ENABLED) {
    return []; // TypeScript now knows this is GeoRoute[], not never[]
  }

  try {
    // TODO (Future Epic): Connect to propomy-db and fetch city market data combos
    // const db = await connectToDatabase();
    // const records = await db.collection('city_market_data').find({}).toArray();
    // return records.map(r => ({ path: `/calculators/${r.tool}/${r.city}`, lastmod: r.updatedAt }));
    return [];
  } catch (error) {
    console.error("❌ Failed to fetch geo calculator routes:", error);
    return [];
  }
}

async function buildSitemap() {
  console.log("🛠️  Generating XML Sitemap...");

  try {
    const defaultLastMod = new Date().toISOString().split("T")[0];

    // Standard static routes
    const publicRoutes = APP_ROUTES.filter(
      (route) => route.isPublic && !route.noindex,
    ).map((route) => ({
      url: `${DOMAIN}${route.path === "/" ? "" : route.path}`,
      lastmod: route.lastmod || defaultLastMod,
      changefreq: route.path === "/" ? "daily" : "weekly",
      priority: route.path === "/" ? "1.0" : "0.8",
    }));

    // AC #2: Fetch stubbed geo routes (returns [] today)
    const geoRoutes = await fetchGeoCalculatorRoutes();
    const formattedGeoRoutes = geoRoutes.map((route) => ({
      url: `${DOMAIN}${route.path}`,
      lastmod: route.lastmod || defaultLastMod,
      changefreq: "weekly",
      priority: "0.6",
    }));

    const allRoutes = [...publicRoutes, ...formattedGeoRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    const publicDir = path.resolve(__dirname, "../public");
    const distDir = path.resolve(__dirname, "../dist");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
    console.log(
      `✅ Wrote sitemap.xml to public/ (${allRoutes.length} total URLs)`,
    );

    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
      console.log("✅ Wrote sitemap.xml to dist/");
    }
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

buildSitemap();
