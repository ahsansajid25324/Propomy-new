import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "./store/store";
// import { getPosthog } from "./libs/posthog";

import { PageSEO } from "./components/pages/PageSEO";
// import ProtectedRoute from "./components/common/PortectedRoutes";
// import PublicRoute from "./components/common/PublicRoutes";

// Lazy load non-critical UI overlays
import { trackPageView } from "./libs/posthog";
// Layouts
const ApolloLayout = lazy(() => import("./components/common/ApolloLayout"));
// import DashboardLayout from "./layouts/DashboardLayout";
import AppLoader from "./components/common/AppLoader";
import TermsUse from "./pages/PayReports/TermsUse";
import Release from "./pages/PayReports/Release";
import FAQ from "./pages/PayReports/FAQ";
import PrivacyPolicy from "./pages/PayReports/PrivacyPolicy";
const MarketReport = lazy(() => import("./pages/PayReports/MarketReport"));
const MarketReportResult = lazy(
  () => import("./pages/PayReports/MarketReport/Result"),
);

const DealReport = lazy(() => import("./pages/PayReports/DealReport"));
const DealAnalysisResult = lazy(
  () => import("./pages/PayReports/DealReport/Result"),
);

const Home = lazy(() => import("./pages/Home"));
const Report = lazy(() => import("./pages/PayReports/index"));
const SampleReport = lazy(() => import("./pages/PayReports/SampleReport"));
// const Home = lazy(() => import("./pages/Home"));
// const GettingStarted = lazy(() => import("./pages/GettingStarted"));
// const FreeTrial = lazy(() => import("./pages/FreeTrial"));
// const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
// const Documentation = lazy(() => import("./pages/Documentation"));
// const FAQ = lazy(() => import("./pages/FAQ"));
// const Release = lazy(() => import("./pages/Release"));
const CalculatorsHubPage = lazy(() => import("./pages/CalculatorsHubPage"));
const PublicCalculatorPage = lazy(() => import("./pages/PublicCalculatorPage"));
const GeoCalculatorPage = lazy(() => import("./pages/GEOCalcualtorPage"));
const AppToast = lazy(() => import("./components/common/ToastApp"));
const OwnerReportResult = lazy(
  () => import("./pages/PayReports/OwnerReport/Result"),
);

const DeepDiveReport = lazy(() => import("./pages/PayReports/DeepDive/index"));
const ComparableReport = lazy(
  () => import("./pages/PayReports/ComparableReport"),
);

const ComparableReportResult = lazy(
  () => import("./pages/PayReports/ComparableReport/Result"),
);

const DebtReport = lazy(() => import("./pages/PayReports/DebtReport"));
const DebtReportResult = lazy(
  () => import("./pages/PayReports/DebtReport/Result"),
);

const DeepDiveReportResult = lazy(
  () => import("./pages/PayReports/DeepDive/Result"),
);
// Auth & Public Apps
// const LoginPage = lazy(() => import("./pages/Login"));
// const SignupPage = lazy(() => import("./pages/Signup"));
// const ForgetPassword = lazy(() => import("./pages/forget"));
// const Demo = lazy(() => import("./pages/Demo"));
// const Test = lazy(() => import("./pages/Test"));
// const AutoTest = lazy(() => import("./pages/AutoTest"));

// // Skip Trace
// const SkipTrace = lazy(() => import("./pages/SkipTrace/index"));
// const SingleEntry = lazy(() => import("./pages/SkipTrace/SingleEntry"));
// const BulkUpload = lazy(() => import("./pages/SkipTrace/BulkUpload"));
// const Results = lazy(() => import("./pages/SkipTrace/Results"));
// const BulkResults = lazy(() => import("./pages/SkipTrace/BulkResults"));

// Investor
// const Investor = lazy(() => import("./pages/Investor"));
// const AIValuation = lazy(() => import("./pages/Investor/AIValuation"));
// const DealFlow = lazy(() => import("./pages/DealFlow/index"));
// const MapView = lazy(() => import("./pages/Investor/MapView"));
// const Valuations = lazy(() => import("./pages/Investor/Valuations"));
// const Accounts = lazy(() => import("./pages/Investor/Accounts"));
// const Calculators = lazy(() => import("./pages/Investor/Calculators"));
// const AIAssistant = lazy(() =>
//   import("./pages/Investor/AIAssistant").then((m) => ({
//     default: m.AIAssistant,
//   })),
// );

// // Property
// const AddProperty = lazy(() => import("./pages/Property"));
// const ViewProperties = lazy(() => import("./pages/Property/ViewProperties"));
// const EditProperty = lazy(() => import("./pages/Property/EditProperty"));

// // Admin & Realtor
// const Realtor = lazy(() => import("./pages/Realtor/index"));
// const Admin = lazy(() => import("./pages/Admin"));
// const AdminReport = lazy(() => import("./pages/Admin/Report"));

const ValuationReport = lazy(
  () => import("./pages/PayReports/ValuationReport"),
);

const ValuationReportResult = lazy(() =>
  import("./pages/PayReports/ValuationReport/Result").then((m) => ({
    default: m.ValuationReportResult,
  })),
);
const OwnerReport = lazy(() => import("./pages/PayReports/OwnerReport"));
// const ActivationFunnel = lazy(() => import("./pages/Admin/ActivationFunnel"));

const App = () => {
  // const location = useLocation();
  // const user = useSelector((state: RootState) => state.auth.user);

  const location = useLocation();

  // Scroll to top automatically whenever the route path changes
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(location.pathname);
  }, [location.pathname]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getPosthog()
  //       .then((posthog) => {
  //         if (!posthog) return;

  //         if (user?.id) {
  //           posthog.identify(user.id, {
  //             email: user.email,
  //             role: user.role,
  //             name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  //           });
  //         }
  //         posthog.capture("$pageview", {
  //           page_name: location.pathname,
  //           path: location.pathname,
  //           url: window.location.href,
  //           role: user?.role || "guest",
  //         });
  //       })
  //       .catch((err) => {
  //         console.warn("PostHog initialization skipped:", err);
  //       });
  //   }, 150);

  //   window.scrollTo(0, 0);
  //   return () => clearTimeout(timer);
  // }, [location.pathname, user]);
  return (
    <>
      <Suspense fallback={null}>
        <AppToast />
      </Suspense>

      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route element={<PageSEO />}>
            {/* PUBLIC MARKETING ROUTES */}
            {/* <Route path="/" element={<Home />} />
            <Route path="/free-trial" element={<FreeTrial />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/release" element={<Release />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/get-started" element={<Home />} /> */}

            <Route path="/" element={<Home />} />
            <Route path="/calculators" element={<CalculatorsHubPage />} />
            <Route
              path="/calculators/:slug"
              element={<PublicCalculatorPage />}
            />
            <Route
              path="/calculators/:tool/:city"
              element={<GeoCalculatorPage />}
            />

            {/* APOLLO & PUBLIC APPLICATION ROUTES */}
            <Route element={<ApolloLayout />}>
              {/* <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              /> */}
              {/* <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/test" element={<Test />} />
              <Route path="/autotest" element={<AutoTest />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/skip-trace" element={<SkipTrace />} />
              <Route path="/skip-trace/single" element={<SingleEntry />} />
              <Route path="/skip-trace/bulk" element={<BulkUpload />} />
              <Route path="/skip-trace/results" element={<Results />} />
              <Route
                path="/skip-trace/bulk-results"
                element={<BulkResults />}
              /> */}

              <Route path="*" element={<Home />} />

              <Route path="/reports" element={<Report />} />
              <Route path="/sample-reports" element={<SampleReport />} />
              <Route path="/terms-of-use" element={<TermsUse />} />

              <Route path="/reports/valuation" element={<ValuationReport />} />
              <Route
                path="/reports/valuation/result"
                element={<ValuationReportResult />}
              />
              <Route path="/reports/owner" element={<OwnerReport />} />
              <Route
                path="/reports/owner/result"
                element={<OwnerReportResult />}
              />

              <Route path="/reports/comps" element={<ComparableReport />} />
              <Route
                path="/reports/comps/result"
                element={<ComparableReportResult />}
              />
              <Route path="/reports/deal-analysis" element={<DealReport />} />
              <Route
                path="/reports/deal-analysis/result"
                element={<DealAnalysisResult />}
              />
              <Route path="/reports/debt-position" element={<DebtReport />} />

              <Route
                path="/reports/debt-position/result"
                element={<DebtReportResult />}
              />

              <Route path="/reports/market" element={<MarketReport />} />
              <Route
                path="/reports/market/result"
                element={<MarketReportResult />}
              />

              <Route path="/reports/deep-dive" element={<DeepDiveReport />} />
              <Route
                path="/reports/deep-dive/result"
                element={<DeepDiveReportResult />}
              />

              <Route path="/release" element={<Release />} />
              <Route path="/Frequently-Asked-Questions" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* AUTHENTICATED DASHBOARDS */}
              {/* <Route
                path="/investor"
                element={
                  <ProtectedRoute allowedRole="investor">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Investor />} />
                <Route path="ai-valuation" element={<AIValuation />} />
                <Route path="valuations" element={<Valuations />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="calculators" element={<Calculators />} />
                <Route path="map-view" element={<MapView />} />
                <Route path="add-property" element={<AddProperty />} />
                <Route path="view-properties" element={<ViewProperties />} />
                <Route path="edit-property/:id" element={<EditProperty />} />
                <Route path="deal-flow" element={<DealFlow />} />
              </Route> */}

              {/* <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Admin />} />
                <Route path="report" element={<AdminReport />} />
                <Route
                  path="activation-funnel"
                  element={<ActivationFunnel />}
                />
              </Route> */}

              {/* <Route
                path="/realtor"
                element={
                  <ProtectedRoute allowedRole="realtor">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Realtor />} />
              </Route> */}
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
