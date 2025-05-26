import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Platform
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Platform.select({
  web: 'http://localhost:8080',
  default: 'http://localhost:8080' 
});

type TabParamList = {
  home: undefined;
  login: undefined;
  register: undefined;
  welcome: undefined;
  profile: undefined;
  reset: undefined;
};

type NavigationProp = NativeStackNavigationProp<TabParamList>;

// Reset password flow steps
enum ResetStep {
  EMAIL_INPUT = 1,
  CODE_VERIFICATION = 2,
  NEW_PASSWORD = 3
}

const ResetPasswordScreen = () => {
  // Current step in the password reset flow
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL_INPUT);
  
  // Step 1: Email input
  const [email, setEmail] = useState('');
  
  // Step 2: Verification code
  const [verificationCode, setVerificationCode] = useState('');
  
  // Step 3: New password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigation = useNavigation<NavigationProp>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  
  // Animation for success message
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

  // STEP 1: Request verification code using email
  const handleRequestCode = async () => {
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setTimeout(() => setError(''), 3000);
      return;
    }

    console.log('Email validation passed:', email);
    
    setIsLoading(true);
    console.log('Sending request to:', `${API_BASE_URL}/api/auth/forgot-password`);
    console.log('Request payload:', { email });
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setIsLoading(false);
      console.log('Response received:', response.data);
      
      // Handle both response formats (success field or message field)
      if (response.data.success || response.status === 200) {
        setMessage(response.data.message || 'Verification code sent to your email. Please check your inbox.');
        setCurrentStep(ResetStep.CODE_VERIFICATION);
      } else {
        setError(response.data.message || 'Failed to send verification code');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || 'Failed to send verification code');
        } else if (error.request) {
          setError('Network error - please check your connection');
        } else {
          setError('An error occurred');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setTimeout(() => setError(''), 3000);
    }
  };
  
  // STEP 2: Verify the code sent to email
  const handleVerifyCode = async () => {
    setError('');
    setMessage('');
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 characters');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setIsLoading(true);
    console.log('Sending verification request to:', `${API_BASE_URL}/api/auth/verify-reset-code`);
    console.log('Verification payload:', { email, code: verificationCode });
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-reset-code`,
        { email, code: verificationCode },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setIsLoading(false);
      console.log('Verification response:', response.data);
      
      if (response.data.success || response.status === 200) {
        setMessage(response.data.message || 'Code verified successfully! You can now set a new password.');
        setCurrentStep(ResetStep.NEW_PASSWORD);
      } else {
        setError(response.data.message || 'Invalid verification code');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || 'Invalid verification code');
        } else if (error.request) {
          setError('Network error - please check your connection');
        } else {
          setError('An error occurred');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setTimeout(() => setError(''), 3000);
    }
  };
  
  // STEP 3: Set a new password
  const handleResetPassword = async () => {
    setError('');
    setMessage('');
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setIsLoading(true);
    console.log('Sending password reset request to:', `${API_BASE_URL}/api/auth/reset-password`);
    console.log('Reset password payload:', { 
      email, 
      code: verificationCode, 
      newPassword: '********', // Masked for security
      confirmPassword: '********' // Masked for security
    });
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email,
          code: verificationCode,
          newPassword,
          confirmPassword
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setIsLoading(false);
      console.log('Reset password response:', response.data);
      
      if (response.data.success || response.status === 200) {
        setIsSuccess(true);
        showSuccessAnimation();
        
        setTimeout(() => {
          navigation.navigate('login');
        }, 2000);
      } else {
        setError(response.data.message || 'Password reset failed');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || 'Password reset failed');
        } else if (error.request) {
          setError('Network error - please check your connection');
        } else {
          setError('An error occurred');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setTimeout(() => setError(''), 3000);
    }
  };
  
  // Resend verification code
  const handleResendCode = () => {
    handleRequestCode();
  };
  
  // Go back to previous step
  const goToPreviousStep = () => {
    if (currentStep === ResetStep.CODE_VERIFICATION) {
      setCurrentStep(ResetStep.EMAIL_INPUT);
    } else if (currentStep === ResetStep.NEW_PASSWORD) {
      setCurrentStep(ResetStep.CODE_VERIFICATION);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              <Text style={styles.successTitle}>Password Changed!</Text>
              <Text style={styles.successMessage}>
                Your password has been successfully updated.{'\n'}
                Redirecting to login...
              </Text>
            </Animated.View>
          ) : (
            <>
              {/* Header Section */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('login')}
                >
                  <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reset Password</Text>
              </View>
              
              <View style={styles.formSection}>
                {/* Step indicator */}
                <View style={styles.stepIndicatorContainer}>
                  <View style={[styles.stepIndicator, currentStep >= ResetStep.EMAIL_INPUT ? styles.activeStep : {}]}>
                    <Text style={styles.stepNumber}>1</Text>
                  </View>
                  <View style={styles.stepConnector}></View>
                  <View style={[styles.stepIndicator, currentStep >= ResetStep.CODE_VERIFICATION ? styles.activeStep : {}]}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <View style={styles.stepConnector}></View>
                  <View style={[styles.stepIndicator, currentStep >= ResetStep.NEW_PASSWORD ? styles.activeStep : {}]}>
                    <Text style={styles.stepNumber}>3</Text>
                  </View>
                </View>
                
                {/* Title based on current step */}
                <Text style={styles.sectionTitle}>
                  {currentStep === ResetStep.EMAIL_INPUT && "Forgot Password"}
                  {currentStep === ResetStep.CODE_VERIFICATION && "Verify Code"}
                  {currentStep === ResetStep.NEW_PASSWORD && "Set New Password"}
                </Text>
                
                <Text style={styles.sectionSubtitle}>
                  {currentStep === ResetStep.EMAIL_INPUT && "Enter your email to receive a verification code"}
                  {currentStep === ResetStep.CODE_VERIFICATION && "Enter the 6-digit code sent to your email"}
                  {currentStep === ResetStep.NEW_PASSWORD && "Create a new password for your account"}
                </Text>
                
                {/* Error and success messages */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {message ? <Text style={styles.messageText}>{message}</Text> : null}
                
                {/* Step 1: Email input */}
                {currentStep === ResetStep.EMAIL_INPUT && (
                  <>
                    <View style={styles.inputContainer}>
                      <Icon name="email-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                    
                    <TouchableOpacity
                      style={styles.resetButton}
                      onPress={handleRequestCode}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <>
                          <Icon name="email-send" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Send Verification Code</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
                
                {/* Step 2: Verification code */}
                {currentStep === ResetStep.CODE_VERIFICATION && (
                  <>
                    <View style={styles.inputContainer}>
                      <Icon name="form-textbox-password" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="6-digit Code"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                      />
                    </View>
                    
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={goToPreviousStep}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <Icon name="arrow-left" size={20} color="#4F46E5" style={styles.buttonIcon} />
                        <Text style={styles.secondaryButtonText}>Back</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleVerifyCode}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <>
                            <Icon name="check-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Verify Code</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.resendLink}
                      onPress={handleResendCode}
                      disabled={isLoading}
                    >
                      <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>
                  </>
                )}
                
                {/* Step 3: New password */}
                {currentStep === ResetStep.NEW_PASSWORD && (
                  <>
                    <View style={styles.inputContainer}>
                      <Icon name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Icon
                          name={showNewPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.inputContainer}>
                      <Icon name="lock-check-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Icon
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={goToPreviousStep}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <Icon name="arrow-left" size={20} color="#4F46E5" style={styles.buttonIcon} />
                        <Text style={styles.secondaryButtonText}>Back</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleResetPassword}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <>
                            <Icon name="lock-reset" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Reset Password</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Step indicator styles
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#4F46E5',
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepConnector: {
    width: 40,
    height: 1,
    backgroundColor: '#374151',
  },
  // Form section styles
  formSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  // Input styles
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
  // Button styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  resendLink: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    color: '#4F46E5',
    fontSize: 14,
  },
  // Message and error styles
  messageText: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    overflow: 'hidden',
  },
  errorText: {
    color: '#F87171',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    overflow: 'hidden',
  },
  // Success animation styles
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

export default ResetPasswordScreen;
