import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import CustomTabBar from './components/CustomTabBar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#818CF8" />
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background
    }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade'
        }}
      />
      <CustomTabBar />
    </View>
  );
}