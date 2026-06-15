import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginRequest, AuthResponse, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    const token = localStorage.getItem('accessToken');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (error) {
        // If parsing fails, clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    
    setLoading(false);
  }, []);

  // Helper to handle auth response (login/register)
  const handleAuthResponse = (response: AuthResponse) => {
    const userData: User = {
      userId: response.userId,
      email: response.email,
      displayName: response.displayName,
      roles: response.roles,
    };
    
    // Store tokens and user data
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set user state
    setUser(userData);
  };

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    handleAuthResponse(response);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    handleAuthResponse(response);
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};