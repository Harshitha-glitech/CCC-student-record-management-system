import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(
    JSON.parse(localStorage.getItem('adminInfo') || 'null')
  );
  const [studentInfo, setStudentInfo] = useState(
    JSON.parse(localStorage.getItem('studentInfo') || 'null')
  );

  const login = (data) => {
    localStorage.setItem('adminInfo', JSON.stringify(data));
    setAdminInfo(data);
  };

  const loginStudent = (data) => {
    localStorage.setItem('studentInfo', JSON.stringify(data));
    setStudentInfo(data);
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
    setAdminInfo(null);
  };

  const logoutStudent = () => {
    localStorage.removeItem('studentInfo');
    setStudentInfo(null);
  };

  return (
    <AuthContext.Provider value={{
      adminInfo,
      studentInfo,
      login,
      loginStudent,
      logout,
      logoutStudent,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
