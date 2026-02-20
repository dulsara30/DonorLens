import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../state/useAuth";


export default function AdminRoute() {

    const {isAuthenticated, user, role, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return(
                  <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
        );
    }

    if(!isAuthenticated || !user){
        return <Navigate to="/login" state={{ from: location}} replace />
    }

    if(role !== "ADMIN"){
        if(role === "NGO_ADMIN"){
            return <Navigate to="/admin/dashboard" replace />
        }else if(role === "USER"){
            return <Navigate to="/" replace />
        }

        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />;

};
