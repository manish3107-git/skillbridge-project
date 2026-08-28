import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getCurrentUser();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          api.setToken(null);
        }
      } catch (err) {
        console.warn('[AuthContext] Session restore failed:', err.message);
        api.setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      if (data.success && data.token) {
        api.setToken(data.token);
        setUser(data.user);
        return data.user;
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.success && data.token) {
        api.setToken(data.token);
        setUser(data.user);
        return data.user;
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
