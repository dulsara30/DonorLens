import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import UserRoute from "../components/guards/UserRoute";
import AdminRoute from "../components/guards/AdminRoute";
import { ROLES } from "../lib/constants";

import LoginPage from "../features/auth/pages/LoginPage";
import LogoutPage from "../features/auth/pages/LogoutPage";
import Unauthorized from "../pages/Unauthorized";
import HomePage from "../pages/HomePage";
import RegisterUserPage from "../pages/RegisterUserPage";
import RegisterNgoPage from "../pages/RegisterNgoPage";

import CampaignListPage from "../features/campaigns/pages/CampaignListPage";
import CampaignDetailsPage from "../features/campaigns/pages/CampaignDetailsPage";
import DonatePage from "../features/payments/pages/DonatePage";

import AdminLayout from "../features/admin/layout/AdminLayout";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import AdminCreateCampaignPage from "../features/campaigns/pages/AdminCreateCampaignPage";
import AdminExpenseTrackerPage from "../features/tracking/pages/AdminExpenseTrackerPage";
import AdminFinalReportPage from "../features/impact/pages/AdminFinalReportPage";

import ProfilePage from "../features/profile/pages/ProfilePage";

export const router = createBrowserRouter([
  // AUTH ROUTES (Public)
  { path: "/login", element: <LoginPage /> },
  { path: "/logout", element: <LogoutPage /> },
  { path: "/register/user", element: <RegisterUserPage /> },
  { path: "/register/ngo", element: <RegisterNgoPage /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  // PUBLIC ROUTES
  { path: "/", element: <HomePage /> },
  { path: "/campaigns", element: <CampaignListPage /> },
  { path: "/campaigns/:id", element: <CampaignDetailsPage /> },
  { path: "/campaigns/:id/donate", element: <DonatePage /> },

  // USER ONLY ROUTES (Donors)
  {
    element: <UserRoute />,
    children: [
      { path: "/profile", element: <ProfilePage /> },
      // Add more USER-only routes here (donations history, etc.)
    ],
  },

  // ADMIN ONLY ROUTES (NGO_ADMIN)
  {
    element: <AdminRoute />,
    children: [
      { path: "/admin/dashboard", element: <AdminDashboardPage /> },
      { path: "/admin/campaigns/new", element: <AdminCreateCampaignPage /> },
      { path: "/admin/tracking/:id", element: <AdminExpenseTrackerPage /> },
      { path: "/admin/impact/:id", element: <AdminFinalReportPage /> },
      // Add more NGO_ADMIN-only routes here
    ],
  },
]);
