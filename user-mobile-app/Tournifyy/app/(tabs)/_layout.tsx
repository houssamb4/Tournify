import { View } from 'react-native';
import { Stack } from 'expo-router';
import CustomTabBar from './components/CustomTabBar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: Colors[colorScheme ?? 'light'].background 
    }}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
      />
      <CustomTabBar />
    </View>
  );
}