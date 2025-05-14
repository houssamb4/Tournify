import React, { useState, useEffect } from 'react';
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
  SectionList,
  Animated,
  Linking
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import CountdownTimer from '../../components/CountdownTimer';

interface Tournament {
  id: string;
  title: string;
  game: string;
  prize: string;
  participants: number;
  date: string;
  image: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  organizer?: string;
  location?: string;
  teams?: string[];
  currentRound?: string;
  timeLeft?: string;
  entryFee?: string;
  tournamentType?: string;
  rules?: string[];
  winner?: string;
  runnerUp?: string;
  highlightMatch?: string;
  stats?: {
    [key: string]: string | number;
  };
  registrationDeadline?: string;
}

interface LeaderboardItem {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatar: string;
}

interface Section {
  title: string;
  data: Tournament[];
}

interface SectionHeader {
  section: {
    title: string;
  };
}

interface RenderItemProps<T> {
  item: T;
  index: number;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

const TournamentsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('current');
  const [activeTab, setActiveTab] = useState('tournaments');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Tournament data organized by status
  const tournamentData: Section[] = [
    {
      title: '🔥 Current Tournaments',
      data: [
        {
          id: '1',
          title: 'Valorant Champions 2025',
          game: 'Valorant',
          prize: '$1,000,000',
          participants: 16,
          date: 'Apr 15 - 20, 2025',
          image: 'https://cdn.sanity.io/images/dsfx7636/news/fa67b1c860bb6c695c0524695624f210913c4faf-1920x1080.jpg',
          status: 'ongoing',
          organizer: 'Riot Games',
          location: 'Los Angeles, USA',
          teams: ['Fnatic', 'G2 Esports', 'Team Liquid', 'DRX', 'Optic Gaming', 'Sentinels'],
          currentRound: 'Finals',
          timeLeft: '2025-04-20T20:00:00', // ISO format for CountdownTimer
          entryFee: 'Free',
          tournamentType: 'Single Elimination',
          rules: [
            'Best of 3 matches until finals',
            'Best of 5 for finals',
            'No map repeats in a match',
            'Overtime rules apply'
          ]
        },
        {
          id: '2',
          title: 'ESL Pro League Season 19',
          game: 'CS2',
          prize: '$750,000',
          participants: 24,
          date: 'Apr 10 - May 5, 2025',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX0D3Kop5-EMei5al2yTEDVMdBQ0xSnXyeZA&s',
          status: 'ongoing',
          organizer: 'ESL',
          location: 'Cologne, Germany',
          teams: ['Natus Vincere', 'FaZe Clan', 'Heroic', 'Vitality', 'G2 Esports', 'Cloud9'],
          currentRound: 'Quarterfinals',
          timeLeft: '2025-05-01T18:00:00',
          entryFee: '50 Tokens',
          tournamentType: 'Double Elimination',
          rules: [
            'Best of 1 in early rounds',
            'Best of 3 from quarterfinals',
            'MR12 format',
            'Knife for side choice'
          ]
        }
      ]
    },
    {
      title: '⏳ Upcoming Tournaments',
      data: [
        {
          id: '3',
          title: 'League of Legends Worlds 2025',
          game: 'League of Legends',
          prize: '$2,500,000',
          participants: 24,
          date: 'Oct 1 - Nov 5, 2025',
          image: 'https://egw.news/_next/image?url=https%3A%2F%2Fegw.news%2Fuploads%2Fnews%2F1%2F17%2F1737135854720_1737135854721.webp&w=1920&q=75',
          status: 'upcoming',
          organizer: 'Riot Games',
          location: 'Multiple Cities',
          teams: ['T1', 'Gen.G', 'JD Gaming', 'G2 Esports', 'Cloud9', 'Fnatic'],
          registrationDeadline: '2025-09-20',
          entryFee: '100 Tokens',
          tournamentType: 'Group Stage + Playoffs',
          rules: [
            'Groups of 4 teams',
            'Double round robin',
            'Top 2 advance to playoffs',
            'Best of 5 in playoffs'
          ]
        },
        {
          id: '4',
          title: 'The International 2025',
          game: 'Dota 2',
          prize: '$15,000,000+',
          participants: 18,
          date: 'Aug 15 - Sep 3, 2025',
          image: 'https://cdn1.dotesports.com/wp-content/uploads/2021/10/07112641/TI10-Group-Stage-Day-4.jpg',
          status: 'upcoming',
          organizer: 'Valve',
          location: 'Seattle, USA',
          teams: ['Team Spirit', 'PSG.LGD', 'OG', 'Evil Geniuses', 'Team Secret', 'Tundra Esports'],
          registrationDeadline: '2025-07-30',
          entryFee: 'Free',
          tournamentType: 'Main Event',
          rules: [
            'Group stage into double elimination',
            'Best of 3 until finals',
            'Best of 5 finals',
            'All heroes available'
          ]
        }
      ]
    },
    {
      title: '🏆 Past Tournaments',
      data: [
        {
          id: '5',
          title: 'Six Invitational 2025',
          game: 'Rainbow Six Siege',
          prize: '$3,000,000',
          participants: 20,
          date: 'Feb 10-25, 2025',
          image: 'https://cdn1.dotesports.com/wp-content/uploads/2023/02/10113341/SI23_KeyArt_16x9.jpg',
          status: 'completed',
          winner: 'Team BDS',
          runnerUp: 'FaZe Clan',
          highlightMatch: 'BDS vs FaZe (3-2)',
          stats: {
            totalMatches: 78,
            mostPickedOperator: 'Valkyrie',
            averageMatchDuration: '22m 45s'
          }
        },
        {
          id: '6',
          title: 'Apex Legends Global Series',
          game: 'Apex Legends',
          prize: '$2,000,000',
          participants: 40,
          date: 'Jan 15-30, 2025',
          image: 'https://cdn1.dotesports.com/wp-content/uploads/2022/07/07135318/ALGS-Championship-2022.jpg',
          status: 'completed',
          winner: 'TSM',
          runnerUp: 'NRG',
          highlightMatch: 'TSM vs NRG (Final Match)',
          stats: {
            totalMatches: 120,
            mostPickedLegend: 'Horizon',
            averageKillsPerMatch: 9.2
          }
        }
      ]
    }
  ];

  // Leaderboard data
  const leaderboardData = [
    { id: '1', username: 'ProPlayer99', score: 2450, rank: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', username: 'ChampionX', score: 2385, rank: 2, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '3', username: 'GameMaster', score: 2300, rank: 3, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '4', username: 'EsportsKing', score: 2250, rank: 4, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: '5', username: 'VictoryRoyale', score: 2200, rank: 5, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  ];

  // Filtered data based on active filter
  const filteredData = activeFilter === 'current' 
    ? tournamentData.filter(section => section.title.includes('Current'))
    : activeFilter === 'upcoming'
    ? tournamentData.filter(section => section.title.includes('Upcoming'))
    : tournamentData.filter(section => section.title.includes('Past'));

  const renderTournamentItem = ({ item }: RenderItemProps<Tournament>) => (
    <Animated.View style={[styles.tournamentCard, { opacity: fadeAnim }]}>
      <Image source={{ uri: item.image }} style={styles.tournamentImage} />
      <View style={styles.tournamentOverlay} />
      <View style={styles.tournamentContent}>
        <View style={styles.tournamentStatus}>
          <Text style={[styles.statusText, { 
            backgroundColor: item.status === 'ongoing' ? '#EF4444' : 
                          item.status === 'upcoming' ? '#3B82F6' : '#10B981'
          }]}>
            {item.status === 'ongoing' ? 'LIVE NOW' : 
             item.status === 'upcoming' ? 'COMING SOON' : 'COMPLETED'}
          </Text>
        </View>
        <Text style={styles.tournamentTitle}>{item.title}</Text>
        
        <View style={styles.tournamentGame}>
          <Image 
            source={{ 
              uri: item.game === 'Valorant' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxhjYniqXU_9z5dMfSIK0eh-yn8A-qeE9Nmw&s' :
                    item.game === 'CS2' ? 'https://images.seeklogo.com/logo-png/53/1/counter-strike-2-logo-png_seeklogo-534313.png' :
                    item.game === 'League of Legends' ? 'https://logo-marque.com/wp-content/uploads/2020/11/League-of-Legends-Embleme.png' :
                    item.game === 'Dota 2' ? 'https://logowik.com/content/uploads/images/dota-2-black8002.logowik.com.webp' :
                    item.game === 'Rocket League' ? 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Rocket_League_coverart.jpg' :
                    item.game === 'Rainbow Six Siege' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Tom_Clancy%27s_Rainbow_Six_Siege_logo.svg/1200px-Tom_Clancy%27s_Rainbow_Six_Siege_logo.svg.png' :
                    item.game === 'Apex Legends' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apex_legends_logo.png/1200px-Apex_legends_logo.png' :
                    'https://via.placeholder.com/50'
            }} 
            style={styles.gameLogo} 
          />
          <Text style={styles.gameName}>{item.game}</Text>
        </View>
        
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
        
        {item.status === 'ongoing' && (
          <View style={styles.currentRoundContainer}>
            <Text style={styles.currentRoundLabel}>Current Round:</Text>
            <Text style={styles.currentRoundText}>{item.currentRound}</Text>
            {item.timeLeft && <CountdownTimer targetDate={item.timeLeft} />}
          </View>
        )}
        
        {item.status === 'upcoming' && (
          <View style={styles.registrationInfo}>
            <Text style={styles.registrationText}>
              Registration closes: {item.registrationDeadline ? new Date(item.registrationDeadline).toLocaleDateString() : 'TBA'}
            </Text>
            <Text style={styles.entryFeeText}>Entry: {item.entryFee || 'Free'}</Text>
          </View>
        )}
        
        {item.status === 'completed' && (
          <View style={styles.winnerContainer}>
            <View style={styles.winnerInfo}>
              <Text style={styles.winnerLabel}>Winner:</Text>
              <Text style={styles.winnerName}>{item.winner}</Text>
            </View>
            <View style={styles.matchHighlight}>
              <Text style={styles.highlightLabel}>Highlight Match:</Text>
              <Text style={styles.highlightText}>{item.highlightMatch}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.buttonGroup}>
          {item.status === 'ongoing' ? (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.watchButtonStyle]}>
                <MaterialCommunityIcons name="play-circle-outline" size={16} color="white" />
                <Text style={styles.watchButtonTextStyle}>WATCH LIVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <MaterialCommunityIcons name="information-outline" size={16} color="#4F46E5" />
                <Text style={styles.secondaryButtonText}>TOURNAMENT INFO</Text>
              </TouchableOpacity>
            </>
          ) : item.status === 'upcoming' ? (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.joinButton]}>
                <MaterialCommunityIcons name="account-plus-outline" size={16} color="white" />
                <Text style={styles.joinButtonText}>JOIN TOURNAMENT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <MaterialCommunityIcons name="information-outline" size={16} color="#4F46E5" />
                <Text style={styles.secondaryButtonText}>MORE DETAILS</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.watchButtonStyle]}>
                <MaterialCommunityIcons name="play-circle-outline" size={16} color="white" />
                <Text style={styles.watchButtonTextStyle}>WATCH REPLAY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <MaterialCommunityIcons name="trophy-outline" size={16} color="#4F46E5" />
                <Text style={styles.secondaryButtonText}>FULL RESULTS</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderLeaderboardItem = ({ item, index }: RenderItemProps<LeaderboardItem>) => (
    <View style={styles.leaderboardCard}>
      <View style={styles.leaderboardRank}>
        <Text style={[styles.rankText, index < 3 && styles.topRankText]}>{item.rank}</Text>
      </View>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.leaderboardInfo}>
        <Text style={styles.usernameText}>{item.username}</Text>
        <Text style={styles.scoreText}>{item.score} pts</Text>
      </View>
      {index < 3 && (
        <View style={styles.prizeBadge}>
          <MaterialCommunityIcons 
            name="trophy" 
            size={16} 
            color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
          />
          <Text style={styles.prizeText}>
            {index === 0 ? '$5,000' : index === 1 ? '$2,500' : '$1,000'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderHowItWorks = () => (
    <View style={styles.howItWorksContainer}>
      <Text style={styles.sectionTitle}>How Tournaments Work</Text>
      
      <View style={styles.stepContainer}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>1</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Find a Tournament</Text>
          <Text style={styles.stepDescription}>
            Browse current or upcoming tournaments that match your skill level and game preference.
          </Text>
        </View>
      </View>
      
      <View style={styles.stepContainer}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>2</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Register or Join</Text>
          <Text style={styles.stepDescription}>
            Some tournaments are free, others may require an entry fee. Check the details before joining.
          </Text>
        </View>
      </View>
      
      <View style={styles.stepContainer}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>3</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Check Schedule</Text>
          <Text style={styles.stepDescription}>
            Tournament matches will be scheduled. Make sure you're available at the designated times.
          </Text>
        </View>
      </View>
      
      <View style={styles.stepContainer}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>4</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Compete & Win</Text>
          <Text style={styles.stepDescription}>
            Play your matches, advance through the brackets, and climb the leaderboard to win prizes!
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.tutorialButton}
        onPress={() => Linking.openURL('https://youtube.com/tutorial-link')}
      >
        <MaterialCommunityIcons name="play-circle-outline" size={20} color="#4F46E5" />
        <Text style={styles.tutorialButtonText}>Watch Tournament Tutorial</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRulesSection = ({ item }: RenderItemProps<Tournament>) => (
    <View style={styles.rulesCard}>
      <Text style={styles.rulesTitle}>{item.title} Rules</Text>
      <View style={styles.rulesList}>
        {item.rules?.map((rule: string, index: number) => (
          <View key={index} style={styles.ruleItem}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.tournamentType}>Type: {item.tournamentType}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }: SectionHeader) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderCTASection = () => (
    <View style={styles.ctaContainer}>
      <Text style={styles.ctaTitle}>Ready to Take Your Game to the Next Level?</Text>
      
      <TouchableOpacity style={[styles.ctaButton, styles.createButton]}>
        <FontAwesome5 name="plus-circle" size={20} color="white" />
        <Text style={styles.createButtonText}>Start Your Own Tournament</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.ctaButton, styles.inviteButton]}>
        <Ionicons name="people" size={20} color="#4F46E5" />
        <Text style={styles.inviteButtonText}>Invite Friends to Compete</Text>
      </TouchableOpacity>
    </View>
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
            <Text style={styles.headerTitle}>Tournaments</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialCommunityIcons name="magnify" size={24} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <TouchableOpacity 
            style={[styles.navTab, activeTab === 'tournaments' && styles.activeNavTab]}
            onPress={() => setActiveTab('tournaments')}
          >
            <MaterialCommunityIcons name="trophy" size={20} color={activeTab === 'tournaments' ? '#4F46E5' : '#9CA3AF'} />
            <Text style={[styles.navTabText, activeTab === 'tournaments' && styles.activeNavTabText]}>Tournaments</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navTab, activeTab === 'leaderboard' && styles.activeNavTab]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <MaterialCommunityIcons name="podium" size={20} color={activeTab === 'leaderboard' ? '#4F46E5' : '#9CA3AF'} />
            <Text style={[styles.navTabText, activeTab === 'leaderboard' && styles.activeNavTabText]}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navTab, activeTab === 'howitworks' && styles.activeNavTab]}
            onPress={() => setActiveTab('howitworks')}
          >
            <MaterialCommunityIcons name="information-outline" size={20} color={activeTab === 'howitworks' ? '#4F46E5' : '#9CA3AF'} />
            <Text style={[styles.navTabText, activeTab === 'howitworks' && styles.activeNavTabText]}>How It Works</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'tournaments' && (
          <>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'current' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('current')}
              >
                <View style={styles.liveBadgeContainer}>
                  {activeFilter === 'current' && <View style={styles.livePulse} />}
                  <Text style={[styles.filterText, activeFilter === 'current' && styles.activeFilterText]}>Current</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'upcoming' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('upcoming')}
              >
                <Text style={[styles.filterText, activeFilter === 'upcoming' && styles.activeFilterText]}>Upcoming</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterTab, activeFilter === 'past' && styles.activeFilterTab]}
                onPress={() => setActiveFilter('past')}
              >
                <Text style={[styles.filterText, activeFilter === 'past' && styles.activeFilterText]}>Past</Text>
              </TouchableOpacity>
            </View>

            {/* Featured Tournament Highlight */}
            {activeFilter === 'current' && (
              <View style={styles.featuredSection}>
                <Text style={styles.sectionTitle}>Featured Tournament</Text>
                <TouchableOpacity style={styles.featuredCard}>
                  <Image 
                    source={{ uri: 'https://cdn.sanity.io/images/dsfx7636/news/fa67b1c860bb6c695c0524695624f210913c4faf-1920x1080.jpg' }} 
                    style={styles.featuredImage}
                  />
                  <View style={styles.featuredOverlay} />
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredStatus}>LIVE NOW</Text>
                    <Text style={styles.featuredTitle}>VALORANT CHAMPIONS 2025</Text>
                    <View style={styles.featuredTeams}>
                      <View style={styles.teamPreview}>
                        <Image 
                          source={{ uri: 'https://via.placeholder.com/50?text=TL' }} 
                          style={styles.teamLogoSmall}
                        />
                        <Text style={styles.teamName}>Team Liquid</Text>
                      </View>
                      <Text style={styles.vsText}>VS</Text>
                      <View style={styles.teamPreview}>
                        <Image 
                          source={{ uri: 'https://via.placeholder.com/50?text=DRX' }} 
                          style={styles.teamLogoSmall}
                        />
                        <Text style={styles.teamName}>DRX</Text>
                      </View>
                    </View>
                    <Text style={styles.featuredPrize}>$1,000,000 PRIZE POOL</Text>
                    <View style={styles.currentRoundContainer}>
                      <Text style={styles.currentRoundLabel}>Current Round: Finals</Text>
                      <CountdownTimer targetDate="2025-04-20T20:00:00" />
                    </View>
                    <TouchableOpacity style={styles.watchButton}>
                      <MaterialCommunityIcons name="play-circle-outline" size={20} color="white" />
                      <Text style={styles.watchButtonText}>WATCH FINALS</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Tournament List */}
            <SectionList
              sections={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={renderTournamentItem}
              renderSectionHeader={renderSectionHeader}
              contentContainerStyle={styles.sectionList}
              stickySectionHeadersEnabled={false}
            />

            {/* Rules Section */}
            {activeFilter === 'current' && (
              <View style={styles.rulesSection}>
                <Text style={styles.sectionTitle}>Tournament Rules</Text>
                <FlatList
                  data={tournamentData[0].data} // Current tournaments
                  renderItem={renderRulesSection}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rulesListContainer}
                />
              </View>
            )}

            {/* CTA Section */}
            {renderCTASection()}
          </>
        )}

        {activeTab === 'leaderboard' && (
          <View style={styles.leaderboardContainer}>
            <Text style={styles.sectionTitle}>Global Leaderboard</Text>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.leaderboardHeaderText}>Rank</Text>
              <Text style={styles.leaderboardHeaderText}>Player</Text>
              <Text style={styles.leaderboardHeaderText}>Score</Text>
            </View>
            <FlatList
              data={leaderboardData}
              renderItem={renderLeaderboardItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.leaderboardList}
            />
          </View>
        )}

        {activeTab === 'howitworks' && (
          <>
            {renderHowItWorks()}
            {renderCTASection()}
          </>
        )}

        {/* Game Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by Game</Text>
          <FlatList
            data={[
              { id: '1', name: 'Valorant', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxhjYniqXU_9z5dMfSIK0eh-yn8A-qeE9Nmw&s' },
              { id: '2', name: 'CS2', icon: 'https://images.seeklogo.com/logo-png/53/1/counter-strike-2-logo-png_seeklogo-534313.png' },
              { id: '3', name: 'League', icon: 'https://logo-marque.com/wp-content/uploads/2020/11/League-of-Legends-Embleme.png' },
              { id: '4', name: 'Dota 2', icon: 'https://logowik.com/content/uploads/images/dota-2-black8002.logowik.com.webp' },
              { id: '5', name: 'Rocket League', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Rocket_League_coverart.jpg' },
              { id: '6', name: 'Apex', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apex_legends_logo.png/1200px-Apex_legends_logo.png' },
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryCard}>
                <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.categoriesList}
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
    marginTop: 36,
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
  searchButton: {
    padding: 8,
  },
  navTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeNavTab: {
    backgroundColor: '#1F2937',
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
    backgroundColor: '#1F2937',
  },
  activeFilterTab: {
    backgroundColor: '#4F46E5',
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
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
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
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tournamentCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
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
    marginBottom: 100,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default TournamentsScreen;
