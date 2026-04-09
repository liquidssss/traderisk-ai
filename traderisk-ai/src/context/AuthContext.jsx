import React, { createContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('traderisk_token');
    const savedUser = localStorage.getItem('traderisk_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = useCallback(async (email, password, username) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('traderisk_token', data.token);
      localStorage.setItem('traderisk_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [API_BASE]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('traderisk_token', data.token);
      localStorage.setItem('traderisk_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [API_BASE]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('traderisk_token');
    localStorage.removeItem('traderisk_user');
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
