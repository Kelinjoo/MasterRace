// Global auth context for managing login state and user info
import { createContext, useContext, useState, useEffect } from 'react';

// Create the context object
const AuthContext = createContext();

// Provider component that wraps around your app
export function AuthProvider({ children }) {
  // Holds all authentication-related user info
  const [auth, setAuth] = useState({
    token: '',              
    userId: null,           
    username: '',           
    isAdmin: false,         
    bio: '',                
    profile_picture: ''    
  });

  // Flag to ensure we wait for auth to initialize
  const [isLoaded, setIsLoaded] = useState(false);

  // Runs once when the component mounts to check for a stored token
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode JWT payload to extract user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuth({
          token,
          userId: payload.userId,
          isAdmin: Boolean(payload.isAdmin),
          username: payload.username,
          bio: payload.bio || '',
          profile_picture: payload.profile_picture || ''
        });
      } catch (err) {
        console.error('Invalid token');
      }
    }

    // Mark auth as initialized
    setIsLoaded(true);
  }, []);

  // Call this on successful login to store data
  const login = (token, userId, isAdmin, username, bio = '', profile_picture = '') => {
    localStorage.setItem('token', token);
    setAuth({ token, userId, isAdmin, username, bio, profile_picture });
  };

  // Call this to log out user and clear state + localStorage
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: '', userId: null, isAdmin: false, username: '', bio: '', profile_picture: '' });
  };

  // Provide the context value to all child components
  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth in any component
export const useAuth = () => useContext(AuthContext);
