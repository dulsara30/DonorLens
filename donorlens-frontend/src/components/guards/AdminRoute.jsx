// Route guard for NGO_ADMIN role only

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../state/useAuth";

/**
 * AdminRoute Component
 * Ensures user is authenticated AND has NGO_ADMIN role
 * Redirects to appropriate page based on role or auth status
 * 
 * @returns {JSX.Element} Protected route or redirect
 */
export default function AdminRoute() {
  const { isAuthenticated, user, role, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has NGO_ADMIN role
  if (role !== "NGO_ADMIN") {
    // User is authenticated but not an NGO admin
    // Redirect to their appropriate page
    if (role === "USER") {
      return <Navigate to="/" replace />; // Users don't have a separate dashboard
    }
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has NGO_ADMIN role
  return <Outlet />;
}
