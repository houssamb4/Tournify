import { createContext, useState, ReactNode, useEffect } from 'react'
import { authService, setAuthToken } from '../services/api'

interface User {
  id?: number
  email: string
  username?: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  authorities?: { authority: string }[]
}

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  error: string | null
  login: (usernameOrEmail: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profileData: any) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Load user from local storage on initial render
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setAuthToken(token)
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  // Function to decode JWT token
  const decodeJwtToken = (token: string) => {
    try {
      // Split the token into its parts
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Decode the payload (second part)
      const payload = tokenParts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.login(usernameOrEmail, password)
      
      if (response.token) {
        // Decode the JWT token to get user info
        const decodedToken = decodeJwtToken(response.token);
        console.log('Decoded token:', decodedToken);
        
        if (!decodedToken) {
          setError('Invalid token received from server.')
          throw new Error('Invalid token received from server.')
        }
        
        // Allow both ROLE_ADMIN and ROLE_USER to access the dashboard
        const hasValidRole = decodedToken.authorities?.some(
          (auth: { authority: string }) => 
            auth.authority === 'ROLE_ADMIN' || auth.authority === 'ROLE_USER'
        );
        
        if (!hasValidRole) {
          setError('Access denied. You do not have permission to access this dashboard.')
          throw new Error('Access denied. You do not have permission to access this dashboard.')
        }
        
        // Create user object from token data
        const userObj = {
          id: decodedToken.sub,
          username: decodedToken.username,
          email: decodedToken.email,
          authorities: decodedToken.authorities
        };
        
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('user', JSON.stringify(userObj))
        
        setAuthToken(response.token)
        setCurrentUser(userObj)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(userData)
      
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        setAuthToken(response.token)
        setCurrentUser(response.user)
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Always clear local storage and state, even if API call fails
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      setAuthToken('')
      setCurrentUser(null)
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        setCurrentUser(response.user)
      }
    } catch (err: any) {
      console.error('Profile update error:', err)
      setError(err.response?.data?.message || 'Profile update failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}