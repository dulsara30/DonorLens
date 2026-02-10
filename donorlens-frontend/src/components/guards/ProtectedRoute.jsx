// Route guard for protected routes - requires authentication

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../state/useAuth";

/**
 * ProtectedRoute Component
 * Ensures user is authenticated before accessing route
 * Can optionally check for specific roles
 * 
 * @param {Array<string>} roles - Optional array of allowed roles
 * @returns {JSX.Element} Protected route or redirect
 */
export default function ProtectedRoute({ roles = null }) {
  const { isAuthenticated, user, loading } = useAuth();
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
  // Save current location to redirect back after login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0) {
    if (!roles.includes(user.role)) {
      // User doesn't have required role - redirect to unauthorized
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated (and has required role if specified)
  return <Outlet />;
}
