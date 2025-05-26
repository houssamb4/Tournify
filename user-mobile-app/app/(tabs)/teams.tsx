"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
  ImageBackground,
  Dimensions,
  RefreshControl,
} from "react-native"
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { StatusBar } from "expo-status-bar"
import * as Haptics from "expo-haptics"
import { useAuth } from "../context/AuthContext"

const API_BASE_URL = Platform.select({
  web: "http://localhost:8080",
  default: "http://10.0.2.2:8080", // Use 10.0.2.2 for Android emulator to access host machine's localhost
})

// For debugging - show which API URL is being used
console.log('Using API URL for teams:', API_BASE_URL);

type RootStackParamList = {
  home: undefined
  login: undefined
  register: undefined
  welcome: undefined
  teamDetails: { teamId: number }
}

type Team = {
  id: number
  name: string
  location: string
  logoUrl: string
  created_at: number
  updated_at: number
  players: any[]
}

const TeamsPage = () => {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])       // All teams from pagination
  const [allTeams, setAllTeams] = useState<Team[]>([]) // All teams for client-side filtering
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const fallbackUrl =
    "https://lh5.googleusercontent.com/proxy/Owso70rUZ2mC_8SC971CLL5dOopobor3RgMrOaolM_NebPDqcmrtWXRAY0aJ4RCapW8ABht0gPWC_t0SB2FtMRtK"
  const { token } = useAuth()

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const headerTranslateY = useRef(new Animated.Value(-100)).current

  // Run entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const fetchTeams = async (pageNumber = 0, shouldRefresh = false) => {
    try {
      if (shouldRefresh) {
        setRefreshing(true);
      }
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching teams with token:', token ? 'Token exists' : 'No token');

      const response = await axios.get(
        `${API_BASE_URL}/home/listTeams?page=${pageNumber}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Teams API Response:', response.data);

      // Handle nested response structure
      const teamsData = response.data?.data?.data?.content || response.data?.data?.content || response.data?.content;

      if (teamsData) {
        if (shouldRefresh || pageNumber === 0) {
          setTeams(teamsData);
        } else {
          setTeams(prevTeams => [...prevTeams, ...teamsData]);
        }
        
        // Handle pagination based on response structure
        const isLast = response.data?.data?.data?.last || response.data?.data?.last || response.data?.last || false;
        setHasMore(!isLast);
        setCurrentPage(pageNumber);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Please login to view teams');
          router.replace('/(auth)/login');
        } else {
          setError(error.response?.data?.message || 'Failed to load teams');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      if (shouldRefresh) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleSearch = async (text: string) => {
    setSearchQuery(text)
    
    // Client-side filtering for immediate response
    if (allTeams.length > 0) {
      // First show immediate results from client-side
      if (text.trim().length > 0) {
        const filtered = allTeams.filter(
          (team) =>
            team.name.toLowerCase().includes(text.toLowerCase()) ||
            team.location.toLowerCase().includes(text.toLowerCase())
        )
        setFilteredTeams(filtered)
      } else {
        // If search is empty, clear filtered results
        setFilteredTeams([])
      }
    }
    
    // Only make API call if text is substantial
    if (text.length > 2) {
      try {
        // Don't show loading since we already have client-side results
        // Get auth token
        const userData = token ? JSON.parse(token) : null
        
        // Make API call to search teams
        const response = await axios.get(`${API_BASE_URL}/home/searchTeams`, {
          params: {
            query: text,
            page_no: 0,
            size: 20
          },
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        })
        
        // Extract teams from response
        const searchResults = response.data?.data?.content || []
        
        // Only update if we got results
        if (searchResults.length > 0) {
          setFilteredTeams(searchResults)
        }
      } catch (error) {
        console.error("Error searching teams:", error)
        // No need to show error since we still have client-side results
      }
    }
  }
  
  // Function to clear search
  const clearSearch = () => {
    handleSearch('')
  }

  const handleLoadMore = () => {
    if (!loading && hasMore && searchQuery.length <= 2) {
      fetchTeams(currentPage + 1)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTeams(0, true)
  }

  const renderTeamCard = ({ item, index }: { item: Team; index: number }) => {
    const delay = index * 100
    const cardScale = new Animated.Value(0.96)
    
    // Function to handle card press animation
    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.98,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start()
    }
    
    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start()
    }
    
    const navigateToTeamDetails = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }
      console.log("Team card pressed:", item)
      router.push(`/teamDetails?teamId=${item.id}`)
    }

    return (
      <Animated.View
        style={[
          styles.teamCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: translateY },
              { scale: cardScale }
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={navigateToTeamDetails}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={styles.teamCardTouchable}
        >
          <LinearGradient
            colors={["#1F2937", "#374151"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.teamCardGradient}
          >
            <View style={styles.teamLogoContainer}>
              <Image
                source={{ uri: item.logoUrl || fallbackUrl }}
                style={styles.teamLogo}
                defaultSource={require("@/assets/images/logo.png")}
              />
            </View>

            <View style={styles.teamInfo}>
              <View style={styles.teamHeaderRow}>
                <Text style={styles.teamName}>{item.name}</Text>
                <View style={styles.teamBadge}>
                  <Text style={styles.teamBadgeText}>TEAM</Text>
                </View>
              </View>
              
              <View style={styles.teamDetailsContainer}>
                <View style={styles.teamDetailItem}>
                  <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.teamDetails}>{item.location}</Text>
                </View>
                
                <View style={styles.teamDetailItem}>
                  <Ionicons name="people-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.teamDetails}>{item.players.length} players</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={navigateToTeamDetails}
              >
                <LinearGradient
                  colors={["#4F46E5", "#818CF8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.viewDetailsButtonGradient}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderFooter = () => {
    if (!loading) return null
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#818CF8" />
      </View>
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
        {/* Animated Header */}
        <Animated.View 
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslateY }] }
          ]}
        >
          <LinearGradient
            colors={["rgba(31, 41, 55, 0.95)", "rgba(17, 24, 39, 0.95)"]}
            style={styles.headerGradient}
          >
            <View style={styles.headerLeft}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
              <Text style={styles.headerTitle}>Teams Directory</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View 
          style={[
            styles.searchContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateY }] 
            }
          ]}
        >
          <BlurView intensity={30} tint="dark" style={styles.searchBarBlur}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search teams..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <MaterialCommunityIcons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </BlurView>
        </Animated.View>

        {/* Content */}
        <View style={styles.container}>
          {loading && !refreshing && teams.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#818CF8" />
              <Text style={styles.loadingText}>Loading teams...</Text>
              <View style={styles.loadingBar}>
                <Animated.View style={[styles.loadingBarProgress, { width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) }]} />
              </View>
            </View>
          )}

          {!loading && searchQuery.length > 2 && filteredTeams.length === 0 && (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons name="magnify" size={50} color="#4B5563" />
              <Text style={styles.noResultsText}>No teams found</Text>
              <Text style={styles.noResultsSubText}>Try a different search term</Text>
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={searchQuery.length > 2 ? filteredTeams : teams}
            renderItem={renderTeamCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.teamsList}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#818CF8"
                colors={["#818CF8"]}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              if (searchQuery.length <= 2 && !loading) {
                return (
                  <Animated.View 
                    style={[
                      styles.welcomeMessage,
                      { 
                        opacity: fadeAnim,
                        transform: [{ translateY: translateY }] 
                      }
                    ]}
                  >
                    <MaterialCommunityIcons name="account-group" size={60} color="#4F46E5" />
                    <Text style={styles.welcomeText}>Welcome to the Teams Directory!</Text>
                    <Text style={styles.welcomeSubtext}>
                      Search for your favorite teams or browse through the list below.
                    </Text>
                  </Animated.View>
                )
              }
              return null
            }}
          />
        </View>
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
  header: {
    height: 100,
    justifyContent: "center",
    marginTop: 0,
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 5,
  },
  searchBarBlur: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#E5E7EB",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 90, // Added bottom padding to prevent content from being hidden by tab bar
  },
  teamsList: {
    paddingBottom: 20,
  },
  teamCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  teamCardTouchable: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  teamCardGradient: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
  },
  teamLogoContainer: {
    padding: 4,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  teamInfo: {
    flex: 1,
    marginLeft: 16,
  },
  teamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  teamBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  teamBadgeText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '600',
  },
  teamDetailsContainer: {
    marginBottom: 12,
  },
  teamDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamDetails: {
    color: "#E5E7EB",
    fontSize: 14,
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    color: "#E5E7EB",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  loadingBar: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarProgress: {
    height: '100%',
    backgroundColor: '#818CF8',
    borderRadius: 2,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    color: "#E5E7EB",
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: "center",
  },
  noResultsSubText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  clearSearchButtonText: {
    color: '#818CF8',
    fontWeight: '600',
  },
  welcomeMessage: {
    paddingVertical: 60,
    alignItems: "center",
  },
  welcomeText: {
    color: "#E5E7EB",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtext: {
    color: "#9CA3AF",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  teamLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  viewDetailsButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  viewDetailsButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  viewDetailsText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
})

export default TeamsPage
