import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  ImageBackground,
  RefreshControl,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  logoUrl?: string;
  teams?: any[];
}

type TabParamList = {
  tournamentDetails: { tournamentId: number };
};

type NavigationProp = NativeStackNavigationProp<TabParamList>;

const API_BASE_URL = Platform.select({
  web: 'http://localhost:8080',
  // For Android emulator, localhost refers to the emulator itself, not your machine
  android: 'http://localhost:8080',
  // For iOS simulator, localhost refers to your computer, so it should work
  ios: 'http://localhost:8080',
  // Default fallback
  default: 'http://localhost:8080',
});

const TournamentsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingApiTournaments, setLoadingApiTournaments] = useState(false);
  const [apiTournaments, setApiTournaments] = useState<Tournament[]>([]);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerTranslateY = useRef(new Animated.Value(-100)).current;
  
  // Run entrance animations
  useEffect(() => {
    // Animate elements when component mounts
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
    ]).start();
    
    // Fetch tournaments when component mounts
    fetchApiTournaments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApiTournaments()
      .catch(err => console.error('Error refreshing data:', err))
      .finally(() => setRefreshing(false));
  };

  const fetchApiTournaments = async () => {
    try {
      setLoadingApiTournaments(true);
      const token = await AsyncStorage.getItem('user');
      const userData = token ? JSON.parse(token) : null;
      
      const response = await axios.get(`${API_BASE_URL}/home/listTournaments`, {
        params: {
          page: 0,
          size: 10
        },
        headers: {
          Authorization: `Bearer ${userData?.token}`
        }
      });

      setApiTournaments(response.data.data.content || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoadingApiTournaments(false);
    }
  };

  const handleTournamentPress = (tournamentId: number) => {
    navigation.navigate('tournamentDetails', { tournamentId });
  };

  const renderBrowseTournaments = () => (
    <Animated.View 
      style={[
        styles.browseTournamentsContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Browse Tournaments</Text>
        {loadingApiTournaments && (
          <ActivityIndicator size="small" color="#818CF8" style={{marginLeft: 10}} />
        )}
      </View>

      {apiTournaments.length > 0 ? (
        <View style={styles.tournamentsGrid}>
          {apiTournaments.map((tournament, index) => {
            const cardScale = new Animated.Value(1);
            
            const handlePressIn = () => {
              Animated.spring(cardScale, {
                toValue: 0.98,
                friction: 8,
                tension: 80,
                useNativeDriver: true,
              }).start();
            };
            
            const handlePressOut = () => {
              Animated.spring(cardScale, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
              }).start();
            };
            
            const navigateToTournamentDetails = () => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              handleTournamentPress(tournament.id);
            };
            
            return (
              <Animated.View 
                key={tournament.id}
                style={[
                  styles.tournamentGridCardContainer,
                  {
                    transform: [{ scale: cardScale }]
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.tournamentGridCard}
                  onPress={navigateToTournamentDetails}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["rgba(31, 41, 55, 0.9)", "rgba(17, 24, 39, 0.95)"]}
                    style={styles.tournamentCardGradient}
                  >
                    <Image 
                      source={{ uri: tournament.logoUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LAxkZdFvrkiYES_BZjN8hGkgmLpizB3gug&s' }} 
                      style={styles.tournamentGridLogo}
                      defaultSource={require('@/assets/images/logo.png')}
                    />
                    <View style={styles.tournamentGridInfo}>
                      <View style={styles.tournamentHeaderRow}>
                        <Text style={styles.tournamentGridName} numberOfLines={1}>
                          {tournament.name}
                        </Text>
                        <View style={styles.tournamentBadge}>
                          <Text style={styles.tournamentBadgeText}>TOURNAMENT</Text>
                        </View>
                      </View>
                      <Text style={styles.tournamentGridDate} numberOfLines={1}>
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </Text>
                      <View style={styles.tournamentDetailsContainer}>
                        <View style={styles.tournamentDetailItem}>
                          <MaterialCommunityIcons name="account-group" size={16} color="#9CA3AF" />
                          <Text style={styles.tournamentGridTeamsText}>
                            {tournament.teams?.length || 0} Teams
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={navigateToTournamentDetails}
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
            );
          })}
        </View>
      ) : !loadingApiTournaments && (
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="trophy-outline" size={40} color="#4B5563" />
          <Text style={styles.emptyStateText}>No tournaments available</Text>
        </View>
      )}
    </Animated.View>
  );

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
              <Text style={styles.headerTitle}>Tournaments</Text>
            </View>
          </LinearGradient>
        </Animated.View>
        
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366F1"
              colors={['#6366F1']}
            />
          }
        >
          {/* Browse Tournaments Section */}
          {renderBrowseTournaments()}
          
          {/* Loading State */}
          {loadingApiTournaments && apiTournaments.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#818CF8" />
              <Text style={styles.loadingText}>Loading tournaments...</Text>
              <View style={styles.loadingBar}>
                <Animated.View style={[styles.loadingBarProgress, { width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) }]} />
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 10,
    paddingBottom: 90, // Added bottom padding to prevent content from being hidden by tab bar
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
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
  navTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: 4,
  },
  navTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeNavTab: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  navTabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeNavTabText: {
    color: '#4F46E5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(79, 70, 229, 0.3)',
    borderColor: 'rgba(129, 140, 248, 0.5)',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  liveBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  featuredSection: {
    marginBottom: 24,
  },
  featuredCard: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 2,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  featuredContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredStatus: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuredTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamPreview: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  teamLogoSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  teamName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  vsText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredPrize: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentRoundContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentRoundLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  currentRoundText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  watchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionList: {
    paddingBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tournamentCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tournamentImage: {
    width: '100%',
    height: 160,
  },
  tournamentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tournamentContent: {
    position: 'relative',
    padding: 16,
  },
  tournamentStatus: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tournamentTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tournamentGame: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  gameName: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  tournamentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#E5E7EB',
    fontSize: 12,
    marginLeft: 4,
  },
  registrationInfo: {
    marginBottom: 12,
  },
  registrationText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  entryFeeText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  winnerContainer: {
    marginBottom: 12,
  },
  winnerInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  winnerLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginRight: 4,
  },
  winnerName: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchHighlight: {
    flexDirection: 'row',
  },
  highlightLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginRight: 4,
  },
  highlightText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  watchButtonStyle: {
    backgroundColor: '#4F46E5',
  },
  joinButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  watchButtonTextStyle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  rulesSection: {
    marginBottom: 24,
  },
  rulesListContainer: {
    paddingRight: 16,
  },
  rulesCard: {
    width: 280,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  rulesTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rulesList: {
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleText: {
    color: '#E5E7EB',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  tournamentType: {
    color: '#9CA3AF',
    fontSize: 12,
    fontStyle: 'italic',
  },
  leaderboardContainer: {
    marginBottom: 24,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    marginBottom: 8,
  },
  leaderboardHeaderText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  leaderboardList: {
    paddingBottom: 24,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  leaderboardRank: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topRankText: {
    color: '#F59E0B',
    fontSize: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  usernameText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  prizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  prizeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  howItWorksContainer: {
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepDescription: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  tutorialButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  ctaContainer: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: '#4F46E5',
  },
  inviteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inviteButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoriesSection: {
    marginBottom: 30,
  },
  categoriesList: {
    paddingRight: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  categoryCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 65,
    height: 65,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  apiTournamentsContainer: {
    marginBottom: 24,
  },
  apiTournamentsList: {
    paddingBottom: 16,
  },
  apiTournamentCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  apiTournamentLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  apiTournamentInfo: {
    flex: 1,
  },
  apiTournamentName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  apiTournamentDate: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  apiTournamentTeams: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  // loadingContainer already defined above
  browseTournamentsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 150,
  },
  emptyStateText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tournamentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tournamentGridCardContainer: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  tournamentGridCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tournamentCardGradient: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tournamentGridLogo: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  tournamentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tournamentGridInfo: {
    padding: 4,
  },
  tournamentGridName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  tournamentBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  tournamentBadgeText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '600',
  },
  tournamentGridDate: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  tournamentDetailsContainer: {
    marginBottom: 12,
  },
  tournamentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tournamentGridTeams: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentGridTeamsText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
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
  // sectionHeader and sectionTitle already defined above
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TournamentsScreen;
