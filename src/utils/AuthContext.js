import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Admin email - YOU are the admin!
const ADMIN_EMAIL = 'abhishekmohanty78962@gmail.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      console.log('Login response:', response.data);

      // Backend returns: { message, data: { email, token }, status, timestamp }
      const { data, message } = response.data;

      // Validate response
      if (!data || !data.token) {
        return {
          success: false,
          error: message || 'Invalid response from server'
        };
      }

      const { token, email: userEmail } = data;

      // Store token
      localStorage.setItem('token', token);

      // Check if user is admin (your email)
      const role = userEmail === ADMIN_EMAIL ? 'ADMIN' : 'USER';

      // Create user object
      const userData = {
        email: userEmail,
        role: role
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('User logged in as:', role);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);

      // Extract error message from backend
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

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      console.log('Registration response:', response.data);

      // Backend returns: { message, data: { username, email }, status, timestamp }
      const { message } = response.data;

      // Registration successful - DO NOT AUTO-LOGIN
      // Return success so AuthPage can redirect to login
      return {
        success: true,
        message: message || 'Registration successful! Please login.'
      };
    } catch (error) {
      console.error('Registration error:', error);

      // Extract error message from backend
      let errorMessage = 'Registration failed';

      if (error.response?.status === 409 ||
        (error.response?.status === 500 && error.message.includes('Duplicate'))) {
        errorMessage = 'Email already registered. Please login instead.';
      } else if (error.response?.status === 400) {
        // Password validation or other validation errors
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

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
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