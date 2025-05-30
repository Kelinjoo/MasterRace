// Global auth context for managing login state and user info
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: '',
    userId: null,
    username: '',
    isAdmin: false,
    bio: '',
    profile_picture: ''
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
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
    setIsLoaded(true);
  }, []);

  // Store all user info on login
  const login = (token, userId, isAdmin, username, bio = '', profile_picture = '') => {
    localStorage.setItem('token', token);
    setAuth({ token, userId, isAdmin, username, bio, profile_picture });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: '', userId: null, isAdmin: false, username: '', bio: '', profile_picture: '' });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );


}


export const useAuth = () => useContext(AuthContext);
