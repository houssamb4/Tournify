import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Platform,
  ActivityIndicator,
  Animated,
  ImageBackground,
  Dimensions,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

// Direct API URL definition, similar to tournament-list.tsx
const API_BASE_URL = Platform.select({
  web: 'http://localhost:8080',
  default: 'http://localhost:8080' // Use 10.0.2.2 for Android emulator to access host machine's localhost
});

// For debugging - show which API URL is being used
console.log('Using API URL:', API_BASE_URL);

// Game interface definition
// Tournament summary interface
interface TournamentSummary {
  id: number;
  name: string;
  logoUrl: string;
}

// Player summary interface
interface PlayerSummary {
  id: number;
  name: string;
  profileUrl: string;
}

interface Game {
  id: number;
  name: string;
  icon: string;
  activePlayersCount: string; // This will be populated based on player count
  tournaments: TournamentSummary[];
  tournamentCount: number;
  players: PlayerSummary[];
  playerCount: number;
  gameGenre: string;
  developer: string;
}

// Game genres for filtering
const GAME_GENRES = [
  { id: 1, name: 'All Games', value: 'all' },
  { id: 2, name: 'FPS', value: 'FPS' },
  { id: 3, name: 'MOBA', value: 'MOBA' },
  { id: 4, name: 'Battle Royale', value: 'Battle Royale' },
  { id: 5, name: 'Sports', value: 'Sports' },
  { id: 6, name: 'Fighting', value: 'Fighting' },
  { id: 7, name: 'RTS', value: 'RTS' },
  { id: 8, name: 'Team Battle', value: 'Team Battle' },
];

// Using interfaces from gameService.ts

const GamesPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]); // Store all games for client-side filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerTranslateY = useRef(new Animated.Value(-100)).current;
  
  // Run entrance animation on mount
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
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Helper function to extract games from any response format
  const extractGamesFromResponse = (responseData: any): Game[] => {
    console.log('Extracting games from response:', responseData);
    
    let extractedGames: any[] = [];
    
    try {
      // From your console logs, the structure is:
      // responseData.data.data.data.content
      if (responseData?.data?.data?.data?.content) {
        console.log('Found games in responseData.data.data.data.content');
        extractedGames = responseData.data.data.data.content;
      }
      // Check all other possible response structures
      else if (responseData?.data?.data?.content) {
        console.log('Found games in responseData.data.data.content');
        extractedGames = responseData.data.data.content;
      } else if (responseData?.data?.content) {
        console.log('Found games in responseData.data.content');
        extractedGames = responseData.data.content;
      } else if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
        console.log('Found games in responseData.data.data array');
        extractedGames = responseData.data.data;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        console.log('Found games in responseData.data array');
        extractedGames = responseData.data;
      } else if (Array.isArray(responseData)) {
        console.log('Found games in responseData array');
        extractedGames = responseData;
      }
      
      // For debugging - log all keys in the response structure
      console.log('Response data keys:', Object.keys(responseData));
      if (responseData.data) {
        console.log('responseData.data keys:', Object.keys(responseData.data));
        if (responseData.data.data) {
          console.log('responseData.data.data keys:', Object.keys(responseData.data.data));
        }
      }
      
      // Verify that the extracted data looks like games
      if (extractedGames.length > 0) {
        console.log('First extracted item:', extractedGames[0]);
        
        // Map fields if needed (in case of field name mismatch)
        return extractedGames.map(item => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          // Set activePlayersCount based on the number of players in the players array
          activePlayersCount: item.playerCount?.toString() || 
                             (Array.isArray(item.players) ? item.players.length.toString() : '0'),
          tournaments: item.tournaments || [], // Now it's an array of objects
          tournamentCount: item.tournamentCount || (Array.isArray(item.tournaments) ? item.tournaments.length : 0),
          players: item.players || [], // Now it's an array of objects
          playerCount: item.playerCount || (Array.isArray(item.players) ? item.players.length : 0),
          gameGenre: item.gameGenre || item.game_genre || 'Unknown',
          developer: item.developer || 'Unknown'
        }));
      }
      
      // As a fallback, let's manually extract games from your specific response structure
      if (responseData?.data?.data?.data?.content) {
        return responseData.data.data.data.content;
      }
      
      console.error('No valid game data found in API response');
      return [];
    } catch (error) {
      console.error('Error extracting games from response:', error);
      throw error; // Propagate the error to be handled by the caller
    }
  };
  
  // Helper function to get authentication headers
  const getAuthHeaders = async () => {
    try {
      const token = await AsyncStorage.getItem('user');
      if (!token) return {};
      
      const userData = JSON.parse(token);
      if (userData?.token) {
        return { Authorization: `Bearer ${userData.token}` };
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return {};
  };

  // Main data loading effect - runs once at the beginning
  useEffect(() => {
    const loadAllGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get auth headers
        const headers = await getAuthHeaders();
        console.log('Using auth headers:', headers);
        
        // Fetch all games first
        const url = `${API_BASE_URL}/home/games`;
        const params = { page: 0, size: 50 }; // Get more games in one request
        
        console.log(`Fetching games from ${url}`);
        const response = await axios.get(url, { params, headers });
        
        // Extract games from response
        const gamesData = extractGamesFromResponse(response);
        console.log(`Found ${gamesData.length} games`);
        
        // Store all games for client-side filtering
        setAllGames(gamesData);
        setGames(gamesData);
        
        if (gamesData.length === 0) {
          console.warn('No games found in the response');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load games. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAllGames();
  }, []); // Empty dependency array - only run once on mount
  
  // Effect for filtering games client-side when filter changes
  useEffect(() => {
    // Do client-side filtering for instant response
    if (allGames.length > 0) {
      let filteredGames = [...allGames];
      
      // Apply genre filter
      if (activeFilter !== 'all') {
        filteredGames = filteredGames.filter(game => 
          game.gameGenre.toLowerCase() === activeFilter.toLowerCase()
        );
      }
      
      setGames(filteredGames);
      
      // Optionally fetch from API for accuracy (background update)
      if (activeFilter !== 'all') {
        fetchFilteredGamesFromApi();
      }
    }
  }, [activeFilter, allGames]);
  
  // Function to fetch filtered games from API (used for accuracy)
  const fetchFilteredGamesFromApi = async () => {
    try {
      const headers = await getAuthHeaders();
      let url = `${API_BASE_URL}/home/games/genre/${activeFilter}`;
      const params = { page: 0, size: 20 };
      
      // Don't show loading indicator for background updates
      const response = await axios.get(url, { params, headers });
      const gamesData = extractGamesFromResponse(response);
      
      // Only update if we got results (keep current results otherwise)
      if (gamesData.length > 0) {
        // Apply current search filter to the new results
        if (searchQuery.trim()) {
          const filtered = gamesData.filter(game =>
            game.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setGames(filtered);
        } else {
          setGames(gamesData);
        }
      }
    } catch (err) {
      console.error('Error fetching filtered games:', err);
    }
  };
  
  // Direct search handler function (like in teams.tsx)
  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    
    // Client-side filtering for immediate response
    if (allGames.length > 0) {
      let filteredGames = [...allGames];
      
      // Apply genre filter first
      if (activeFilter !== 'all') {
        filteredGames = filteredGames.filter(game => 
          game.gameGenre.toLowerCase() === activeFilter.toLowerCase()
        );
      }
      
      // Apply search filter
      if (text.trim()) {
        filteredGames = filteredGames.filter(game =>
          game.name.toLowerCase().includes(text.toLowerCase())
        );
      }
      
      // Update UI immediately with client-side filtered results
      setGames(filteredGames);
    }
    
    // Only make API call if text is substantial
    if (text.trim().length > 2) {
      try {
        const headers = await getAuthHeaders();
        const url = `${API_BASE_URL}/home/games/search`;
        const params = { query: text, page: 0, size: 20 };
        
        console.log(`Searching games with query: ${text}`);
        const response = await axios.get(url, { params, headers });
        
        // Extract games from response
        const gamesData = extractGamesFromResponse(response);
        
        // Only update if we got results
        if (gamesData.length > 0) {
          setGames(gamesData);
        }
      } catch (err) {
        console.error('Error searching games:', err);
        // Don't show error since we still have client-side results
      }
    }
  };

  const handleFilterChange = (filter: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
    setSearchQuery('');
  };

  const renderGameCard = ({ item, index }: { item: Game, index: number }) => {
    // Create staggered animation delay based on index
    const delay = index * 100;
    const cardScale = new Animated.Value(0.96);
    
    // Functions to handle card press animation
    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.98,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start();
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };
    
    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };
    
    const handleGamePress = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // Navigate to game details page with the game ID
      router.push(`/gameDetails?gameId=${item.id}`);
    };
    
    return (
      <Animated.View
        style={[styles.gameCard, {
          opacity: fadeAnim,
          transform: [
            { translateY: translateY },
            { scale: cardScale }
          ],
          // Add a slight delay based on index for staggered animation
          animationDelay: `${delay}ms`
        }]}
      >
        <TouchableOpacity 
          style={styles.gameCardTouchable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleGamePress}
          activeOpacity={0.95}
        >
          <View style={styles.gameImageContainer}>
            <Image source={{ uri: item.icon }} style={styles.gameCardImage} />
            <View style={styles.genreBadge}>
              <Text style={styles.genreBadgeText}>{item.gameGenre}</Text>
            </View>
          </View>
          
          <View style={styles.gameCardContent}>
            <Text style={styles.gameCardTitle}>{item.name}</Text>
            <View style={styles.gameCardDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="account-group" size={16} color="#818CF8" />
                <Text style={styles.detailText}>{item.playerCount} active players</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="trophy" size={16} color="#818CF8" />
                <Text style={styles.detailText}>{item.tournamentCount.toLocaleString()} tournaments</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="developer-board" size={16} color="#818CF8" />
                <Text style={styles.detailText}>{item.developer}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderGenreFilter = ({ item }: { item: typeof GAME_GENRES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.genreFilter, 
        activeFilter === item.value && styles.activeGenreFilter
      ]}
      onPress={() => handleFilterChange(item.value)}
    >
      <Text style={[
        styles.genreText,
        activeFilter === item.value && styles.activeGenreText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Function to clear search
  const clearSearch = () => {
    handleSearch('');
  };
  
  // We'll use direct filtering now, not computed filteredGames
  const filteredGames = games;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground 
        source={require('../../assets/images/dark-gradient-bg.png')} 
        style={styles.bgImage} 
        resizeMode="cover"
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#818CF8" />
            <Text style={styles.loadingText}>Loading games...</Text>
            <View style={styles.loadingBar}>
              <Animated.View style={[styles.loadingBarProgress, { width: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) }]} />
            </View>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => setActiveFilter(activeFilter)}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.headerTitle}>Games</Text>
            </View>
          </LinearGradient>
        </Animated.View>

            {/* Search Bar */}
            <Animated.View 
              style={[styles.searchBar, { opacity: fadeAnim, transform: [{ translateY: translateY }] }]}
            >
              <BlurView intensity={30} tint="dark" style={styles.searchBarBlur}>
                <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search games..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={(text) => handleSearch(text)}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <MaterialCommunityIcons name="close-circle" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </BlurView>
            </Animated.View>

            {/* Genre Filters */}
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateY }] }}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={GAME_GENRES}
                renderItem={renderGenreFilter}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.genreList}
              />
            </Animated.View>

            {/* Games List */}
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateY }] }}>
              <View style={styles.gamesHeaderRow}>
                <Text style={styles.sectionTitle}>
                  {activeFilter === 'all' ? 'All Games' : 
                  GAME_GENRES.find(g => g.value === activeFilter)?.name}
                </Text>
                <Text style={styles.gameCount}>{filteredGames.length} games</Text>
              </View>
              
              {filteredGames.length === 0 && !loading ? (
                <View style={styles.noResultsContainer}>
                  <MaterialCommunityIcons name="gamepad-variant" size={60} color="#4B5563" />
                  <Text style={styles.noResultsText}>No games found</Text>
                  <Text style={styles.noResultsSubText}>Try a different filter or search term</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredGames}
                  renderItem={renderGameCard}
                  keyExtractor={item => item.id.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={styles.gamesList}
                  // Add extra props for a better UX
                  initialNumToRender={8}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews={Platform.OS !== 'web'}
                />
              )}
            </Animated.View>
          </ScrollView>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  safeArea: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 90, // Added bottom padding to prevent content from being hidden by tab bar
  },
  header: {
    height: 100,
    justifyContent: "center",
    marginTop: 0,
    zIndex: 10,
    marginBottom: 10,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 20,
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
    color: 'white',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    marginBottom: 20,
    fontSize: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  retryButtonText: {
    color: '#818CF8',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gamesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameCount: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  genreList: {
    paddingBottom: 24,
  },
  genreFilter: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeGenreFilter: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  genreText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  activeGenreText: {
    color: 'white',
    fontWeight: '600',
  },
  gamesList: {
    paddingBottom: 40,
  },
  noResultsContainer: {
    alignItems: 'center',
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
  gameCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameCardTouchable: {
    flexDirection: 'row',
    borderRadius: 16,
  },
  gameImageContainer: {
    width: 120,
    height: 140,
    position: 'relative',
  },
  gameCardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  genreBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  genreBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  gameCardContent: {
    flex: 1,
    padding: 16,
  },
  gameCardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  gameCardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#E5E7EB',
    fontSize: 13,
    marginLeft: 8,
  },
});

export default GamesPage;
