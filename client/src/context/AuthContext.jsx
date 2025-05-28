// Global auth context for managing login state and user info
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || '',   // Retrieve token from localStorage if present
    isAdmin: false,
    userId: null,
  });

  // Store token and user info on login
  const login = (token, userId, isAdmin) => {
    localStorage.setItem('token', token);
    setAuth({ token, userId, isAdmin });
  };

  // Clear token and reset state on logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: '', userId: null, isAdmin: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
