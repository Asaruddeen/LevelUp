// context/AuthContext.jsx - Verify loading state is working
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Important: starts as true
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set default axios config
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // add a sensible timeout so requests don't hang indefinitely
  axios.defaults.timeout = 10000; // 10 seconds
  
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // if we already have user data (e.g. just logged in) skip the extra fetch
        if (!user) {
          await fetchUser();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false); // No token, stop loading
      }
    };
    
    initializeAuth();
  }, [token, user]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // only log out for authentication errors; allow other failures to be retried
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        setLoading(false); // allow UI to render even if we couldn't reach server
      }
    } finally {
      setLoading(false); // Always stop loading after attempt
    }
  };

  const login = async (email, password) => {
    try {
      // use the shared api instance so interceptors/timeout apply
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(token);
        setUser(userData);
        
        toast.success('Welcome back!');
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/auth/register', { username, email, password });
      
      if (response.data.success) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(token);
        setUser(userData);
        
        toast.success('Registration successful!');
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};