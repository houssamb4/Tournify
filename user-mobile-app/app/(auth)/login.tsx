import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Animated
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const API_BASE_URL = Platform.select({
  web: 'http://localhost:8080',
  default: 'http://localhost:8080' // When testing on real devices, replace with your machine's IP address
});

type TabParamList = {
  home: undefined;
  login: undefined;
  register: undefined;
  welcome: undefined;
  Dashboard: undefined;
  forgot: undefined;
  reset: undefined;
};

type NavigationProp = NativeStackNavigationProp<TabParamList>;

const LoginScreen = () => {
  console.log('[Login] Rendering login screen');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const { login } = useAuth();

  const showSuccessAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    setIsSuccess(false);

    if (!username || !password) {
      setError('Please fill in both username and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with username:', username); // Debug log
      await login(username, password);
      
      // Only on successful login:
      console.log('Login successful'); // Debug log
      setIsLoading(false);
      setIsSuccess(true);
      showSuccessAnimation();
      
      // Only redirect after successful login and animation
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.status === 500 && error.message.includes('Bad credentials')) {
        setError('Invalid username or password. Please try again.');
      }
      else if (error.status === 404) {
        setError('Account not found. Please check your username.');
      }
      else if (error.status === 403) {
        setError('Your account is locked. Please contact support.');
      }
      else if (error.status === 401) {
        setError('Invalid credentials. Please try again.');
      }
      else if (error.message === 'Failed to get user information') {
        setError('Unable to retrieve your account information. Please try again.');
      }
      else if (error.message === 'Invalid response from server') {
        setError('Unable to connect to the server. Please try again later.');
      }
      else {
        setError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {isSuccess ? (
            <Animated.View 
              style={[
                styles.successContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Icon name="check-circle" size={80} color="#10B981" />
              <Text style={styles.successTitle}>Login Successful!</Text>
              <Text style={styles.successMessage}>
                Welcome back!{'\n'}
                Redirecting to home...
              </Text>
            </Animated.View>
          ) : (
            <>
              {/* Header Section */}
              <View style={styles.header}>
                <Image
                  source={require('@/assets/images/logo.jpg')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.headerTitle}>Tournify</Text>
              </View>

              {/* Social Login Section */}
              <View style={styles.socialSection}>
                <Text style={styles.sectionTitle}>Quick Access</Text>
                
                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.googleButton]}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: 'https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png' }}
                      style={{ width: 30, height: 30, marginRight: 10 }} 
                    />
                    <Text style={[styles.socialButtonText, { color: '#333' }]}>Continue with Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.socialButton, styles.discordButton]}
                    activeOpacity={0.8}
                  >
                    <FontAwesome6 name="discord" style={styles.socialIcon} size={24} color="#fff" />
                    <Text style={styles.socialButtonText}>Continue with Discord</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Login Form */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Login</Text>
                
                <View style={styles.inputContainer}>
                  <Icon name="account-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#6B7280"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Icon name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Icon 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>

                {error ? (
                  <View style={styles.errorContainer}>
                    <Icon name="alert-circle-outline" size={16} color="#F87171" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity 
                  style={styles.forgotPassword}
                  activeOpacity={0.7}
                  onPress={() => {
                    // Update to use router instead of navigation.navigate
                    router.push('/reset');
                  }}
                >
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Footer Section */}
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.createAccountButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    // Update to use router instead of navigation.navigate
                    router.push('/register');
                  }}
                >
                  <Text style={styles.createAccountText}>Create Account</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.skipButton}
                  onPress={() => router.replace('/(tabs)')}
                >
                  <Text style={styles.skipText}>Continue as Guest</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    backgroundColor: '#111827', 
    borderBottomWidth: 1, 
    borderBottomColor: '#374151', 
    marginBottom: 16, 
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: 40, 
  },
  logo: {
    width: 40, // Fixed width for the logo
    height: 30, // Fixed height for the logo
    marginRight: 10, // Adds space between the logo and the title
    resizeMode: 'contain', 
  },
  headerTitle: {
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold', 
    letterSpacing: 0.5, 
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#4F46E5',
    boxShadow: '0px 8px 12px rgba(99, 102, 241, 0.3)',
  },
  heroContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
  },

  tagline: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
  },
  socialSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  discordButton: {
    backgroundColor: '#5865F2',
  },
  socialButtonText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#E5E7EB',
  },
  socialIcon: {
    marginRight: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: 'white',
    fontSize: 15,
  },
  passwordToggle: {
    padding: 8,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    boxShadow: '0px 4px 8px rgba(99, 102, 241, 0.3)',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    marginBottom: 16,
  },
  createAccountButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  createAccountText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LoginScreen;