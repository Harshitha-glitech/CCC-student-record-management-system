import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import StudentProtectedRoute from './components/StudentProtectedRoute';
import Home from './pages/Home';
import StudentSearch from './pages/StudentSearch';
import AdminLogin from './pages/AdminLogin';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import Dashboard from './pages/admin/Dashboard';
import AddResult from './pages/admin/AddResult';
import ManageResults from './pages/admin/ManageResults';
import ManageStudents from './pages/admin/ManageStudents';
import ManageSubjects from './pages/admin/ManageSubjects';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

const App = () => (
  <AuthProvider>
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<StudentSearch />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentProtectedRoute><StudentDashboard /></StudentProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/add-result" element={<ProtectedRoute><AddResult /></ProtectedRoute>} />
        <Route path="/admin/results" element={<ProtectedRoute><ManageResults /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute><ManageSubjects /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  </AuthProvider>
);

export default App;
