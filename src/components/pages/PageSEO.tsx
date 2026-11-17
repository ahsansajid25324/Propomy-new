import React from "react";
import { useLocation, matchPath, Outlet } from "react-router-dom";
import { SEO } from "../common/SEO";
import { APP_ROUTES } from "../../config/routesConfig";
import { DEFAULT_SEO } from "../../config/seoConfig";

export const PageSEO: React.FC = () => {
  const { pathname } = useLocation();

  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  // 1. Direct route lookup
  let routeMeta = APP_ROUTES.find((r) => r.path === normalizedPath);

  // 2. Dynamic route pattern fallback (e.g. /investor/edit-property/:id)
  if (!routeMeta) {
    routeMeta = APP_ROUTES.find((r) =>
      matchPath({ path: r.path, end: true }, normalizedPath),
    );
  }

  // Inside PageSEO.tsx
  const isPrivateRoute =
    normalizedPath.startsWith("/investor") ||
    normalizedPath.startsWith("/admin") ||
    normalizedPath.startsWith("/realtor") ||
    normalizedPath === "/login" ||
    normalizedPath === "/signup" ||
    normalizedPath === "/forget-password";

  // Ensure public calculator routes do NOT get noindex
  const shouldNoIndex = Boolean(
    routeMeta?.noindex ||
    (isPrivateRoute && !normalizedPath.startsWith("/calculators")),
  );

  return (
    <>
      <SEO
        title={routeMeta?.title || DEFAULT_SEO.title}
        description={routeMeta?.description || DEFAULT_SEO.description}
        keywords={routeMeta?.keywords || DEFAULT_SEO.keywords}
        ogImage={routeMeta?.ogImage || DEFAULT_SEO.ogImage}
        noindex={shouldNoIndex}
        path={normalizedPath}
      />
      <Outlet />
    </>
  );
};
