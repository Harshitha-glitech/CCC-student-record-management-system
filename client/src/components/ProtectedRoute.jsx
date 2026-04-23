import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { adminInfo } = useAuth();
  return adminInfo ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
