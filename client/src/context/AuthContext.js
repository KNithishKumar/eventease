import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('eventease_token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('eventease_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('eventease_token', data.token);
      setUser(data);
      toast.success(`Welcome back, ${data.name}! 👋`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Check credentials.';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('eventease_token', data.token);
      setUser(data);
      toast.success('Registration successful! Welcome to EventEase 🎉');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('eventease_token');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        isAuthenticated: !!user,
        role: user?.role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
