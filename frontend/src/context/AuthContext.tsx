import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.signin({ email, password });
      const authToken = response.jwt || response.token;
      
      if (authToken) {
        setToken(authToken);
        localStorage.setItem('token', authToken);
        
        if (response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        toast.success('Login successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const signup = async (email: string, name: string, password: string, role?: string): Promise<boolean> => {
    try {
      const response = await authAPI.signup({ email, name, password, role });
      const authToken = response.token;
      
      if (authToken && response.user) {
        setToken(authToken);
        setUser(response.user);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        toast.success('Account created successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};