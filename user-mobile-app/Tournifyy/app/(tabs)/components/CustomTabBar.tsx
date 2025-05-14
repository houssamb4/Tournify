import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'tournaments', icon: 'trophy', label: 'Tournaments' },
    { id: 'games', icon: 'game-controller', label: 'Games' },
    { id: 'teams', icon: 'people', label: 'Teams' },
    { id: 'profile', icon: 'person', label: 'Profile' },
  ];

  const handleTabPress = (tabId: string) => {
    router.navigate(`../(tabs)/${tabId}`);
  };

  const isActive = (tabId: string) =>
    pathname === `/(tabs)/${tabId}` || 
    (tabId === 'home' && pathname === '/(tabs)');

  return (
    <BlurView intensity={50} tint={colorScheme ?? 'light'} style={styles.blurContainer}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const active = isActive(tab.id);
          const tintColor = active 
            ? Colors[colorScheme ?? 'light'].tint 
            : Colors[colorScheme ?? 'light'].tabIconDefault;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={styles.tab}
            >
              <Ionicons name={tab.icon as any} size={22} color={tintColor} />
              <Text style={[styles.label, { color: tintColor }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(12, 12, 25, 0.3)', 
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.85)', 
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
