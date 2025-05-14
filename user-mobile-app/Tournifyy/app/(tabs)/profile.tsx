import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TabParamList = {
    home: undefined;
    login: undefined;
    register: undefined;
    welcome: undefined;
  };
  
type NavigationProp = NativeStackNavigationProp<TabParamList>;

const ProfilePage = () => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation<NavigationProp>();

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after delay
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, 2000); // Simulate a 2-second delay
  }, [fadeAnim]);

  if (isLoading) {
    // Show loading spinner while isLoading is true
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Checking access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Icon Animation */}
        <Animated.View 
          style={[
            styles.iconContainer, 
            { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }
          ]}
        >
          <MaterialCommunityIcons 
            name="lock-outline" 
            size={80} 
            color="#4F46E5" 
          />
        </Animated.View>

        {/* Title */}
        <Animated.Text 
          style={[
            styles.title, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }
          ]}
        >
          Restricted Access
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text 
          style={[
            styles.subtitle, 
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }
          ]}
        >
          You must log in to continue.
        </Animated.Text>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('login'); 
          }}        
          >
          <Text style={styles.loginButtonText}>Login</Text>
          <MaterialCommunityIcons 
            name="arrow-right" 
            size={20} 
            color="#111827" 
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  }
});

export default ProfilePage;