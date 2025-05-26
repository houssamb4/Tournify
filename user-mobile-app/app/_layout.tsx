import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthProvider, { useAuth } from './context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

// Component that uses Auth context and handles protected routes
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isResetPasswordRoute = segments[1] === 'reset';
    
    console.log('Route changed:', {
      segments,
      isAuthenticated,
      isLoading,
      inAuthGroup,
      currentPath: segments.join('/')
    });

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !isAuthenticated &&
      !inAuthGroup
    ) {
      console.log('Unauthenticated user in protected route, redirecting to auth');
      router.replace('/(auth)');
    } else if (
      // If the user is signed in and the initial segment is in the auth group.
      isAuthenticated &&
      inAuthGroup &&
      !isResetPasswordRoute // Allow access to reset password even when authenticated
    ) {
      console.log('Authenticated user in auth group, redirecting to home');
      router.replace('/(tabs)');
    }
  }, [isLoading, isAuthenticated, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#818CF8" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}