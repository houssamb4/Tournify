import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Ensure this is the default export
export default function ApiTestScreen() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = Platform.select({
    web: 'http://localhost:8080',
    default: 'http://localhost:8080' 
  });

  const addLog = (message: string, isSuccess = true) => {
    setTestResults(prev => [...prev, { message, isSuccess, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setTestResults([]);
    setIsLoading(true);
    
    try {
      // Test 1: Health endpoint
      addLog('Testing health endpoint...');
      try {
        const healthResponse = await axios.get(`${API_BASE_URL}/api/auth/health`);
        if (healthResponse.status === 200) {
          addLog(`Health endpoint SUCCESS: ${JSON.stringify(healthResponse.data)}`, true);
        } else {
          addLog(`Health endpoint returned status: ${healthResponse.status}`, false);
        }
      } catch (error: any) {
        addLog(`Health endpoint FAILED: ${error.message}`, false);
      }
      
      // Test 2: Login endpoint (optional, will likely fail without credentials)
      addLog('Testing login endpoint with test credentials...');
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          usernameOrEmail: 'testuser',
          password: 'testpassword'
        });
        addLog(`Login endpoint SUCCESS: ${JSON.stringify(loginResponse.data)}`, true);
      } catch (error: any) {
        // This is expected to fail with invalid credentials
        if (error.response && error.response.status === 401) {
          addLog('Login endpoint properly responded with 401 Unauthorized (expected for test credentials)', true);
        } else {
          addLog(`Login endpoint FAILED: ${error.message}`, false);
        }
      }
      
      // Test 3: Update profile endpoint
      addLog('Testing update profile endpoint...');
      try {
        // This will fail without a valid token
        const updateProfileResponse = await axios.put(`${API_BASE_URL}/api/auth/update-profile`, {
          firstName: 'Updated First',
          lastName: 'Updated Last',
          phone: '+1234567890',
          address: '123 Updated Street, City, Country'
        }, {
          headers: {
            'Authorization': 'Bearer test-token' // Would need a valid token in practice
          }
        });
        addLog(`Update profile endpoint SUCCESS: ${JSON.stringify(updateProfileResponse.data)}`, true);
      } catch (error: any) {
        // This is expected to fail without a valid token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          addLog('Update profile endpoint properly responded with 401/403 (expected without valid token)', true);
        } else {
          addLog(`Update profile endpoint FAILED: ${error.message}`, false);
        }
      }
      
      // Test 4: Logout endpoint
      addLog('Testing logout endpoint...');
      try {
        // This will fail without a valid token
        const logoutResponse = await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
          headers: {
            'Authorization': 'Bearer test-token' // Would need a valid token in practice
          }
        });
        addLog(`Logout endpoint SUCCESS: ${JSON.stringify(logoutResponse.data)}`, true);
      } catch (error: any) {
        // This is expected to fail without a valid token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          addLog('Logout endpoint properly responded with 401/403 (expected without valid token)', true);
        } else {
          addLog(`Logout endpoint FAILED: ${error.message}`, false);
        }
      }
      
      // Test 5: Forgot password endpoint
      addLog('Testing forgot password endpoint...');
      try {
        const forgotPasswordResponse = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: 'testuser@example.com'
        });
        addLog(`Forgot password endpoint SUCCESS: ${JSON.stringify(forgotPasswordResponse.data)}`, true);
      } catch (error: any) {
        // This might fail if email doesn't exist, but should not return a server error
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          addLog(`Forgot password endpoint returned ${error.response.status} (might be expected if email is invalid)`, true);
        } else {
          addLog(`Forgot password endpoint FAILED: ${error.message}`, false);
        }
      }
    } catch (error: any) {
      addLog(`General error: ${error.message}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading ? styles.buttonDisabled : null]} 
        onPress={runTests}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Run Connection Tests</Text>
        )}
      </TouchableOpacity>
      
      <ScrollView style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <View 
            key={index} 
            style={[
              styles.resultItem, 
              result.isSuccess ? styles.successItem : styles.errorItem
            ]}
          >
            <Text style={styles.timestamp}>{new Date(result.timestamp).toLocaleTimeString()}</Text>
            <Text style={styles.resultText}>{result.message}</Text>
          </View>
        ))}
        {testResults.length === 0 && !isLoading && (
          <Text style={styles.noResults}>Tap the button to run connection tests</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1F2937', // Dark background
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for status bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E5E7EB', // Light text
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4F46E5', // Indigo
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#374151', // Darker gray for disabled
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#374151', // Slightly lighter dark
    borderRadius: 8,
    padding: 12,
  },
  resultItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
  },
  successItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Greenish tint
    borderColor: '#10B981', // Green border
  },
  errorItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Reddish tint
    borderColor: '#EF4444', // Red border
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF', // Lighter gray
    marginBottom: 5,
  },
  resultText: {
    fontSize: 14,
    color: '#D1D5DB', // Light gray text
  },
  noResults: {
    textAlign: 'center',
    color: '#9CA3AF', // Lighter gray
    marginTop: 20,
    fontSize: 15,
  },
});
