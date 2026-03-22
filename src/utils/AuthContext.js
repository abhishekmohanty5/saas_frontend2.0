import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

/**
 * Decode JWT payload and check if token is expired.
 * Works without any external library — just base64 decoding the middle segment.
 */
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // If we can't decode it, treat as expired
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      if (isTokenExpired(token)) {
        // Token is expired — clear silently, force fresh login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.warn('Session expired. Please log in again.');
      } else {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response.data);

      const { data, message } = response.data;

      if (!data || !data.token) {
        return { success: false, error: message || 'Invalid response from server' };
      }

      const { token, email: userEmail, role, name } = data;

      localStorage.setItem('token', token);

      const userData = {
        email: userEmail,
        name: name || userEmail.split('@')[0],
        role: role.startsWith('ROLE_') ? role : `ROLE_${role}`
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('User logged in with role:', role);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 404) {
        errorMessage = 'Email not registered. Please sign up first.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.log('Registration response:', response.data);

      const { message } = response.data;
      return {
        success: true,
        message: message || 'Registration successful! Please login.'
      };
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed';
      if (error.response?.status === 409 ||
        (error.response?.status === 500 && error.message.includes('Duplicate'))) {
        errorMessage = 'Email already registered. Please login instead.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid input. Please check your password requirements.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes('Duplicate')) {
        errorMessage = 'Email already registered. Please login instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Explicitly remove from localStorage first, then clear React state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authAPI.logout();
    setUser(null); // triggers immediate Navbar re-render
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};