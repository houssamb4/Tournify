import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Animated,
  ImageBackground,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

const API_BASE_URL = Platform.select({
  web: 'http://localhost:8080',
  default: 'http://localhost:8080' 
});

// Player summary interface
interface PlayerSummary {
  id: number;
  name: string;
  profileUrl: string | null;
}

// Tournament summary interface
interface TournamentSummary {
  id: number;
  name: string;
  logoUrl: string;
}

// Game interface
interface Game {
  id: number;
  name: string;
  icon: string;
  activePlayersCount: string;
  tournaments: TournamentSummary[];
  tournamentCount: number;
  players: PlayerSummary[];
  playerCount: number;
  gameGenre: string;
  developer: string;
}

const GameDetailsScreen = () => {
  const router = useRouter();
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const headerTranslateY = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Run entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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
    ]).start();
  }, []);

  useEffect(() => {
    if (gameId) {
      console.log('GameDetails: useEffect triggered with gameId:', gameId);
      fetchGameDetails();
    } else {
      console.log('GameDetails: No gameId found in params');
    }
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      console.log('GameDetails: Fetching game details for ID:', gameId);
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('user');
      const userData = token ? JSON.parse(token) : null;

      console.log('GameDetails: Using token:', userData?.token ? 'Valid token present' : 'No token');
      console.log('GameDetails: Request URL:', `${API_BASE_URL}/home/games/${gameId}`);

      const response = await axios.get(`${API_BASE_URL}/home/games/${gameId}`, {
        headers: {
          Authorization: `Bearer ${userData?.token}`
        }
      });

      console.log('GameDetails: Response status:', response.status);
      console.log('GameDetails: Response data structure:', Object.keys(response.data));
      
      // Handle different response structures
      let gameData;
      console.log('GameDetails: Full response:', JSON.stringify(response.data).slice(0, 200) + '...');
      
      // The API response structure is: response.data.data.data
      if (response.data?.data?.data) {
        console.log('GameDetails: Found game in response.data.data.data');
        gameData = response.data.data.data;
      } else if (response.data?.data) {
        console.log('GameDetails: Found game in response.data.data');
        gameData = response.data.data;
      } else if (response.data) {
        console.log('GameDetails: Found game directly in response.data');
        gameData = response.data;
      }
      
      // Make sure we set activePlayersCount based on playerCount
      if (gameData) {
        // Ensure playerCount is calculated if not already set
        if (!gameData.playerCount && Array.isArray(gameData.players)) {
          gameData.playerCount = gameData.players.length;
        }
        // Set activePlayersCount to be the same as playerCount
        gameData.activePlayersCount = gameData.playerCount?.toString() || '0';
      }
      
      console.log('GameDetails: Game data:', gameData);
      setGame(gameData);
    } catch (err) {
      console.error('GameDetails: Error fetching game details:', err);
      if (axios.isAxiosError(err)) {
        console.error('GameDetails: Axios error details:', err.response?.data || err.message);
      }
      setError('Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.replace('/games');
  };

  const renderPlayerItem = ({ item, index }: { item: PlayerSummary, index: number }) => {
    const delay = index * 50;
    
    return (
      <Animated.View 
        style={[styles.playerCard, {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
          animationDelay: `${delay}ms`
        }]}
      >
        <LinearGradient
          colors={["rgba(31, 41, 55, 0.6)", "rgba(31, 41, 55, 0.3)"]}
          style={styles.playerCardGradient}
        >
          <View style={styles.playerAvatarContainer}>
            <View style={styles.playerAvatar}>
              {item.profileUrl ? (
                <Image 
                  source={{ uri: item.profileUrl }} 
                  style={styles.playerAvatarImage} 
                  resizeMode="cover"
                />
              ) : (
                <MaterialCommunityIcons name="account" size={24} color="#E5E7EB" />
              )}
            </View>
          </View>
          <View style={styles.playerInfo}>
            <View style={styles.playerNameRow}>
              <Text style={styles.playerName}>{item.name}</Text>
              <View style={styles.playerBadge}>
                <Text style={styles.playerBadgeText}>PLAYER</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderTournamentItem = ({ item, index }: { item: TournamentSummary, index: number }) => {
    const delay = index * 50;
    
    return (
      <Animated.View 
        style={[styles.tournamentCard, {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
          animationDelay: `${delay}ms`
        }]}
      >
        <LinearGradient
          colors={["rgba(31, 41, 55, 0.6)", "rgba(31, 41, 55, 0.3)"]}
          style={styles.tournamentCardGradient}
        >
          <View style={styles.tournamentLogoContainer}>
            <View style={styles.tournamentLogo}>
              {item.logoUrl ? (
                <Image 
                  source={{ uri: item.logoUrl }} 
                  style={styles.tournamentLogoImage} 
                  resizeMode="cover"
                />
              ) : (
                <MaterialCommunityIcons name="trophy" size={24} color="#E5E7EB" />
              )}
            </View>
          </View>
          <View style={styles.tournamentInfo}>
            <View style={styles.tournamentNameRow}>
              <Text style={styles.tournamentName}>{item.name}</Text>
              <View style={styles.tournamentBadge}>
                <Text style={styles.tournamentBadgeText}>TOURNAMENT</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ImageBackground 
          source={require('../../assets/images/dark-gradient-bg.png')} 
          style={styles.bgImage} 
          resizeMode="cover"
        >
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
              <TouchableOpacity 
                onPress={handleBackPress} 
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Game Details</Text>
            </LinearGradient>
          </Animated.View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#818CF8" />
            <Text style={styles.loadingText}>Loading game details...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ImageBackground 
          source={require('../../assets/images/dark-gradient-bg.png')} 
          style={styles.bgImage} 
          resizeMode="cover"
        >
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
              <TouchableOpacity 
                onPress={handleBackPress} 
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Game Details</Text>
            </LinearGradient>
          </Animated.View>
          
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              onPress={fetchGameDetails}
              style={styles.retryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground 
        source={require('../../assets/images/dark-gradient-bg.png')} 
        style={styles.bgImage} 
        resizeMode="cover"
      >
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
            <TouchableOpacity 
              onPress={handleBackPress} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Game Details</Text>
          </LinearGradient>
        </Animated.View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {game && (
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [
                { translateY: translateY },
                { scale: scaleAnim }
              ]
            }}>
              <View style={styles.gameProfileContainer}>
                <LinearGradient
                  colors={["rgba(31, 41, 55, 0.8)", "rgba(17, 24, 39, 0.7)"]}
                  style={styles.gameProfileGradient}
                >
                  <View style={styles.gameIconContainer}>
                    {game.icon ? (
                      <Image 
                        source={{ uri: game.icon }} 
                        style={styles.gameIcon} 
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.gamePlaceholderIcon}>
                        <MaterialCommunityIcons name="gamepad-variant" size={40} color="#E5E7EB" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.gameNameContainer}>
                    <Text style={styles.gameName}>{game.name}</Text>
                    <View style={styles.genreBadge}>
                      <Text style={styles.genreText}>{game.gameGenre}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.gameStatsContainer}>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons name="account-group" size={20} color="#818CF8" />
                      <Text style={styles.statLabel}>{game.playerCount} Players</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons name="trophy-outline" size={20} color="#818CF8" />
                      <Text style={styles.statLabel}>{game.tournamentCount} Tournaments</Text>
                    </View>
                  </View>
                  
                  <View style={styles.gameDeveloperContainer}>
                    <MaterialCommunityIcons name="developer-board" size={20} color="#9CA3AF" />
                    <Text style={styles.developerText}>Developer: {game.developer}</Text>
                  </View>
                </LinearGradient>
              </View>
              
              {/* Tournaments Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="trophy" size={24} color="#818CF8" />
                  <Text style={styles.sectionTitle}>Tournaments</Text>
                </View>
                
                {game.tournaments && game.tournaments.length > 0 ? (
                  <FlatList
                    data={game.tournaments}
                    renderItem={renderTournamentItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.tournamentsList}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <MaterialCommunityIcons name="trophy-outline" size={48} color="#4B5563" />
                    <Text style={styles.emptyStateText}>No tournaments found for this game</Text>
                  </View>
                )}
              </View>
              
              {/* Players Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#818CF8" />
                  <Text style={styles.sectionTitle}>Players</Text>
                </View>
                
                {game.players && game.players.length > 0 ? (
                  <FlatList
                    data={game.players}
                    renderItem={renderPlayerItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.playersList}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <MaterialCommunityIcons name="account-remove" size={48} color="#4B5563" />
                    <Text style={styles.emptyStateText}>No players found for this game</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  bgImage: {
    flex: 1,
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.5)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
  },
  scrollView: {
    flex: 1,
    marginTop: 70,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#818CF8',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  gameProfileContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gameProfileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  gameIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameIcon: {
    width: '100%',
    height: '100%',
  },
  gamePlaceholderIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.7)',
  },
  gameNameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  gameName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(67, 56, 202, 0.4)',
    borderRadius: 12,
  },
  genreText: {
    color: '#C7D2FE',
    fontWeight: '600',
    fontSize: 14,
  },
  gameStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    color: '#E5E7EB',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
  gameDeveloperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  developerText: {
    color: '#9CA3AF',
    marginLeft: 8,
    fontSize: 14,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  tournamentsList: {
    paddingVertical: 8,
  },
  tournamentCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tournamentCardGradient: {
    flexDirection: 'row',
    padding: 12,
  },
  tournamentLogoContainer: {
    marginRight: 12,
  },
  tournamentLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tournamentLogoImage: {
    width: '100%',
    height: '100%',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  tournamentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(67, 56, 202, 0.4)',
    borderRadius: 12,
  },
  tournamentBadgeText: {
    color: '#C7D2FE',
    fontWeight: '500',
    fontSize: 10,
  },
  playersList: {
    paddingVertical: 8,
  },
  playerCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  playerCardGradient: {
    flexDirection: 'row',
    padding: 12,
  },
  playerAvatarContainer: {
    marginRight: 12,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  playerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  playerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(67, 56, 202, 0.4)',
    borderRadius: 12,
  },
  playerBadgeText: {
    color: '#C7D2FE',
    fontWeight: '500',
    fontSize: 10,
  },
  playerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAge: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 12,
    marginVertical: 8,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default GameDetailsScreen;
