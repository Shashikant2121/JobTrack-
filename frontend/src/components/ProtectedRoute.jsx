import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading, token } = useAuth();

  // ========================================
  // CHECK AUTH LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // NOT AUTHENTICATED
  // ========================================

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ========================================
  // AUTHENTICATED
  // ========================================

  return <Outlet />;
};

export default ProtectedRoute;
