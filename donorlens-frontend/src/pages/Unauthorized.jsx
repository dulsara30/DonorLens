// Unauthorized access page

import { Link } from "react-router-dom";
import getRedirectPath from "../lib/getRedirectPath";
import useAuth from "../state/useAuth";

const Unauthorized = () => {

  const {user } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-extrabold text-teal-500 m-0 leading-none">403</h1>
        <h2 className="text-3xl font-bold text-slate-800 my-4">Unauthorized Access</h2>
        <p className="text-lg text-slate-500 mb-8">
          You don't have permission to access this page.
        </p>
        <Link to={getRedirectPath(user?.role)} className="inline-block px-8 py-3.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full font-semibold no-underline transition-transform duration-200 ease-in-out hover:scale-105">
          {user.role === "ADMIN" ? "Go to Admin Dashboard" : 
          user.role === "NGO_ADMIN" ? "Go to NGO Dashboard": "Go Back Home" }
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
