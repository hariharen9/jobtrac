import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AuthPage from "../features/auth/components/AuthPage";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import LicensePage from "../pages/LicensePage";
import OverviewPage from "../pages/OverviewPage";
import FAQPage from "../pages/FAQPage";
import CreatorPage from "../pages/CreatorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/auth",
        element: <AuthPage />,
    },
    {
        path: "/license",
        element: <LicensePage />,
    },
    {
        path: "/overview",
        element: <OverviewPage />,
    },
    {
        path: "/faq",
        element: <FAQPage />,
    },
    {
        path: "/creator",
        element: <CreatorPage />,
    },
    {
        path: "/app",
        element: <ProtectedRoute />,
        children: [
            {
                path: "",
                element: <ErrorBoundary><App /></ErrorBoundary>
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);