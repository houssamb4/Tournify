"use client"

import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter, usePathname } from "expo-router"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Colors } from "@/constants/Colors"
import { BlurView } from "expo-blur"
import * as Haptics from "expo-haptics"
import { useRef, useEffect } from "react"
import { LinearGradient } from "expo-linear-gradient"

export default function CustomTabBar() {
  const router = useRouter()
  const pathname = usePathname()
  const colorScheme = useColorScheme()

  // Animation values for tab indicator
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current
  const tabIndicatorWidth = useRef(new Animated.Value(0)).current

  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "tournaments", icon: "trophy", label: "Tournaments" },
    { id: "games", icon: "game-controller", label: "Games" },
    { id: "teams", icon: "people", label: "Teams" },
    { id: "profile", icon: "person", label: "Profile" },
  ]

  const handleTabPress = (tabId: string, index: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    // Animate the tab indicator
    Animated.parallel([
      Animated.spring(tabIndicatorPosition, {
        toValue: index * (100 / tabs.length),
        friction: 10,
        tension: 100,
        useNativeDriver: false,
      }),
      Animated.spring(tabIndicatorWidth, {
        toValue: 100 / tabs.length,
        friction: 10,
        tension: 100,
        useNativeDriver: false,
      }),
    ]).start()

    router.navigate(`../(tabs)/${tabId}`)
  }

  const isActive = (tabId: string) => pathname === `/(tabs)/${tabId}` || (tabId === "home" && pathname === "/(tabs)")

  // Set initial indicator position based on active tab
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => isActive(tab.id))
    if (activeIndex !== -1) {
      tabIndicatorPosition.setValue(activeIndex * (100 / tabs.length))
      tabIndicatorWidth.setValue(100 / tabs.length)
    }
  }, [pathname])

  return (
    <BlurView intensity={80} tint={colorScheme ?? "light"} style={styles.blurContainer}>
      <LinearGradient
        colors={['rgba(17, 24, 39, 0.95)', 'rgba(31, 41, 55, 0.98)']}
        style={styles.gradientOverlay}
      >
        <View style={styles.container}>
          {/* Animated Tab Indicator */}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                left: tabIndicatorPosition.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                width: tabIndicatorWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />

          {tabs.map((tab, index) => {
            const active = isActive(tab.id)
            const tintColor = active ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault
            
            // Create animations for active tab
            const scale = active ? 1.1 : 1
            const iconOpacity = active ? 1 : 0.7
            
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab.id, index)}
                style={[styles.tab, active && styles.activeTab]}
                activeOpacity={0.7}
              >
                <Animated.View 
                  style={[
                    styles.tabContent,
                    { transform: [{ scale }], opacity: iconOpacity }
                  ]}
                >
                  {active && (
                    <View style={styles.activeTabBackground} />
                  )}
                  <Ionicons
                    name={tab.icon as any}
                    size={24}
                    color={tintColor}
                    style={active ? styles.activeIcon : undefined}
                  />
                  <Text style={[styles.label, { color: tintColor }]}>{tab.label}</Text>
                </Animated.View>
              </TouchableOpacity>
            )
          })}
        </View>
      </LinearGradient>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  blurContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(79, 70, 229, 0.3)",
    zIndex: 50,
    overflow: 'hidden',
  },
  gradientOverlay: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: "rgba(129, 140, 248, 0.2)",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    position: "relative",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
    position: 'relative',
  },
  activeTab: {
    zIndex: 10,
  },
  activeTabBackground: {
    position: 'absolute',
    top: -10,
    left: 15,
    right: 15,
    bottom: -6,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.2)',
    zIndex: -1,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
    padding: 6,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
    textShadowColor: 'rgba(79, 70, 229, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  tabIndicator: {
    position: "absolute",
    height: 3,
    backgroundColor: "#4F46E5",
    bottom: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
})
