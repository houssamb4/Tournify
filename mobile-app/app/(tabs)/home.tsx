import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  FlatList,
  RefreshControl,
  Platform,
  Animated,
  Dimensions,
  ImageBackground
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImageAssets from 'expo-asset';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

type RootStackParamList = {
  teams: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Tournament {
  id: string;
  title: string;
  image: string;
  status: 'ongoing' | 'upcoming';
  prize: string;
  participants: string;
  date: string;
  game: string;
}

interface LiveMatch {
  id: string;
  team1: string;
  team2: string;
  score: string;
  time: string;
  game: string;
  viewers: string;
}

interface Game {
  id: string;
  name: string;
  icon: string;
}

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('featured');
  const navigation = useNavigation<NavigationProp>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Header animation based on scroll
    scrollY.addListener(({ value }) => {
      if (value < 0) {
        return;
      }
      if (value > 100) {
        Animated.timing(headerTranslateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => {
      scrollY.removeAllListeners();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Add haptic feedback on refresh
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const featuredTournaments: Tournament[] = [
    {
      id: '1',
      title: 'VALORANT Champions 2025',
      game: 'Valorant',
      prize: '$1,000,000',
      participants: '256',
      date: 'avr 15 - 20, 2025',
      image: 'https://cdn.sanity.io/images/dsfx7636/news/fa67b1c860bb6c695c0524695624f210913c4faf-1920x1080.jpg',
      status: 'ongoing' as const
    },
    {
      id: '2',
      title: 'ESL Pro League Season 20',
      game: 'Counter-Strike 2',
      prize: '$500,000',
      participants: '128',
      date: 'Jul 5 - 10, 2025',
      image: 'https://ggscore.com/media/tournament/e8442.png',
      status: 'upcoming' as const
    },
    {
      id: '3',
      title: 'League of Legends World Championship 2025',
      game: 'League of Legends',
      prize: '$2,500,000',
      participants: '24',
      date: 'Oct 1 - Nov 5, 2025',
      image: 'https://egw.news/_next/image?url=https%3A%2F%2Fegw.news%2Fuploads%2Fnews%2F1%2F17%2F1737135854720_1737135854721.webp&w=1920&q=75',
      status: 'upcoming' as const
    }
  ];

  const liveMatches: LiveMatch[] = [
        {
        id: '1',
      team1: 'Team Liquid',
      team2: 'Fnatic',
      score: '13-11',
        time: 'LIVE',
      game: 'VALORANT',
      viewers: '45.2K'
        },
        {
        id: '2',
      team1: 'G2 Esports',
        team2: 'Natus Vincere',
      score: '16-14',
      time: 'LIVE',
        game: 'CS2',
      viewers: '32.1K'
    }
  ];

  const popularGames: Game[] = [
    { id: '1', name: 'VALORANT', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOCh4SCNM3fQZYCYrhOCxs7lcSmckk81FaWA&s' },
    { id: '2', name: 'Counter-Strike 2', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56MujMf06WSOTMQs7Q3om3t_dA76xCz0P2A&s' },
    { id: '3', name: 'League of Legends', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIKAJWJTNftN1A1mlEZOkI0F0ODvWAMUIOz7YJ1gwyTzv2F6MfIekpbhwcuNG0M-VyenE&usqp=CAU' },
    { id: '4', name: 'Dota 2', icon: 'https://i.pinimg.com/736x/8a/8b/50/8a8b50da2bc4afa933718061fe291520.jpg' },
    { id: '5', name: 'Overwatch 2', icon: 'https://images.steamusercontent.com/ugc/754843815918786990/AF1F6C37B54946B0329576A5DDA4AB424A248856/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false' },
    { id: '6', name: 'EA Sports FC 25', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ6B7-egqKSwsV6yhsrS5FC_e8Rz5xaGma4g&s' },
    { id: '7', name: 'Rocket League', icon: 'https://example.com/rocketleague.png' },
    { id: '8', name: 'Fortnite', icon: 'https://example.com/fortnite.png' },
    { id: '9', name: 'PUBG', icon: 'https://example.com/pubg.png' },
    { id: '10', name: 'Call of Duty: Warzone', icon: 'https://example.com/warzone.png' },
    { id: '11', name: 'Rainbow Six Siege', icon: 'https://example.com/r6s.png' },
    { id: '12', name: 'Apex Legends', icon: 'https://example.com/apex.png' },
    { id: '13', name: 'Street Fighter 6', icon: 'https://example.com/sf6.png' },
    { id: '14', name: 'Tekken 8', icon: 'https://example.com/tekken8.png' },
    { id: '15', name: 'Super Smash Bros. Ultimate', icon: 'https://example.com/smashbros.png' },
    { id: '16', name: 'Hearthstone', icon: 'https://example.com/hearthstone.png' },
    { id: '17', name: 'StarCraft II', icon: 'https://example.com/starcraft2.png' },
    { id: '18', name: 'Mobile Legends: Bang Bang', icon: 'https://example.com/mlbb.png' },
    { id: '19', name: 'Free Fire', icon: 'https://example.com/freefire.png' },
    { id: '20', name: 'Clash Royale', icon: 'https://example.com/clashroyale.png' },
    { id: '21', name: 'Arena of Valor', icon: 'https://example.com/aov.png' }
  ];  

  // Tournament card component - instead of using hooks inside renderItem
  const renderTournamentCard = ({ item }: { item: Tournament }) => {
    // Don't use hooks inside render functions
    // Use class-based animations or static styles instead
    
    const handlePress = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // Navigate to tournament details when implemented
      // navigation.navigate('tournamentDetails', { tournamentId: item.id });
    };
    
    return (
      <TouchableOpacity 
        style={styles.tournamentCard}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <LinearGradient
          colors={["rgba(31, 41, 55, 0.7)", "rgba(17, 24, 39, 0.8)"]}
          style={styles.tournamentGradient}
        >
          <Image source={{ uri: item.image }} style={styles.tournamentImage} />
          <View style={styles.tournamentOverlay} />
          <View style={styles.tournamentContent}>
            <View style={styles.tournamentStatus}>
              <Text style={[styles.statusText, { 
                backgroundColor: item.status === 'ongoing' ? '#EF4444' : '#3B82F6' 
              }]}>
                {item.status === 'ongoing' ? 'LIVE NOW' : 'COMING SOON'}
              </Text>
            </View>
            <Text style={styles.tournamentTitle}>{item.title}</Text>
            <View style={styles.tournamentDetails}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="trophy-outline" size={16} color="#E5E7EB" />
                <Text style={styles.detailText}>{item.prize}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="account-group-outline" size={16} color="#E5E7EB" />
                <Text style={styles.detailText}>{item.participants} teams</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="calendar-month-outline" size={16} color="#E5E7EB" />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Live match card component
  const renderLiveMatch = ({ item }: { item: LiveMatch }) => {
    const handlePress = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // Navigate to match details when implemented
      // navigation.navigate('matchDetails', { matchId: item.id });
    };
    
    return (
      <TouchableOpacity 
        style={styles.liveMatchCard}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <LinearGradient
          colors={["#1F2937", "#111827"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.matchCardGradient}
        >
          <View style={styles.matchTeams}>
            <View style={styles.teamContainer}>
              <Image 
                source={{ uri: `https://via.placeholder.com/50?text=${item.team1.substring(0, 2)}` }} 
                style={styles.teamLogo} 
              />
              <Text style={styles.teamName}>{item.team1}</Text>
            </View>
            <View style={styles.matchScore}>
              <Text style={styles.scoreText}>{item.score}</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.livePulse} />
                <Text style={styles.liveBadge}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.teamContainer}>
              <Image 
                source={{ uri: `https://via.placeholder.com/50?text=${item.team2.substring(0, 2)}` }} 
                style={styles.teamLogo} 
              />
              <Text style={styles.teamName}>{item.team2}</Text>
            </View>
          </View>
          <View style={styles.matchInfo}>
            <Text style={styles.gameName}>{item.game}</Text>
            <View style={styles.viewerInfo}>
              <MaterialCommunityIcons name="eye-outline" size={14} color="#9CA3AF" />
              <Text style={styles.viewerCount}>{item.viewers}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Game icon component
  const renderGameIcon = ({ item }: { item: Game }) => {
    const handlePress = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // Navigate to game details when implemented
      // navigation.navigate('gameDetails', { gameId: item.id });
    };
    
    return (
      <TouchableOpacity 
        style={styles.gameIconContainer}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <View style={styles.gameIconWrapper}>
          <Image source={{ uri: item.icon }} style={styles.gameIcon} />
        </View>
        <Text style={styles.gameNameText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

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
              <Image
                source={require('@/assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>Tournify</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      
        <Animated.ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#818CF8"
              colors={["#818CF8"]}
            />
          }
        >
        {/* Tabs */}
        <Animated.View style={[styles.tabsContainer, { opacity: fadeAnim, transform: [{ translateY }] }]}>
          <BlurView intensity={20} tint="dark" style={styles.tabsBlur}>
            <TouchableOpacity 
            style={[styles.tab, activeTab === 'featured' && styles.activeTab]}
            activeOpacity={0.7}
            onPress={() => setActiveTab('featured')}
          >
            <Text style={[styles.tabText, activeTab === 'featured' && styles.activeTabText]}>Featured</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'live' && styles.activeTab]}
            onPress={() => setActiveTab('live')}
          >
            <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
          </TouchableOpacity>
          </BlurView>
        </Animated.View>

        {/* Featured Tournaments */}
        {activeTab === 'featured' && (
          <>
            <Text style={styles.sectionTitle}>Featured Tournaments</Text>
            <FlatList
              data={featuredTournaments}
              renderItem={renderTournamentCard}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tournamentList}
            />
          </>
        )}

        {/* Live Matches */}
        {activeTab === 'live' && (
          <>
            <Text style={styles.sectionTitle}>Live Matches</Text>
            <FlatList
              data={liveMatches}
              renderItem={renderLiveMatch}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.liveMatchesList}
            />
          </>
        )}

        {/* Upcoming Tournaments */}
        {activeTab === 'upcoming' && (
          <>
          <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
          <FlatList
            data={featuredTournaments.filter(t => t.status === 'upcoming')}
            renderItem={renderTournamentCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tournamentList}
          />
        </>
        )}

        {/* Popular Games */}
        <Text style={styles.sectionTitle}>Popular Games</Text>
        <FlatList
          data={popularGames}
          renderItem={renderGameIcon}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesList}
        />

{/* Enhanced News Section */}
<View style={styles.newsSection}>
  <View style={styles.newsHeader}>
    <Text style={styles.sectionTitle}>Esports News</Text>
    <TouchableOpacity>
      <Text style={styles.seeAll}>See All</Text>
    </TouchableOpacity>
  </View>
  
  <FlatList
    data={[
      {
        id: '1',
        title: 'Evil Geniuses win Valorant Champions 2025',
        category: 'VALORANT',
        image: 'https://www.dexerto.com/cdn-image/wp-content/uploads/2023/08/26/Evil-Geniuses-Valorant-Champions-2023-trophy-1024x576.jpg?width=1200&quality=75&format=auto',
        date: '2 hours ago',
        backgroundColor: '#9031ef',
        href: '#'
      },
      {
        id: '2',
        title: 'Team Spirit dominates CS2 Major Copenhagen',
        category: 'COUNTER-STRIKE',
        image: 'https://i.ytimg.com/vi/N1SvByp6aRA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCyKuNg4TvZ5bGy_GgvbBG__FrY9Q',
        date: '1 day ago',
        backgroundColor: '#ca0909',
        href: '#'
      },
      {
        id: '3',
        title: 'T1 signs record-breaking sponsorship deal',
        category: 'LEAGUE OF LEGENDS',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt9FtmGA1gfvh21GfC4NNfAQW0SC79aoyf7Q&s',
        date: '3 days ago',
        backgroundColor: '#3157ef',
        href: '#'
      },
      {
        id: '4',
        title: 'EA Sports FC Pro League announces $2M prize pool',
        category: 'EA SPORTS FC',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoQHd4hGuUKRNCGwqlvKE-2hSRmuGPisUfTw&s',
        date: '5 days ago',
        backgroundColor: '#31ef68',
        href: '#'
      },
      {
        id: '5',
        title: 'Fortnite Lore – How Does the Storyline Work?',
        category: 'Fortnite',
        image: 'https://www.esports.net/wp-content/uploads/2024/03/PeelyRescueFortnite1.webp',
        date: 'May 14, 2025',
        backgroundColor: '#9031ef',
        href: 'https://www.esports.net/news/fortnite/fortnite-lore/'
      },
      {
        id: '6',
        title: 'Immortal Cup Season 1 embraces Chinese Dota 2 with retired all-star pros',
        category: 'Dota 2',
        image: 'https://www.esports.net/wp-content/uploads/2025/05/immortal-cup-s1-1.jpg',
        date: 'May 14, 2025',
        backgroundColor: '#ca0909',
        href: 'https://www.esports.net/news/dota/immortal-cup-dota-2/'
      },
      {
        id: '7',
        title: "Valve opens up on Crownfall's behind-the-scenes process and what they learnt",
        category: 'Dota 2',
        image: 'https://www.esports.net/wp-content/uploads/2025/05/a597e1b6e578dbaf54061d00ce734f703345c61b.jpg',
        date: 'May 14, 2025',
        backgroundColor: '#ca0909',
        href: 'https://www.esports.net/news/dota/valve-crown-of-thorns-blog/'
      }
    ]}
    horizontal
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.newsCard}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.newsImage}
        />
        <View style={styles.newsContent}>
          <Text style={styles.newsCategory}>{item.category}</Text>
          <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.newsDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    )}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.newsList}
  />
</View>

{/* Featured Teams Section */}
<View style={styles.teamsSection}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Featured Teams</Text>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('teams'); 
      }}
      >
      <Text style={styles.seeAll}>View All</Text>
    </TouchableOpacity>
  </View>
  
  <FlatList
    data={[
      {
        id: '1',
        name: 'Team Liquid',
        game: 'Multiple',
        logo: 'https://images.seeklogo.com/logo-png/52/2/team-liquid-logo-png_seeklogo-528696.png'
      },
      {
        id: '2',
        name: 'Fnatic',
        game: 'VALORANT, LoL',
        logo: 'https://yt3.googleusercontent.com/45NcTi6QgjDin4dzwRwu9eNoTv_YGKF7bs212w5GSMQKxLqKFLysduN5hK9oF7FVV4yr5Gtqonk=s900-c-k-c0x00ffffff-no-rj'
      },
      {
        id: '3',
        name: 'G2 Esports',
        game: 'CS2, LoL',
        logo: 'https://images.seeklogo.com/logo-png/40/1/g2-esport-logo-png_seeklogo-400454.png'
      },
      {
        id: '4',
        name: 'Natus Vincere',
        game: 'CS2, Dota 2',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Natus_Vincere_Logo.svg/1200px-Natus_Vincere_Logo.svg.png'
      },
      {
        id: '5',
        name: 'T1',
        game: 'League of Legends',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/T1_logo.svg/1200px-T1_logo.svg.png'
      }
    ]}
    horizontal
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.teamCard}>
        <Image 
          source={{ uri: item.logo }} 
          style={styles.teamLogo}
        />
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.name}</Text>
          <Text style={styles.teamGame}>{item.game}</Text>
        </View>
      </TouchableOpacity>
    )}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.teamsList}
  />
</View>
        </Animated.ScrollView>
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
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 90, // Increased to account for tab bar
    paddingTop: Platform.OS === 'ios' ? 120 : 110, // Added padding at top to account for header
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchBarContainer: {
    marginTop: 10, // Reduced as we've added paddingTop to contentContainer
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchBarBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchText: {
    color: '#9CA3AF',
    marginLeft: 10,
    fontSize: 14,
  },
  tabsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tabsBlur: {
    borderRadius: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(79, 70, 229, 0.3)',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    // Add shadow effect using React Native properties
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tournamentList: {
    paddingBottom: 10,
  },
  tournamentCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    // Web-compatible shadow
    boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)',
    elevation: 6,
  },
  tournamentGradient: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
  },
  tournamentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tournamentContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  tournamentStatus: {
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tournamentTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tournamentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  liveMatchesList: {
    paddingBottom: 10,
  },
  liveMatchCard: {
    borderRadius: 12,
    marginBottom: 12,
    // Web-compatible shadow
    boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)',
    elevation: 4,
    overflow: 'hidden',
  },
  matchCardGradient: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  teamName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  matchScore: {
    alignItems: 'center',
    flex: 1,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveBadge: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
  },
  gameName: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  viewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCount: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  gamesList: {
    paddingBottom: 20,
  },
  gameIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  gameIconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 14,
    padding: 2,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    // Web-compatible shadow
    boxShadow: '0px 2px 4px rgba(79, 70, 229, 0.2)',
    elevation: 3,
  },
  gameIcon: {
    width: 60,
    height: 60,
    aspectRatio: 1, 
    borderRadius: 12,
    resizeMode: 'cover',
  },  
  gameNameText: {
    color: 'white',
    fontSize: 12,
  },
  newsSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  newsCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 180,
  },
  newsContent: {
    padding: 16,
  },
  newsCategory: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  newsList: {
    paddingRight: 16,
    gap: 16,
  },
  teamsSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  teamsList: {
    paddingRight: 16,
  },
  teamCard: {
    width: 160,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Web-compatible shadow
    boxShadow: '0px 2px 3px rgba(79, 70, 229, 0.2)',
    elevation: 4,
  },

  teamInfo: {
    flex: 1,
  },

  teamGame: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameLogoSmall: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  tournamentName: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  viewerCountText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },


  matchScoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  livePulse: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    left: 6,
  },
  liveBadgeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;