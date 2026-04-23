import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { adminInfo, studentInfo, logout, logoutStudent } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    const dark = savedTheme === 'dark';
    setIsDarkMode(dark);
    document.body.classList.toggle('dark-theme', dark);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleStudentLogout = () => {
    logoutStudent();
    navigate('/student/login');
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.body.classList.toggle('dark-theme', next);
    localStorage.setItem('themeMode', next ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Result Studio</Link>
      <ul className="navbar-nav">
        <li>
          <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Search Results
          </NavLink>
        </li>
        <li>
          <NavLink to={studentInfo ? '/student/dashboard' : '/student/login'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Student Portal
          </NavLink>
        </li>
        <li>
          <button onClick={toggleTheme} className="nav-link" aria-label="Toggle dark mode">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </li>
        {adminInfo ? (
          <>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="nav-link"
              >
                Admin Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/admin/login" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Admin
            </NavLink>
          </li>
        )}
        {studentInfo && (
          <li>
            <button onClick={handleStudentLogout} className="nav-link">
              Student Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
