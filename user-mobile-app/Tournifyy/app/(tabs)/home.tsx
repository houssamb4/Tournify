import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImageAssets from 'expo-asset';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Sample data
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
      image: 'https://cdn.sanity.io/images/dsfx7636/news/fa67b1c860bb6c695c0524695624f210913c4faf-1920x1080.jpg',
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
    { id: '3', name: 'League of Legends', icon: 'https://1000logos.net/wp-content/uploads/2020/09/League-of-Legends-Logo-768x432.png' },
    { id: '4', name: 'Dota 2', icon: 'https://i.pinimg.com/736x/8a/8b/50/8a8b50da2bc4afa933718061fe291520.jpg' },
    { id: '5', name: 'Overwatch 2', icon: 'https://example.com/overwatch2.png' },
    { id: '6', name: 'EA Sports FC 25', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfp9YfN9xQiPFhu3NmC-n8ZySfAYYDCtu9cw&s' },
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

  const renderTournamentCard = ({ item }: { item: Tournament }) => (
    <TouchableOpacity style={styles.tournamentCard}>
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
    </TouchableOpacity>
  );

  const renderLiveMatch = ({ item }: { item: LiveMatch }) => (
    <TouchableOpacity style={styles.liveMatchCard}>
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
          <Text style={styles.liveBadge}>{item.time}</Text>
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
    </TouchableOpacity>
  );

  const renderGameIcon = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.gameIconContainer}>
      <Image source={{ uri: item.icon }} style={styles.gameIcon} />
      <Text style={styles.gameNameText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Tournify</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/40?text=U' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <Text style={styles.searchText}>Search tournaments, teams, or games</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'featured' && styles.activeTab]}
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
        </View>

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
    <TouchableOpacity

    >
      <Text style={styles.seeAll}>See All</Text>
    </TouchableOpacity>
  </View>
  
  <FlatList
    data={[
      {
        id: '1',
        title: 'Evil Geniuses win Valorant Champions 2024',
        category: 'VALORANT',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb0T-fXW111uK3rBnlYZaZzdKPE97fobNF1Q&s',
        date: '2 hours ago'
      },
      {
        id: '2',
        title: 'Team Spirit dominates CS2 Major Copenhagen',
        category: 'COUNTER-STRIKE',
        image: 'https://i.ytimg.com/vi/N1SvByp6aRA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCyKuNg4TvZ5bGy_GgvbBG__FrY9Q',
        date: '1 day ago'
      },
      {
        id: '3',
        title: 'T1 signs record-breaking sponsorship deal',
        category: 'LEAGUE OF LEGENDS',
        image: 'https://esports-news.co.uk/wp-content/uploads/2022/05/t1-faker-caa-agency-1024x490.jpg',
        date: '3 days ago'
      },
      {
        id: '4',
        title: 'EA Sports FC Pro League announces $2M prize pool',
        category: 'EA SPORTS FC',
        image: 'https://cdn.oneesports.gg/cdn-data/wp-content/uploads/2019/08/pes2020-1024x576.jpg',
        date: '5 days ago'
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 40,
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
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  searchText: {
    color: '#9CA3AF',
    marginLeft: 10,
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 20,
  },
  tab: {
    paddingBottom: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tournamentList: {
    paddingBottom: 10,
  },
  tournamentCard: {
    width: 280,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
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
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  gameIcon: {
    width: 60,
    height: 60,
    aspectRatio: 1, 
    borderRadius: 12,
    resizeMode: 'cover', 
    marginBottom: 8,
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
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    marginBottom: 70, // Add this line
    flexDirection: 'row',
    alignItems: 'center',
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