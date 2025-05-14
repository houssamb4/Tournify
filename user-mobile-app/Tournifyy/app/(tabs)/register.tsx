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
  Image
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TabParamList = {
    home: undefined;
    login: undefined;
    register: undefined;
    welcome: undefined;
  };
  
type NavigationProp = NativeStackNavigationProp<TabParamList>;

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleRegister = () => {
    // Reset error
    setError('');
    
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Registration Successful', 
        'Your account has been created successfully!',
        [
          { text: 'OK', onPress: () => navigation.navigate('home') }
        ]
      );
    }, 1500);
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

          {/* Registration Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Create Account</Text>
            
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
              <Icon name="email-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
            
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#6B7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Icon 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
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

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By registering, you agree to our 
                <Text style={styles.linkText}> Terms of Service</Text> and 
                <Text style={styles.linkText}> Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('login')}
            >
              <Text style={styles.loginLinkText}>Sign In</Text>
              <Icon name="arrow-right" size={16} color="#818CF8" />
            </TouchableOpacity>
          </View>
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
    justifyContent: 'flex-start', 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    backgroundColor: '#111827', 
    borderBottomWidth: 1, 
    borderBottomColor: '#374151', 
    marginBottom: 16, 
    shadowColor: '#000', 
    marginTop: 40, 
  },
  logo: {
    width: 40,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain', 
  },
  headerTitle: {
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold', 
    letterSpacing: 0.5, 
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
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
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
  linkText: {
    color: '#818CF8',
    fontWeight: '500',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
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
  loginText: {
    color: '#9CA3AF',
    marginBottom: 8,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loginLinkText: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;