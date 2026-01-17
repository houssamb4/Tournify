import { Redirect } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('Index: isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
  
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#111827' 
      }}>
        <ActivityIndicator size="large" color="#818CF8" />
        <Text style={{ color: 'white', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }
  
  // Redirect based on authentication status
  console.log('Index: Redirecting to:', isAuthenticated ? "/(tabs)" : "/(auth)");
  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)"} />;
}
