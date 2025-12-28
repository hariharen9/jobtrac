import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import { OfflineWarningProvider } from "../components/shared/OfflineWarning";
import LoadingSpinner from "../components/shared/LoadingSpinner";

// Lazy load pages
const App = React.lazy(() => import("../App"));
const AuthPage = React.lazy(() => import("../features/auth/components/AuthPage"));
const LicensePage = React.lazy(() => import("../pages/LicensePage"));
const OverviewPage = React.lazy(() => import("../pages/OverviewPage"));
const FAQPage = React.lazy(() => import("../pages/FAQPage"));
const CreatorPage = React.lazy(() => import("../pages/CreatorPage"));

// Helper to wrap lazy components with Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/auth",
        element: <SuspenseWrapper><AuthPage /></SuspenseWrapper>,
    },
    {
        path: "/license",
        element: <SuspenseWrapper><LicensePage /></SuspenseWrapper>,
    },
    {
        path: "/overview",
        element: <SuspenseWrapper><OverviewPage /></SuspenseWrapper>,
    },
    {
        path: "/faq",
        element: <SuspenseWrapper><FAQPage /></SuspenseWrapper>,
    },
    {
        path: "/creator",
        element: <SuspenseWrapper><CreatorPage /></SuspenseWrapper>,
    },
    {
        path: "/app",
        element: <ProtectedRoute />,
        children: [
            {
                path: "",
                element: (
                    <ErrorBoundary>
                        <OfflineWarningProvider>
                            <SuspenseWrapper>
                                <App />
                            </SuspenseWrapper>
                        </OfflineWarningProvider>
                    </ErrorBoundary>
                )
            },

        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);