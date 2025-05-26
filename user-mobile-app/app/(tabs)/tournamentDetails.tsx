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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Platform.select({
  web: 'http://localhost:8080',
  default: 'http://localhost:8080' 
});

type Team = {
  id: number;
  name: string;
  location: string;
  logoUrl: string;
  created_at: number;
  updated_at: number;
  players: any[];
};

type Tournament = {
  id: number;
  name: string;
  logoUrl: string;
  startDate: number;
  endDate: number;
  created_at: number;
  updated_at: number;
  teams: Team[];
};

type RouteParams = {
  tournamentId: number;
};

const TournamentDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tournamentId } = route.params as RouteParams;
  const [tournament, setTournament] = useState<Tournament | null>(null);
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
    fetchTournamentDetails();
  }, [tournamentId]);

  const fetchTournamentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('user');
      const userData = token ? JSON.parse(token) : null;

      const response = await axios.get(`${API_BASE_URL}/home/findATournament/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${userData?.token}`
        }
      });

      setTournament(response.data.data);
    } catch (err) {
      setError('Failed to load tournament details');
      console.error('Error fetching tournament details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const renderTeamItem = ({ item, index }: { item: Team, index: number }) => {
    const delay = index * 100;
    
    return (
      <Animated.View 
        style={[styles.teamCard, {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
          animationDelay: `${delay}ms`
        }]}
      >
        <LinearGradient
          colors={["rgba(31, 41, 55, 0.6)", "rgba(31, 41, 55, 0.3)"]}
          style={styles.teamCardGradient}
        >
          <View style={styles.teamLogoContainer}>
            <Image 
              source={{ uri: item.logoUrl || 'https://via.placeholder.com/100' }} 
              style={styles.teamLogo}
              defaultSource={require('@/assets/images/logo.png')}
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
                <Text style={styles.teamLocation}>{item.location}</Text>
              </View>
              
              <View style={styles.teamDetailItem}>
                <Ionicons name="people-outline" size={16} color="#9CA3AF" />
                <Text style={styles.teamPlayers}>{item.players.length} players</Text>
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
              <Text style={styles.headerTitle}>Tournament Details</Text>
            </LinearGradient>
          </Animated.View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#818CF8" />
            <Text style={styles.loadingText}>Loading tournament details...</Text>
            <View style={styles.loadingBar}>
              <Animated.View style={[styles.loadingBarProgress, { width: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) }]} />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (error || !tournament) {
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
              <Text style={styles.headerTitle}>Tournament Details</Text>
            </LinearGradient>
          </Animated.View>
          
          <Animated.View 
            style={[styles.errorContainer, { opacity: fadeAnim, transform: [{ translateY }] }]}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#EF4444" />
            <Text style={styles.errorText}>{error || 'Tournament not found'}</Text>
            <Text style={styles.errorSubText}>We couldn't find the tournament you're looking for.</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                fetchTournamentDetails();
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#4F46E5", "#818CF8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
                <MaterialCommunityIcons name="refresh" size={18} color="white" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
            <TouchableOpacity 
              onPress={handleBackPress} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tournament Details</Text>
          </LinearGradient>
        </Animated.View>

        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Tournament Banner */}
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY }] }]}>
            <View style={styles.tournamentBanner}>
              <View style={styles.tournamentLogoWrapper}>
                <Image 
                  source={{ uri: tournament.logoUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LAxkZdFvrkiYES_BZjN8hGkgmLpizB3gug&s' }} 
                  style={styles.tournamentLogo}
                  defaultSource={require('@/assets/images/logo.png')}
                />
              </View>
              <Text style={styles.tournamentName}>{tournament.name}</Text>
              <View style={styles.tournamentDateBadge}>
                <MaterialCommunityIcons name="calendar-range" size={16} color="#818CF8" />
                <Text style={styles.tournamentDate}>
                  {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Basic Info */}
          <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY }, { scale: scaleAnim }] }]}>
            <LinearGradient
              colors={["rgba(31, 41, 55, 0.7)", "rgba(31, 41, 55, 0.4)"]}
              style={styles.infoCardGradient}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="information-outline" size={20} color="#818CF8" />
                <Text style={styles.sectionTitle}>Tournament Information</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-start" size={20} color="#818CF8" />
                <Text style={styles.infoText}>Start Date: {formatDate(tournament.startDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-end" size={20} color="#818CF8" />
                <Text style={styles.infoText}>End Date: {formatDate(tournament.endDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-group" size={20} color="#818CF8" />
                <Text style={styles.infoText}>Teams: {tournament.teams.length}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#818CF8" />
                <Text style={styles.infoText}>Created: {formatDate(tournament.created_at)}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Teams List */}
          <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY }, { scale: scaleAnim }] }]}>
            <LinearGradient
              colors={["rgba(31, 41, 55, 0.7)", "rgba(31, 41, 55, 0.4)"]}
              style={styles.infoCardGradient}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="account-group" size={20} color="#818CF8" />
                <Text style={styles.sectionTitle}>Registered Teams</Text>
              </View>
              
              {tournament.teams.length > 0 ? (
                <FlatList
                  data={tournament.teams}
                  renderItem={renderTeamItem}
                  keyExtractor={item => item.id.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={styles.teamsList}
                />
              ) : (
                <View style={styles.noTeamsContainer}>
                  <MaterialCommunityIcons name="account-group-outline" size={40} color="#4B5563" />
                  <Text style={styles.noTeamsText}>No teams registered yet</Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
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
  header: {
    height: 100,
    justifyContent: 'center',
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  tournamentBanner: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tournamentLogoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 4,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  tournamentName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  tournamentDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  tournamentDate: {
    color: '#E5E7EB',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  infoCard: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoCardGradient: {
    padding: 16,
    borderRadius: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#E5E7EB',
    fontSize: 16,
    marginLeft: 12,
  },
  teamsList: {
    paddingTop: 8,
  },
  teamCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  teamCardGradient: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  teamLogoContainer: {
    padding: 4,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teamInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    marginTop: 8,
  },
  teamDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamLocation: {
    color: '#E5E7EB',
    fontSize: 14,
    marginLeft: 8,
  },
  teamPlayers: {
    color: '#E5E7EB',
    fontSize: 14,
    marginLeft: 8,
  },
  noTeamsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noTeamsText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: '#E5E7EB',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TournamentDetailsScreen; 