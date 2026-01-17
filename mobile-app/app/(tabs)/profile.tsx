"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  ScrollView,
  TextInput,
  ImageBackground,
  Dimensions,
  Image,
  KeyboardAvoidingView,
} from "react-native"
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import { BlurView } from "expo-blur"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "expo-router"

const API_BASE_URL = Platform.select({
  web: "http://localhost:8080",
  default: "http://localhost:8080",
})

type TabParamList = {
  home: undefined
  login: undefined
  register: undefined
  welcome: undefined
  profile: undefined
  reset: undefined
}

type NavigationProp = NativeStackNavigationProp<TabParamList>

interface UserData {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  phone: string
  address: string
  password?: string
}

interface EditProfileModalProps {
  visible: boolean
  onClose: () => void
  userData: UserData
  onSave: (updatedData: UserData) => void
  refreshData: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, userData, onSave, refreshData }) => {
  const [formData, setFormData] = useState<UserData>({
    id: userData.id,
    email: userData.email || "",
    username: userData.username || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    phone: userData.phone || "",
    address: userData.address || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current

  // Start animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }).start()
    } else {
      // Reset animation value when modal is hidden
      slideAnim.setValue(Dimensions.get('window').height)
    }
  }, [visible])

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      id: userData.id,
      email: userData.email || "",
      username: userData.username || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phone: userData.phone || "",
      address: userData.address || "",
    })
  }, [userData])

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose())
  }

  const handleSave = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setIsLoading(true)
    try {
      await onSave(formData)
      handleCloseModal()
      // Refresh the page data
      refreshData()
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="none" transparent={true} onRequestClose={handleCloseModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />
        <BlurView intensity={50} tint="dark" style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <LinearGradient
              colors={['#2A3744', '#1F2937']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLine} />
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity 
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContentContainer}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialIcons name="person" size={18} color="#818CF8" />
                    <Text style={styles.inputLabel}>First Name</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.firstName}
                      onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                      placeholder="Enter first name"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialIcons name="person" size={18} color="#818CF8" />
                    <Text style={styles.inputLabel}>Last Name</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.lastName}
                      onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                      placeholder="Enter last name"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="at" size={18} color="#818CF8" />
                    <Text style={styles.inputLabel}>Username</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.username}
                      onChangeText={(text) => setFormData({ ...formData, username: text })}
                      placeholder="Enter username"
                      placeholderTextColor="#6B7280"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="email-outline" size={18} color="#818CF8" />
                    <Text style={styles.inputLabel}>Email</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      placeholder="Enter email"
                      placeholderTextColor="#6B7280"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="phone-outline" size={18} color="#818CF8" />
                    <Text style={styles.inputLabel}>Phone</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.phone}
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      placeholder="Enter phone number"
                      placeholderTextColor="#6B7280"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="map-marker-outline" size={18} color="#818CF8" />
                    <Text style={styles.inputLabel}>Address</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.multilineInput]}
                      value={formData.address}
                      onChangeText={(text) => setFormData({ ...formData, address: text })}
                      placeholder="Enter address"
                      placeholderTextColor="#6B7280"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={handleCloseModal} 
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={handleSave} 
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  {isLoading ? (
                    <View style={styles.loadingButtonContent}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={[styles.buttonText, styles.loadingButtonText]}>Saving...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <MaterialIcons name="save" size={18} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Save Changes</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const router = useRouter();
  const { token, logout } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();

  // Start fade in animation when component mounts
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false // Set to false for web compatibility
    }).start();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching user profile with token:', token ? 'Token exists' : 'No token');

      const response = await axios.get(
        `${API_BASE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Profile API Response:', response.data);

      if (response.data) {
        setUserData(response.data);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.replace('/(auth)/login');
        }
        setError(error.response?.data?.message || 'Failed to load user data');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData: UserData) => {
    try {
      setIsLoading(true);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Updating profile with data:', { ...updatedData, password: undefined });

      const response = await axios.put(
        `${API_BASE_URL}/api/auth/update-profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update profile response:', response.data);

      if (response.data) {
        setUserData(response.data);
        setError(null);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.replace('/(auth)/login');
        }
        setError(error.response?.data?.message || 'Failed to update profile');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Logging out...');

      // Just call the logout function from AuthContext
      // The AuthContext's logout function already handles navigation and server logout
      await logout();
      
      // No need to navigate here - AuthContext will handle it
      // This prevents the double navigation error
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, let AuthContext handle it
      await logout();
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!userData?.email) {
        throw new Error('No email found for password reset');
      }

      // Navigate to reset password screen with email pre-filled
      // Use replace instead of push to prevent back navigation
      router.push({
        pathname: '/(auth)/reset',
        params: { email: userData.email }
      });
    } catch (error) {
      console.error('Error navigating to reset password:', error);
      setError('Failed to navigate to reset password');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ImageBackground 
          source={require('../../assets/images/dark-gradient-bg.png')} 
          style={styles.bgImage} 
          resizeMode="cover"
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#818CF8" />
            <Text style={styles.loadingText}>Loading your profile...</Text>
            <View style={styles.loadingBar}>
              <Animated.View style={[styles.loadingBarProgress, { width: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) }]} />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ImageBackground 
          source={require('../../assets/images/dark-gradient-bg.png')} 
          style={styles.bgImage} 
          resizeMode="cover"
        >
          <View style={styles.container}>
            <Animated.View 
              style={[
                styles.notLoggedInContainer,
                { 
                  opacity: fadeAnim,
                }
              ]}
            >
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons name="account-circle-outline" size={100} color="#818CF8" />
              </View>
              <Text style={styles.title}>Not Logged In</Text>
              <Text style={styles.subtitle}>Please login to access your profile</Text>
              
              <TouchableOpacity 
                style={styles.loginButton} 
                activeOpacity={0.7} 
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                  navigation.navigate("login")
                }}
              >
                <LinearGradient
                  colors={["#4F46E5", "#818CF8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground 
        source={require('../../assets/images/dark-gradient-bg.png')} 
        style={styles.bgImage} 
        resizeMode="cover"
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.profileContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {/* Profile Header */}
            <View style={styles.profileHeaderContainer}>
              <LinearGradient
                colors={["#4F46E5", "#818CF8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileHeaderGradient}
              >
                <View style={styles.profileAvatarContainer}>
                  <View style={styles.avatarBorder}>
                    <View style={styles.avatarInner}>
                      <MaterialCommunityIcons name="account-circle" size={90} color="white" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
              
              {/* User Info Card */}
              <View style={styles.userInfoCard}>
                <View style={styles.userInfoHeader}>
                  <Text style={styles.username}>{userData.username}</Text>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>User</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                {/* User Details */}
                <View style={styles.userDetailsList}>
                  <View style={styles.userDetailItem}>
                    <Ionicons name="person" size={18} color="#818CF8" style={styles.detailIcon} />
                    <View>
                      <Text style={styles.detailLabel}>Full Name</Text>
                      <Text style={styles.detailValue}>{`${userData.firstName} ${userData.lastName}`}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.userDetailItem}>
                    <Ionicons name="mail" size={18} color="#818CF8" style={styles.detailIcon} />
                    <View>
                      <Text style={styles.detailLabel}>Email</Text>
                      <Text style={styles.detailValue}>{userData.email}</Text>
                    </View>
                  </View>
                  
                  {userData.phone && (
                    <View style={styles.userDetailItem}>
                      <Ionicons name="call" size={18} color="#818CF8" style={styles.detailIcon} />
                      <View>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>{userData.phone}</Text>
                      </View>
                    </View>
                  )}
                  
                  {userData.address && (
                    <View style={styles.userDetailItem}>
                      <Ionicons name="location" size={18} color="#818CF8" style={styles.detailIcon} />
                      <View>
                        <Text style={styles.detailLabel}>Address</Text>
                        <Text style={styles.detailValue}>{userData.address}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <Text style={styles.sectionTitle}>Account Actions</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }
                    setIsEditModalVisible(true)
                  }}
                >
                  <LinearGradient
                    colors={["#4F46E5", "#818CF8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionButtonGradient}
                  >
                    <MaterialCommunityIcons name="account-edit" size={26} color="white" />
                  </LinearGradient>
                  <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }
                    handleResetPassword()
                  }}
                >
                  <LinearGradient
                    colors={["#10B981", "#34D399"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionButtonGradient}
                  >
                    <MaterialCommunityIcons name="lock-reset" size={26} color="white" />
                  </LinearGradient>
                  <Text style={styles.actionButtonText}>Reset Password</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    }
                    handleLogout()
                  }}
                >
                  <LinearGradient
                    colors={["#EF4444", "#F87171"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionButtonGradient}
                  >
                    <MaterialCommunityIcons name="logout" size={26} color="white" />
                  </LinearGradient>
                  <Text style={styles.actionButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
        
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          userData={userData}
          onSave={handleUpdateProfile}
          refreshData={fetchUserData}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 20,
  },
  loadingBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingBarProgress: {
    height: '100%',
    backgroundColor: '#818CF8',
    borderRadius: 3,
  },
  // Not Logged In State
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(10px)',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 30,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginRight: 10,
  },
  // Logged In Profile
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  profileHeaderContainer: {
    marginBottom: 30,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  profileHeaderGradient: {
    width: "100%",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 100,
  },
  profileAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoCard: {
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    marginTop: -80,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  badgeText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
  },
  userDetailsList: {
    gap: 16,
  },
  userDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  // Action Buttons
  actionButtonsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  actionButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  modalGradient: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderLine: {
    position: 'absolute',
    top: 8,
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  formContainer: {
    padding: 20,
  },
  formContentContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 6,
  },
  inputWrapper: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButtonText: {
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ProfilePage
