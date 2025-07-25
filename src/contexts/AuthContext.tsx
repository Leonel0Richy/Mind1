/**
 * Authentication Context for MasterMinds Frontend
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User, AuthResponse, isAuthenticated } from '../utils/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated and fetch user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Clear invalid token
          apiClient.setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      apiClient.setToken(null);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });
      
      if (response.success) {
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.setToken(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please log in to access this page.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
