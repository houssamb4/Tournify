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

type Player = {
  id: number;
  name: string;
  age: number;
  profile_url: string | null;
  team_id: number;
  created_at: number;
  updated_at: number;
};

type Team = {
  id: number;
  name: string;
  location: string;
  logoUrl: string;
  created_at: number;
  updated_at: number;
  players: Player[];
};

const TeamDetailsScreen = () => {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
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
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      console.log('Fetching team details for ID:', teamId);
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('user');
      const userData = token ? JSON.parse(token) : null;

      const response = await axios.get(`${API_BASE_URL}/home/findATeam/${teamId}`, {
        headers: {
          Authorization: `Bearer ${userData?.token}`
        }
      });

      console.log('Team details received:', response.data.data);
      setTeam(response.data.data);
    } catch (err) {
      console.error('Error fetching team details:', err);
      setError('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.replace('/teams');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const renderPlayerItem = ({ item, index }: { item: Player, index: number }) => {
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
              <MaterialCommunityIcons name="account" size={24} color="#E5E7EB" />
            </View>
          </View>
          <View style={styles.playerInfo}>
            <View style={styles.playerNameRow}>
              <Text style={styles.playerName}>{item.name}</Text>
              <View style={styles.playerBadge}>
                <Text style={styles.playerBadgeText}>PLAYER</Text>
              </View>
            </View>
            <View style={styles.playerDetails}>
              <View style={styles.playerDetailItem}>
                <MaterialCommunityIcons name="calendar-account" size={16} color="#9CA3AF" />
                <Text style={styles.playerAge}>Age: {item.age}</Text>
              </View>
              <View style={styles.playerDetailItem}>
                <MaterialCommunityIcons name="calendar-clock" size={16} color="#9CA3AF" />
                <Text style={styles.playerAge}>Joined: {formatDate(item.created_at)}</Text>
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
              <Text style={styles.headerTitle}>Team Details</Text>
            </LinearGradient>
          </Animated.View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#818CF8" />
            <Text style={styles.loadingText}>Loading team details...</Text>
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

  if (error || !team) {
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
              <Text style={styles.headerTitle}>Team Details</Text>
            </LinearGradient>
          </Animated.View>
          
          <Animated.View 
            style={[styles.errorContainer, { opacity: fadeAnim, transform: [{ translateY }] }]}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#EF4444" />
            <Text style={styles.errorText}>{error || 'Team not found'}</Text>
            <Text style={styles.errorSubText}>We couldn't find the team you're looking for.</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                fetchTeamDetails();
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
            <Text style={styles.headerTitle}>Team Details</Text>
          </LinearGradient>
        </Animated.View>

        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY }] }]}>
            <View style={styles.teamBanner}>
              <View style={styles.teamLogoWrapper}>
                <Image 
                  source={{ uri: team.logoUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg_-fW2eate45Swr0JDF48P5e4Et_sfB1jfQ&s' }} 
                  style={styles.teamLogo}
                  defaultSource={require('@/assets/images/logo.png')}
                />
              </View>
              <Text style={styles.teamName}>{team.name}</Text>
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={16} color="#818CF8" />
                <Text style={styles.teamLocation}>{team.location}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY }, { scale: scaleAnim }] }]}>
            <LinearGradient
              colors={["rgba(31, 41, 55, 0.7)", "rgba(31, 41, 55, 0.4)"]}
              style={styles.infoCardGradient}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="information-outline" size={20} color="#818CF8" />
                <Text style={styles.sectionTitle}>Team Information</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#818CF8" />
                <Text style={styles.infoText}>Location: {team.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar" size={20} color="#818CF8" />
                <Text style={styles.infoText}>Created: {formatDate(team.created_at)}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-group" size={20} color="#818CF8" />
                <Text style={styles.infoText}>Players: {team.players.length}</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.infoCard, { opacity: fadeAnim, transform: [{ translateY }, { scale: scaleAnim }] }]}>
            <LinearGradient
              colors={["rgba(31, 41, 55, 0.7)", "rgba(31, 41, 55, 0.4)"]}
              style={styles.infoCardGradient}
            >
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="account-group" size={20} color="#818CF8" />
                <Text style={styles.sectionTitle}>Current Roster</Text>
              </View>
              
              {team.players.length > 0 ? (
                <FlatList
                  data={team.players}
                  renderItem={renderPlayerItem}
                  keyExtractor={item => item.id.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={styles.playersList}
                />
              ) : (
                <View style={styles.noPlayersContainer}>
                  <MaterialCommunityIcons name="account-off" size={40} color="#4B5563" />
                  <Text style={styles.noPlayersText}>No players in the roster yet</Text>
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
    padding: 8,
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
  teamBanner: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  teamLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#374151',
  },
  teamName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  teamLocation: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4F46E5',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoText: {
    color: '#E5E7EB',
    fontSize: 16,
    marginLeft: 12,
  },
  playerCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  playerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  playerAge: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  noPlayersText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 16,
  },
  /* loadingContainer defined above */
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111827',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorSubText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButtonGradient: {
    borderRadius: 8,
    padding: 12,
  },
  playerCardGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  playerAvatarContainer: {
    marginRight: 12,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  playerBadgeText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  infoCardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 70, 229, 0.5)',
    paddingBottom: 8,
    marginBottom: 12,
  },
  playersList: {
    paddingTop: 8,
  },
  noPlayersContainer: {
    alignItems: 'center',
    padding: 20,
  },
  teamLogoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default TeamDetailsScreen; 