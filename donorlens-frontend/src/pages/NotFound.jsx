import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/useAuth";
import { useEffect } from "react";
import getRedirectPath from "../lib/getRedirectPath";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Optional: Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        // Redirect based on role
        if (user.role === "ADMIN"){
          navigate("/admin/dashboard");
        } else if (user.role === "NGO_ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "USER") {
          navigate("/campaigns");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, navigate]);



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-bold text-red-600 m-0 leading-none">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-500 mb-2">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          You will be redirected automatically in 5 seconds...
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to={getRedirectPath(user?.role)} className="inline-block px-8 py-3 bg-blue-600 text-white no-underline rounded-lg font-medium transition hover:bg-blue-700 cursor-pointer">
            {user
              ? user.role === "NGO_ADMIN"
                ? "Go to Dashboard"
                : "View Campaigns"
              : "Go Home"}
          </Link>
          {!user && (
            <>
              <Link to="/login" className="inline-block px-8 py-3 bg-gray-200 text-gray-800 no-underline rounded-lg font-medium transition hover:bg-gray-300 cursor-pointer">
                Login
              </Link>
              <Link to="/register/user" className="inline-block px-8 py-3 bg-gray-200 text-gray-800 no-underline rounded-lg font-medium transition hover:bg-gray-300 cursor-pointer">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
