import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * AdminRoute — wraps routes that only admin users can access.
 * - Shows a spinner while session is loading
 * - Redirects to /login if not authenticated
 * - Redirects to / (home) with an error state if authenticated but not admin
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" state={{ adminDenied: true }} replace />;
  }

  return children;
};

export default AdminRoute;
