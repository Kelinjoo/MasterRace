// Global auth context for managing login state and user info
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: '',
    isAdmin: false,
    userId: null,
  });

  const [isLoaded, setIsLoaded] = useState(false); // Helps prevent layout jump

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuth({
          token,
          userId: payload.userId,
          isAdmin: payload.isAdmin,
        });
      } catch (err) {
        console.error('Invalid token');
      }
    }
    setIsLoaded(true);
  }, []);

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
    <AuthContext.Provider value={{ auth, login, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
