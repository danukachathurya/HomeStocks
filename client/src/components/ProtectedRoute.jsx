import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure you're using latest jwt-decode

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, loading } = useSelector((state) => state.user);
  const token = localStorage.getItem('token');

  // 1. Wait if Redux still loading
  if (loading) return <div>Loading...</div>;

  // 2. Handle case: no user but token exists (maybe page refreshed)
  if (!currentUser && token) {
    try {
      const decoded = jwtDecode(token);

      // Token expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return <Navigate to="/sign-in" replace />;
      }

      // Role check
      const roleFromToken = decoded.role?.toLowerCase();
      const allowed = allowedRoles.map((r) => r.toLowerCase());

      if (allowed.length && !allowed.includes(roleFromToken)) {
        return <Navigate to="/unauthorized" replace />;
      }

      // Pass access
      return children;

    } catch (err) {
      console.error("Token error:", err);
      localStorage.removeItem('token');
      return <Navigate to="/sign-in" replace />;
    }
  }

  // 3. Handle case: user is present in Redux
  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  const userRole = currentUser.role?.toLowerCase();
  const allowed = allowedRoles.map((r) => r.toLowerCase());

  if (allowed.length && !allowed.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
