import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentProtectedRoute = ({ children }) => {
  const { studentInfo } = useAuth();
  return studentInfo ? children : <Navigate to="/student/login" replace />;
};

export default StudentProtectedRoute;
