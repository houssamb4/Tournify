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
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Game {
  id: string;
  name: string;
  icon: string;
  activePlayers: string;
  tournaments: string;
  genre: string;
  developer: string;
}

interface GameGenre {
  id: string;
  name: string;
}


const GamesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const popularGames = [
    { 
      id: '1', 
      name: 'Valorant', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxhjYniqXU_9z5dMfSIK0eh-yn8A-qeE9Nmw&s',
      activePlayers: '15M',
      tournaments: '245',
      genre: 'FPS',
      developer: 'Riot Games'
    },
    { 
      id: '2', 
      name: 'CS2', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMW6SF5Jg1L5rfWjyRXbqEDXqkJgrHZAxisw&s',
      activePlayers: '12M',
      tournaments: '189',
      genre: 'FPS',
      developer: 'Valve'
    },
    { 
      id: '3', 
      name: 'League of Legends', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAZUYTV4BT9vP_yHkR4KkSNkIwPbQm4HF2xDi7KFH3P9aXffAvgjVXgf4HukfGFrKjMxA&usqp=CAU',
      activePlayers: '180M',
      tournaments: '320',
      genre: 'MOBA',
      developer: 'Riot Games'
    },
    { 
      id: '4', 
      name: 'Dota 2', 
      icon: 'https://i.pinimg.com/736x/8a/8b/50/8a8b50da2bc4afa933718061fe291520.jpg',
      activePlayers: '11M',
      tournaments: '156',
      genre: 'MOBA',
      developer: 'Valve'
    },
    { 
      id: '5', 
      name: 'Fortnite', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShiXrQ-cvZeDyQNPIZCv_hsaUCAe5j_rXJ7Q&s',
      activePlayers: '250M',
      tournaments: '98',
      genre: 'Battle Royale',
      developer: 'Epic Games'
    },
    { 
      id: '6', 
      name: 'EA Sports FC', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ61xFPKcUQQYMj8pB_lqj-wz3kkZcit9NANw&s',
      activePlayers: '30M',
      tournaments: '87',
      genre: 'Sports',
      developer: 'EA Sports'
    },
    { 
      id: '7', 
      name: 'Rocket League', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Rocket_League_coverart.jpg',
      activePlayers: '85M',
      tournaments: '76',
      genre: 'Sports',
      developer: 'Psyonix'
    },
    { 
      id: '8', 
      name: 'Overwatch 2', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtz8wf-wkv3puvXOCYI_ESRixOy3IebJOlMQ&s',
      activePlayers: '25M',
      tournaments: '65',
      genre: 'FPS',
      developer: 'Blizzard'
    },
    { 
      id: '9', 
      name: 'Apex Legends', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Apex_legends_simple_logo.jpg',
      activePlayers: '130M',
      tournaments: '54',
      genre: 'Battle Royale',
      developer: 'Respawn'
    },
    { 
        id: '17', 
        name: 'Mobile Legends', 
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8cWNKmZIt8zjiygXoXiwzF3rRQGqUkvCFSw&s',
        activePlayers: '180M',
        tournaments: '320',
        genre: 'MOBA',
        developer: 'Riot Games'
      },
    { 
      id: '10', 
      name: 'Rainbow Six Siege', 
      icon: 'https://upload.wikimedia.org/wikipedia/en/4/47/Tom_Clancy%27s_Rainbow_Six_Siege_cover_art.jpg',
      activePlayers: '70M',
      tournaments: '43',
      genre: 'FPS',
      developer: 'Ubisoft'
    },
    { 
      id: '11', 
      name: 'Call of Duty', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQontdbON1-xDkbajIpQ0tivSp4yY4AQqjlGw&s',
      activePlayers: '90M',
      tournaments: '32',
      genre: 'FPS',
      developer: 'Activision'
    },
    { 
      id: '12', 
      name: 'PUBG', 
      icon: 'https://static.gameloop.com/syzs_cms/202411/0c1b802dbf58e04cf330d4631741e980.png?imageMogr2/thumbnail/undefinedx56/format/webp',
      activePlayers: '30M',
      tournaments: '21',
      genre: 'Battle Royale',
      developer: 'Krafton'
    },
    { 
      id: '13', 
      name: 'Street Fighter 6', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9b2D21tyc2Gmq6mGBeMXcdEkp_NCUDPNQA&s',
      activePlayers: '2M',
      tournaments: '15',
      genre: 'Fighting',
      developer: 'Capcom'
    },
    { 
      id: '14', 
      name: 'Tekken 8', 
      icon: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f05a9b5b-ead5-460e-8573-73ba2fff9cde/dgs72ru-529a5528-da92-4eb3-a5b8-0f606390feeb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2YwNWE5YjViLWVhZDUtNDYwZS04NTczLTczYmEyZmZmOWNkZVwvZGdzNzJydS01MjlhNTUyOC1kYTkyLTRlYjMtYTViOC0wZjYwNjM5MGZlZWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rWvCqPHoMPhuZt8A7pW3UgFDfPTjDkhPHB6SgpKLPxc',
      activePlayers: '1.5M',
      tournaments: '12',
      genre: 'Fighting',
      developer: 'Bandai Namco'
    },
    { 
      id: '15', 
      name: 'Starcraft II', 
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyj6mjxTSQaUDSkxXTFormrkQoNWMk8drPbdG8xHI08HV6vJ7uLXVcygxR55ZOlmbOM5s&usqp=CAU',
      activePlayers: '5M',
      tournaments: '8',
      genre: 'RTS',
      developer: 'Blizzard'
    },
    { 
        id: '16', 
        name: 'Free Fire', 
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0_-d0GpL4pqsqRp-mRg96jTwmPD-wehMICg&s',
        activePlayers: '500M',
        tournaments: '8',
        genre: 'Battle Royale',
        developer: 'Garena'
      },
      { 
        id: '18', 
        name: 'Brawl Stars', 
        icon: 'https://i.scdn.co/image/ab6761610000e5ebf7b952107c126c561c52171e',
        activePlayers: '60M',
        tournaments: '8',
        genre: 'Team Battle',
        developer: 'MOBA'
      },

  ];

  const gameGenres = [
    { id: 'all', name: 'All Games' },
    { id: 'fps', name: 'FPS' },
    { id: 'moba', name: 'MOBA' },
    { id: 'battle-royale', name: 'Battle Royale' },
    { id: 'sports', name: 'Sports' },
    { id: 'fighting', name: 'Fighting' },
    { id: 'rts', name: 'RTS' }
  ];

  const renderGameCard = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.gameCard}>
      <Image source={{ uri: item.icon }} style={styles.gameCardImage} />
      <View style={styles.gameCardContent}>
        <Text style={styles.gameCardTitle}>{item.name}</Text>
        <View style={styles.gameCardDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account-group" size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{item.activePlayers}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="trophy" size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{item.tournaments} tournaments</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="tag" size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{item.genre}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="developer-board" size={16} color="#9CA3AF" />
            <Text style={styles.detailText}>{item.developer}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGenreFilter = ({ item }: { item: GameGenre }) => (
    <TouchableOpacity 
      style={[
        styles.genreFilter, 
        activeFilter === item.id && styles.activeGenreFilter
      ]}
      onPress={() => setActiveFilter(item.id)}
    >
      <Text style={[
        styles.genreText,
        activeFilter === item.id && styles.activeGenreText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const filteredGames = popularGames.filter(game => {
    // Filter by search query
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by genre
    let matchesGenre = true;
    if (activeFilter !== 'all') {
      matchesGenre = game.genre.toLowerCase() === activeFilter;
    }
    
    return matchesSearch && matchesGenre;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Games</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/40?text=U' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Genre Filters */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={gameGenres}
          renderItem={renderGenreFilter}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreList}
        />

        {/* Games List */}
        <Text style={styles.sectionTitle}>
          {activeFilter === 'all' ? 'All Games' : 
           gameGenres.find(g => g.id === activeFilter)?.name}
          {` (${filteredGames.length})`}
        </Text>
        
        <FlatList
          data={filteredGames}
          renderItem={renderGameCard}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.gamesList}
        />
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
  headerTitle: {
    color: 'white',
    fontSize: 24,
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
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  genreList: {
    paddingBottom: 16,
  },
  genreFilter: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  activeGenreFilter: {
    backgroundColor: '#4F46E5',
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
    paddingBottom: 20,
    marginBottom: 60,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 16,
    height: 125,
  },
  gameCardImage: {
    width: 100,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  gameCardContent: {
    flex: 1,
    padding: 16,
  },
  gameCardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  gameCardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default GamesPage;