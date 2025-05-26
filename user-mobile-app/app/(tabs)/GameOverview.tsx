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
  TextInput,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';

interface Game {
  id: string;
  name: string;
  icon: string;
  activePlayers: string;
  tournaments: string;
  genre: string;
  developer: string;
}

interface Tournament {
  id: string;
  name: string;
  date: string;
  prizePool: string;
  teams: string;
  format: string;
  status: string;
  matches?: Match[];
  winner?: string;
  finalScore?: string;
}

interface Match {
  id: string;
  team1: string;
  team2: string;
  time: string;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  rank: number;
  wins: number;
  losses: number;
}

interface Player {
  id: string;
  name: string;
  team: string;
  role: string;
  kda: string;
  photo: string;
}

interface RecentMatch {
  id: string;
  team1: string;
  team2: string;
  score: string;
  date: string;
  event: string;
}

interface LeaderboardItem {
  rank: number;
  team: string;
  points: number;
  winRate: string;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
}

interface RouteParams {
  game: Game;
}

type GameOverviewRouteProp = RouteProp<{ GameOverview: RouteParams }, 'GameOverview'>;

interface GameOverviewProps {
  route: GameOverviewRouteProp;
}

const GameOverview: React.FC<GameOverviewProps> = ({ route }) => {
  const { game } = route.params || {
    id: '1',
    name: 'Valorant',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxhjYniqXU_9z5dMfSIK0eh-yn8A-qeE9Nmw&s',
    activePlayers: '15M',
    tournaments: '245',
    genre: 'FPS',
    developer: 'Riot Games'
  };

  const [activeTab, setActiveTab] = useState('tournaments');
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);

  // Sample data
  const upcomingTournaments = [
    {
      id: '1',
      name: 'Valorant Champions 2025',
      date: 'Aug 15 - Sep 10, 2025',
      prizePool: '$2,500,000',
      teams: '16',
      format: 'Double Elimination',
      status: 'Upcoming',
      matches: [
        { id: 'm1', team1: 'Fnatic', team2: 'Sentinels', time: 'Aug 15, 18:00 UTC' },
        { id: 'm2', team1: 'Team Liquid', team2: 'Optic Gaming', time: 'Aug 16, 18:00 UTC' }
      ]
    },
    {
      id: '2',
      name: 'VCT Masters Tokyo',
      date: 'Jun 10-25, 2025',
      prizePool: '$1,000,000',
      teams: '12',
      format: 'Group Stage + Playoffs',
      status: 'Upcoming'
    }
  ];

  const pastTournaments: Tournament[] = [
    {
      id: '3',
      name: 'Valorant Champions 2024',
      date: 'Aug 1-30, 2024',
      winner: 'Fnatic',
      prizePool: '$2,000,000',
      teams: '16',
      finalScore: '3-1',
      format: 'Double Elimination',
      status: 'completed'
    },
    {
      id: '4',
      name: 'VCT Masters Madrid',
      date: 'Mar 14-28, 2024',
      winner: 'Sentinels',
      prizePool: '$1,000,000',
      teams: '12',
      finalScore: '3-2',
      format: 'Group Stage + Playoffs',
      status: 'completed'
    }
  ];

  const topTeams = [
    { id: '1', name: 'Fnatic', logo: 'https://yt3.googleusercontent.com/45NcTi6QgjDin4dzwRwu9eNoTv_YGKF7bs212w5GSMQKxLqKFLysduN5hK9oF7FVV4yr5Gtqonk=s900-c-k-c0x00ffffff-no-rj', rank: 1, wins: 24, losses: 5 },
    { id: '2', name: 'Sentinels', logo: 'https://images.seeklogo.com/logo-png/40/1/g2-esport-logo-png_seeklogo-400454.png', rank: 2, wins: 22, losses: 7 },
    { id: '3', name: 'Team Liquid', logo: 'https://images.seeklogo.com/logo-png/52/2/team-liquid-logo-png_seeklogo-528696.png', rank: 3, wins: 20, losses: 8 }
  ];

  const topPlayers = [
    { id: '1', name: 'TenZ', team: 'Sentinels', role: 'Duelist', kda: '1.35', photo: 'https://via.placeholder.com/80?text=TenZ' },
    { id: '2', name: 'Derke', team: 'Fnatic', role: 'Duelist', kda: '1.30', photo: 'https://via.placeholder.com/80?text=Derke' },
    { id: '3', name: 'Scream', team: 'Team Liquid', role: 'Entry Fragger', kda: '1.28', photo: 'https://via.placeholder.com/80?text=Scream' }
  ];

  const recentMatches = [
    { id: '1', team1: 'Fnatic', team2: 'Sentinels', score: '2-1', date: 'May 15, 2025', event: 'VCT EMEA' },
    { id: '2', team1: 'Team Liquid', team2: 'Optic Gaming', score: '2-0', date: 'May 10, 2025', event: 'VCT Americas' },
    { id: '3', team1: 'DRX', team2: 'Paper Rex', score: '1-2', date: 'May 8, 2025', event: 'VCT Pacific' }
  ];

  const leaderboard = [
    { rank: 1, team: 'Fnatic', points: 450, winRate: '82%' },
    { rank: 2, team: 'Sentinels', points: 420, winRate: '78%' },
    { rank: 3, team: 'Team Liquid', points: 400, winRate: '75%' },
    { rank: 4, team: 'Optic Gaming', points: 380, winRate: '72%' },
    { rank: 5, team: 'DRX', points: 350, winRate: '70%' }
  ];

  const news = [
    { id: '1', title: 'New Agent "Havoc" Coming in Next Update', date: 'May 20, 2025', source: 'Valorant Official' },
    { id: '2', title: 'Fnatic Signs New Coach Ahead of Champions', date: 'May 18, 2025', source: 'ESPN Esports' },
    { id: '3', title: 'Map Pool Changes for Next Competitive Season', date: 'May 15, 2025', source: 'Valorant Patch Notes' }
  ];

  const renderTournamentItem = ({ item }: { item: Tournament }) => (
    <View style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <Text style={styles.tournamentName}>{item.name}</Text>
        <Text style={styles.tournamentDate}>{item.date}</Text>
      </View>
      <View style={styles.tournamentDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="trophy" size={16} color="#E5E7EB" />
          <Text style={styles.detailText}>Prize: {item.prizePool}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account-group" size={16} color="#E5E7EB" />
          <Text style={styles.detailText}>{item.teams} teams</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="format-list-bulleted" size={16} color="#E5E7EB" />
          <Text style={styles.detailText}>Format: {item.format}</Text>
        </View>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'Upcoming' ? '#3B82F6' : '#10B981'
        }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      {expandedTournament === item.id && item.matches && (
        <View style={styles.matchesContainer}>
          <Text style={styles.sectionSubtitle}>Upcoming Matches:</Text>
          {item.matches.map(match => (
            <View key={match.id} style={styles.matchItem}>
              <View style={styles.matchTeams}>
                <Text style={styles.teamName}>{match.team1}</Text>
                <Text style={styles.vsText}>vs</Text>
                <Text style={styles.teamName}>{match.team2}</Text>
              </View>
              <Text style={styles.matchTime}>{match.time}</Text>
              <TouchableOpacity style={styles.watchButton}>
                <Text style={styles.watchButtonText}>Set Reminder</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.expandButton}
        onPress={() => setExpandedTournament(expandedTournament === item.id ? null : item.id)}
      >
        <Text style={styles.expandButtonText}>
          {expandedTournament === item.id ? 'Show Less' : 'Show Matches'}
        </Text>
        <MaterialCommunityIcons 
          name={expandedTournament === item.id ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#4F46E5" 
        />
      </TouchableOpacity>
    </View>
  );

  const renderPastTournamentItem = ({ item }: { item: Tournament }) => (
    <View style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <Text style={styles.tournamentName}>{item.name}</Text>
        <Text style={styles.tournamentDate}>{item.date}</Text>
      </View>
      <View style={styles.tournamentDetails}>
        <Text style={styles.winnerText}>Winner: {item.winner}</Text>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="trophy" size={16} color="#E5E7EB" />
          <Text style={styles.detailText}>Prize: {item.prizePool}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account-group" size={16} color="#E5E7EB" />
          <Text style={styles.detailText}>{item.teams} teams</Text>
        </View>
        <Text style={styles.finalScore}>Final Score: {item.finalScore}</Text>
      </View>
      <TouchableOpacity style={styles.resultsButton}>
        <Text style={styles.resultsButtonText}>View Results</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TouchableOpacity style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamRank}>#{item.rank}</Text>
        <Image source={{ uri: item.logo }} style={styles.teamLogo} />
        <Text style={styles.teamNameStyle}>{item.name}</Text>
      </View>
      <View style={styles.teamStats}>
        <Text style={styles.teamStat}>W: {item.wins}</Text>
        <Text style={styles.teamStat}>L: {item.losses}</Text>
        <Text style={styles.teamStat}>Win Rate: Math.round((item.wins / (item.wins + item.losses)) * 100))%</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity style={styles.playerCard}>
      <Image source={{ uri: item.photo }} style={styles.playerPhoto} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerTeam}>{item.team} • {item.role}</Text>
        <Text style={styles.playerStat}>KDA: {item.kda}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const renderMatchItem = ({ item }: { item: RecentMatch }) => (
    <View style={styles.matchCard}>
      <Text style={styles.matchEvent}>{item.event}</Text>
      <View style={styles.matchTeams}>
        <Text style={styles.matchTeamName}>{item.team1}</Text>
        <Text style={styles.matchScore}>{item.score}</Text>
        <Text style={styles.matchTeamName}>{item.team2}</Text>
      </View>
      <Text style={styles.matchDate}>{item.date}</Text>
      <TouchableOpacity style={styles.vodButton}>
        <Text style={styles.vodButtonText}>Watch VOD</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLeaderboardItem = ({ item }: { item: LeaderboardItem }) => (
    <View style={styles.leaderboardRow}>
      <Text style={styles.leaderboardRank}>{item.rank}</Text>
      <Text style={styles.leaderboardTeam}>{item.team}</Text>
      <Text style={styles.leaderboardPoints}>{item.points}</Text>
      <Text style={styles.leaderboardWinRate}>{item.winRate}</Text>
    </View>
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.newsItem}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsMeta}>{item.source} • {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Game Header */}
        <View style={styles.gameHeader}>
          <Image source={{ uri: game.icon }} style={styles.gameLogo} />
          <Text style={styles.gameTitle}>{game.name}</Text>
          <Text style={styles.gameDeveloper}>{game.developer}</Text>
          <View style={styles.gameStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{game.activePlayers}</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{game.tournaments}</Text>
              <Text style={styles.statLabel}>Tournaments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{game.genre}</Text>
              <Text style={styles.statLabel}>Genre</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]}
            onPress={() => setActiveTab('tournaments')}
          >
            <Text style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]}>Tournaments</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'teams' && styles.activeTab]}
            onPress={() => setActiveTab('teams')}
          >
            <Text style={[styles.tabText, activeTab === 'teams' && styles.activeTabText]}>Teams</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'players' && styles.activeTab]}
            onPress={() => setActiveTab('players')}
          >
            <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>Players</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'tournaments' && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
            <FlatList
              data={upcomingTournaments}
              renderItem={renderTournamentItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
            
            <Text style={styles.sectionTitle}>Past Tournaments</Text>
            <FlatList
              data={pastTournaments}
              renderItem={renderPastTournamentItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}

        {activeTab === 'teams' && (
          <>
            <Text style={styles.sectionTitle}>Top Teams</Text>
            <FlatList
              data={topTeams}
              renderItem={renderTeamItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
            
            <Text style={styles.sectionTitle}>Recent Matches</Text>
            <FlatList
              data={recentMatches}
              renderItem={renderMatchItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}

        {activeTab === 'players' && (
          <>
            <Text style={styles.sectionTitle}>Top Players</Text>
            <FlatList
              data={topPlayers}
              renderItem={renderPlayerItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
            
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.leaderboardHeaderText}>Rank</Text>
              <Text style={styles.leaderboardHeaderText}>Team</Text>
              <Text style={styles.leaderboardHeaderText}>Points</Text>
              <Text style={styles.leaderboardHeaderText}>Win Rate</Text>
            </View>
            <FlatList
              data={leaderboard}
              renderItem={renderLeaderboardItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <Text style={styles.sectionTitle}>Game Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statCardTitle}>Most Played Agent</Text>
                <Text style={styles.statCardValue}>Jett</Text>
                <Text style={styles.statCardSubtext}>Pick Rate: 32%</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardTitle}>Highest Win Rate</Text>
                <Text style={styles.statCardValue}>Brimstone</Text>
                <Text style={styles.statCardSubtext}>56% Win Rate</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>News & Updates</Text>
            <FlatList
              data={news}
              renderItem={renderNewsItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}
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
  gameHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 16,
  },
  gameLogo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  gameTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameDeveloper: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 16,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9CA3AF',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionSubtitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  tournamentCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tournamentName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  tournamentDate: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tournamentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#E5E7EB',
    fontSize: 14,
    marginLeft: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  winnerText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  finalScore: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 8,
  },
  matchesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchItem: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  teamName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  vsText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginHorizontal: 8,
  },
  matchTime: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  watchButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  watchButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  expandButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  resultsButton: {
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 12,
  },
  resultsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  teamCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamRank: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    width: 30,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  teamNameStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  teamStat: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  playerCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerTeam: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  playerStat: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  matchCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  matchEvent: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  matchTeamName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  matchScore: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  matchDate: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  vodButton: {
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  vodButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 2,
  },
  leaderboardHeaderText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
    marginBottom: 2,
  },
  leaderboardRank: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  leaderboardTeam: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'center',
  },
  leaderboardPoints: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  leaderboardWinRate: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statCardTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  statCardValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  newsItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  newsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  newsMeta: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});

export default GameOverview;