import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import { router } from 'expo-router';

const API_BASE_URL = Platform.select({
  web: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  android: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080', // Android emulator localhost
  ios: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  default: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'
});

// Ensure all API calls use the full URL
const getApiUrl = (endpoint: string) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  address?: string;
};

type ApiError = {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
};

interface RegisterResponse {
  success: boolean;
  message: string;
}

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: ApiError | null;
  clearError: () => void;
  // Authentication methods
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<RegisterResponse>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  serverLogout: () => Promise<void>;
  // Profile management
  updateProfile: (updates: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  }) => Promise<User>;
  // Password management
  forgotPassword: (email: string) => Promise<string>;
  verifyResetCode: (email: string, code: string) => Promise<{ verified: boolean; message: string }>;
  resetPassword: (data: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<string>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = () => setError(null);

  // Helper function to handle API errors
  const handleApiError = (error: any): never => {
    console.error('API Error:', error);
    
    let apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: 500
    };
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      // Handle specific error cases
      switch (status) {
        case 400:
          apiError = {
            message: error.response?.data?.message || 'Invalid request data',
            status,
            errors: error.response?.data?.errors
          };
          break;
        case 401:
          apiError = {
            message: 'Your session has expired. Please log in again.',
            status
          };
          // Clear auth state on unauthorized
          clearAuthState().then(() => {
            // Use setTimeout for navigation
            setTimeout(() => {
              router.replace('/(auth)/login');
            }, 0);
          });
          break;
        case 403:
          apiError = {
            message: error.response?.data?.message || 'You do not have permission to perform this action',
            status
          };
          break;
        case 404:
          apiError = {
            message: error.response?.data?.message || 'Resource not found',
            status
          };
          break;
        case 409:
          apiError = {
            message: error.response?.data?.message || 'A conflict occurred',
            status,
            errors: error.response?.data?.errors
          };
          break;
        case 422:
          apiError = {
            message: error.response?.data?.message || 'Validation failed',
            status,
            errors: error.response?.data?.errors
          };
          break;
        case 429:
          apiError = {
            message: 'Too many requests. Please try again later.',
            status
          };
          break;
        case 500:
        default:
          apiError = {
            message: error.response?.data?.message || 'An unexpected server error occurred',
            status: status || 500
          };
          break;
      }
    } else if (error instanceof Error) {
      apiError = {
        message: error.message,
        status: 500
      };
    }
    
    setError(apiError);
    throw apiError;
  };

  // Helper function to update auth state
  const updateAuthState = async (newToken: string | null, newUser: User | null) => {
    try {
      console.log('Updating auth state:', { hasToken: !!newToken, hasUser: !!newUser });
      
      if (newToken && newUser) {
        // Store token with expiry (24 hours from now)
        const tokenData = {
          token: newToken,
          expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        
        // Make sure to stringify the token data for storage
        await AsyncStorage.setItem('userToken', JSON.stringify(tokenData));
        await AsyncStorage.setItem('userInfo', JSON.stringify(newUser));
        
        // Update local state
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Make sure Authorization header is correctly set
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        console.log('Set Authorization header:', `Bearer ${newToken}`);
        
        // Set up token refresh interval (every 23 hours)
        const refreshInterval = setInterval(async () => {
          try {
            const response = await axios.post(getApiUrl('/api/auth/refresh-token'));
            if (response.data?.token) {
              await updateAuthState(response.data.token, newUser);
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            clearInterval(refreshInterval);
            await clearAuthState();
            router.replace('/(auth)/login');
          }
        }, 23 * 60 * 60 * 1000); // 23 hours
        
        // Clean up interval on unmount
        return () => clearInterval(refreshInterval);
      } else {
        await clearAuthState();
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      await clearAuthState();
    }
  };

  // Helper function to clear auth state
  const clearAuthState = async () => {
    try {
      console.log('Clearing auth state');
      await AsyncStorage.multiRemove(['userToken', 'userInfo']);
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  // Verify token validity and check expiry
  const verifyToken = async (tokenDataStr: string): Promise<boolean> => {
    try {
      console.log('Verifying token...');
      
      // Parse the token data to extract the actual token and check expiry
      const { token, expiry } = JSON.parse(tokenDataStr);
      
      // Check if token has expired
      if (expiry && Date.now() > expiry) {
        console.log('Token expired');
        await clearAuthState();
        return false;
      }
      
      // Use the actual token value for verification
      const response = await axios.get(getApiUrl('/api/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Token verification response:', response.data);
      
      if (response.data && response.data.id) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
        setUser(response.data);
        setToken(token); // Store the actual token value, not the JSON string
        setIsAuthenticated(true);
        return true;
      }
      
      console.error('Token verification failed: Invalid user data');
      await clearAuthState();
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      await clearAuthState();
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const loadStoredAuth = async () => {
      try {
        console.log('Loading stored auth...');
        setIsLoading(true);
        
        const storedTokenData = await AsyncStorage.getItem('userToken');
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        
        console.log('Stored auth found:', { hasToken: !!storedTokenData, hasUserInfo: !!storedUserInfo });
        
        if (!isMounted) return;

        if (storedTokenData && storedUserInfo) {
          try {
            const userInfo = JSON.parse(storedUserInfo);
            // Pass the entire token data string to verifyToken
            const isValid = await verifyToken(storedTokenData);
            
            if (!isMounted) return;

            if (isValid) {
              console.log('Token verified, setting auth state');
              // No need to set token here as verifyToken already does it with the correct token value
              setUser(userInfo);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error restoring auth state:', error);
            await clearAuthState();
          }
        } else {
          console.log('No stored auth found');
          await clearAuthState();
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        await clearAuthState();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStoredAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<RegisterResponse> => {
    try {
      clearError();
      
      const response = await axios.post(
        getApiUrl('/api/auth/signup'),
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Check for successful registration (201 status)
      if (response.status === 201 && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'User registered successfully'
        };
      }

      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.log('Full error object:', error); // Debug log
      
      if (axios.isAxiosError(error)) {
        // Get the error response data
        const errorResponse = error.response?.data;
        const errorStatus = error.response?.status;
        
        // Debug logs
        console.log('Error status:', errorStatus);
        console.log('Error response data:', errorResponse);
        console.log('Error response message:', errorResponse?.message);
        
        // For 400 status, directly pass the server's error message
        if (errorStatus === 400) {
          throw {
            message: errorResponse?.message,
            status: errorStatus
          };
        }
        
        // For username constraint violation - check the full error message
        if (errorStatus === 500 && errorResponse?.message) {
          const errorMessage = errorResponse.message.toLowerCase();
          if (errorMessage.includes('constraint') && errorMessage.includes('users.username')) {
            throw {
              message: 'Username is already taken!',
              status: errorStatus,
              field: 'username'
            };
          }
        }
        
        if (errorStatus === 401) {
          throw {
            message: errorResponse?.message || 'Registration failed - please check your information',
            status: errorStatus
          };
        }
        
        // For any other errors, throw with the server's message
        throw {
          message: errorResponse?.message || error.message,
          status: errorStatus
        };
      }
      throw error;
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      console.log('Attempting login for:', usernameOrEmail);
      clearError();

      const response = await axios.post(
        getApiUrl('/api/auth/login'),
        { usernameOrEmail, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Login response:', response.data); // Debug log

      // Check if response has token
      if (response.data && response.data.token) {
        // Get user info using the token
        const token = response.data.token;
        
        // Set the token in axios headers for the user info request
        axios.defaults.headers.common['Authorization'] = `${response.data.tokenType || 'Bearer'} ${token}`;
        
        // Get user info
        const userResponse = await axios.get(getApiUrl('/api/auth/me'));
        console.log('User info response:', userResponse.data);
        
        if (userResponse.data) {
          await updateAuthState(token, userResponse.data);
        } else {
          throw new Error('Failed to get user information');
        }
      } else {
        console.error('Login failed:', response.data);
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const errorStatus = error.response?.status;
        
        // Log the full error response for debugging
        console.log('Error response:', error.response?.data);
        console.log('Error status:', errorStatus);
        
        // Throw a structured error object that can be caught by the login component
        throw {
          message: errorMessage,
          status: errorStatus
        };
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Try to perform server-side logout first
      if (token) {
        try {
          await axios.post(getApiUrl('/api/auth/logout'), {}, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Server logout failed:', error);
          // Continue with client-side logout even if server logout fails
        }
      }
      
      // Clear local auth state first
      await clearAuthState();
      setIsLoading(false);
      
      // Use setTimeout to ensure navigation happens after the component cycle
      // This avoids the "Attempted to navigate before mounting" error
      setTimeout(() => {
        // Navigate to auth screen
        try {
          router.replace('/(auth)');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // If direct navigation fails, try setting a flag that can be used by the router
          setIsAuthenticated(false);
        }
      }, 50);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure we still clear local state even if there's an error
      await clearAuthState();
      setIsLoading(false);
      
      // Use setTimeout for navigation here too
      setTimeout(() => {
        try {
          router.replace('/(auth)');
        } catch (navError) {
          console.error('Navigation error:', navError);
          setIsAuthenticated(false);
        }
      }, 50);
    }
  };

  const serverLogout = async () => {
    try {
      if (token) {
        await axios.post(getApiUrl('/api/auth/logout'), {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Server logout error:', error);
    } finally {
      await clearAuthState();
      
      // Use setTimeout to ensure navigation happens after the component cycle
      setTimeout(() => {
        try {
          router.replace('/(auth)');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // If direct navigation fails, try setting a flag that can be used by the router
          setIsAuthenticated(false);
        }
      }, 50);
    }
  };

  const updateProfile = async (updates: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  }) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await axios.put(getApiUrl('/api/auth/update-profile'), updates);
      
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      // Validate email
      if (!email) {
        throw new Error('Email is required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      const response = await axios.post(getApiUrl('/api/auth/forgot-password'), { email });
      
      // Return success message if available
      return response.data?.message || 'Password reset instructions have been sent to your email';
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetCode = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      // Validate inputs
      if (!email || !code) {
        throw new Error('Email and verification code are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (code.length !== 6) {
        throw new Error('Verification code must be 6 digits');
      }
      
      const response = await axios.post(getApiUrl('/api/auth/verify-reset-code'), {
        email,
        code
      });
      
      return {
        verified: true,
        message: response.data?.message || 'Code verified successfully'
      };
    } catch (error) {
      handleApiError(error);
      return {
        verified: false,
        message: error instanceof Error ? error.message : 'Verification failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      clearError();
      
      // Validate inputs
      if (!data.email || !data.code || !data.newPassword || !data.confirmPassword) {
        throw new Error('All fields are required');
      }
      
      if (!data.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (data.code.length !== 6) {
        throw new Error('Verification code must be 6 digits');
      }
      
      if (data.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const response = await axios.post(getApiUrl('/api/auth/reset-password'), data);
      
      // If the API returns a new token after password reset, update the auth state
      if (response.data?.token && response.data?.user) {
        await updateAuthState(response.data.token, response.data.user);
        router.replace('/(tabs)');
      } else {
        // Otherwise, redirect to login
        router.replace('/(auth)/login');
      }
      
      return response.data?.message || 'Password has been reset successfully';
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        error,
        clearError,
        register,
        login,
        logout,
        updateProfile,
        serverLogout,
        forgotPassword,
        verifyResetCode,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;