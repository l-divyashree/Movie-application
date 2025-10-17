import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    // Check if user is already logged in on app start
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('Restored user session from localStorage');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Test backend connectivity
    fetch(`${API_BASE_URL}/health`)
      .then(response => {
        if (response.ok) {
          console.log('Backend is reachable');
        } else {
          console.warn('Backend responded with non-OK status:', response.status);
        }
      })
      .catch(error => {
        console.error('Backend connectivity test failed:', error);
      });
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Server error: ${response.status}`;
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login successful for user:', data.username);
      
      // Create user object from JWT response
      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles
      };
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(data.token);
      setUser(user);
      
      return { success: true, user: user };
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if it's a network error
      if (error.message === 'Failed to fetch') {
        return { 
          success: false, 
          error: 'Unable to connect to server. Please check your internet connection and try again.' 
        };
      }
      
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const url = `${API_BASE_URL}/auth/signup`;
      console.log('Attempting registration to:', url);
      console.log('Registration data:', userData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed with status:', response.status);
        console.error('Error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || 'Registration failed' };
        }
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN') || false;
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // API helper function with authentication
  const apiCall = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        logout();
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    apiCall,
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};