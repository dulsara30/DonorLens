// Logout page - automatically logs user out and redirects to login

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../state/useAuth";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate("/login", { replace: true });
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
