import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 👇 Set base API URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing login from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const managerData = localStorage.getItem('manager');

    if (token && managerData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setManager(JSON.parse(managerData));
    }
    setLoading(false);
  }, []);

  // 🔹 Login (for Hiring Manager only)
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Only hiring managers allowed
      if (user.role !== 'hiring_manager') {
        return { success: false, error: 'Access denied: not a Hiring Manager' };
      }

      // Save credentials locally
      localStorage.setItem('token', token);
      localStorage.setItem('manager', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setManager(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('manager');
    delete axios.defaults.headers.common['Authorization'];
    setManager(null);
  };

  // 🔹 Update manager info
  const updateManager = (data) => {
    setManager(data);
    localStorage.setItem('manager', JSON.stringify(data));
  };

  const value = {
    manager,
    loading,
    login,
    logout,
    updateManager,
    isAuthenticated: !!manager,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
