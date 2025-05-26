import { Stack } from 'expo-router';
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#818CF8" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#111827' },
        animation: 'fade'
      }}
    />
  );
}