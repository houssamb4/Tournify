import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const navigation = useNavigation();

type TabParamList = {
    home: undefined;
    login: undefined;
    register: undefined;
    welcome: undefined;
  };

  type Team = {
    id: string;
    name: string;
    game: string;
    logo: string;
    founded: string;
    region: string;
    achievements: string;
  };

  type RootStackParamList = {
    Teams: undefined;
  };
  
type NavigationProp = NativeStackNavigationProp<TabParamList>;

const teamsData: Team[] = [ 
    {
      id: '1',
      name: 'Team Liquid',
      game: 'Multiple',
      logo: 'https://images.seeklogo.com/logo-png/52/2/team-liquid-logo-png_seeklogo-528696.png',
      founded: '2000',
      region: 'North America',
      achievements: '50+ tournament wins'
    },
    {
      id: '2',
      name: 'Fnatic',
      game: 'VALORANT, LoL',
      logo: 'https://yt3.googleusercontent.com/45NcTi6QgjDin4dzwRwu9eNoTv_YGKF7bs212w5GSMQKxLqKFLysduN5hK9oF7FVV4yr5Gtqonk=s900-c-k-c0x00ffffff-no-rj',
      founded: '2004',
      region: 'Europe',
      achievements: '100+ tournament wins'
    },
    {
      id: '3',
      name: 'G2 Esports',
      game: 'CS2, LoL',
      logo: 'https://images.seeklogo.com/logo-png/40/1/g2-esport-logo-png_seeklogo-400454.png',
      founded: '2014',
      region: 'Europe',
      achievements: '70+ tournament wins'
    },
    {
      id: '4',
      name: 'Natus Vincere',
      game: 'CS2, Dota 2',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Natus_Vincere_Logo.svg/1200px-Natus_Vincere_Logo.svg.png',
      founded: '2009',
      region: 'CIS',
      achievements: '80+ tournament wins'
    },
    {
      id: '5',
      name: 'T1',
      game: 'League of Legends',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/T1_logo.svg/1200px-T1_logo.svg.png',
      founded: '2002',
      region: 'South Korea',
      achievements: 'World Champions 2023'
    }
  ];

const TeamsPage = () => {
  const [teamsData, setTeamsData] = useState<Team[]>([]); // If you also fetch teams
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setLoading(true);
      setTimeout(() => {
        const filtered = teamsData.filter(team =>
          team.name.toLowerCase().includes(text.toLowerCase()) ||
          team.game.toLowerCase().includes(text.toLowerCase()) ||
          team.region.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredTeams(filtered);
        setLoading(false);
      }, 500); // Simulate network delay
    } else {
      setFilteredTeams([]);
    }
  };

  const renderTeamCard = ({ item }: {item: Team}) => (
    <TouchableOpacity style={styles.teamCard}>
      <Image source={{ uri: item.logo }} style={styles.teamLogo} />
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.teamDetails}>Games: {item.game}</Text>
        <Text style={styles.teamDetails}>Founded: {item.founded}</Text>
        <Text style={styles.teamDetails}>Region: {item.region}</Text>
        <Text style={styles.teamAchievements}>Achievements: {item.achievements}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/logo.png')} // Make sure this path is correct for your project
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Teams Directory</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Content */}
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        )}

        {!loading && searchQuery.length > 2 && filteredTeams.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        )}

        <FlatList
        data={searchQuery.length > 2 ? filteredTeams : teamsData}
        renderItem={renderTeamCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.teamsList}
        ListEmptyComponent={() => {
            if (searchQuery.length <= 2 && !loading) {
            return (
                <View style={styles.welcomeMessage}>
                <Text style={styles.welcomeText}>Welcome to the Teams Directory!</Text>
                <Text style={styles.welcomeSubtext}>Search for your favorite teams or browse through the list below.</Text>
                </View>
            );
            }
            return null;
        }}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  teamsList: {
    paddingBottom: 20,
  },
  teamCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamDetails: {
    color: '#E5E7EB',
    fontSize: 14,
    marginBottom: 4,
  },
  teamAchievements: {
    color: '#4F46E5',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsText: {
    color: '#E5E7EB',
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeMessage: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  welcomeText: {
    color: '#E5E7EB',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtext: {
    color: '#9CA3AF',  
    fontSize: 14,
    textAlign: 'center',
  }
});

export default TeamsPage;