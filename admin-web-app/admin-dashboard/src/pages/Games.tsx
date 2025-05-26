import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { gameService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

interface Tournament {
  id: number;
  name: string;
  logoUrl: string;
}

interface Player {
  id: number;
  name: string;
  profileUrl: string | null;
}

interface Game {
  id: number;
  name: string;
  icon: string;
  developer: string;
  gameGenre: string;
  tournaments: Tournament[];
  players: Player[];
  tournamentCount: number;
  playerCount: number;
}

const Games = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:8080/home';
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('all');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Helper function to handle game response
  const handleGameResponse = (response: any) => {
    console.log('Full API response:', response);

    if (!response || !response.data) {
      console.error('No response or response.data');
      setGames([]);
      setTotalPages(1);
      return;
    }

    const responseData = response.data;
    console.log('Response data:', responseData);

    // The backend returns: 
    // { data: { success, message, data: { content, totalPages, totalElements } } }
    if (responseData.data?.data?.content) {
      const { content, totalPages, totalElements } = responseData.data.data;
      setGames(content || []);
      setTotalPages(totalPages || Math.ceil((totalElements || 0) / gamesPerPage));
    } else {
      console.error('Unexpected data structure:', responseData);
      setGames([]);
      setTotalPages(1);
    }
  };

  // Fetch games data from the API
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const token = localStorage.getItem('authToken');
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          };

          // Update URL to match backend endpoint structure
          let url = `${baseUrl}/games?page=${currentPage - 1}&size=${gamesPerPage}`;
          if (activeTab !== 'all') {
            url = `${baseUrl}/games/genre/${activeTab}?page=${currentPage - 1}&size=${gamesPerPage}`;
          }

          console.log('Fetching from URL:', url); // Debug log
          const response = await axios.get(url, { headers });
          handleGameResponse(response);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        }
        setGames([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentUser, currentPage, gamesPerPage, activeTab]);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && games.length > 0) {
      chartInstance.current = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Active Players', 'Tournaments'],
          textStyle: {
            color: '#64748B'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: games.map(g => g.name),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: [
          {
            type: 'value',
            name: 'Players',
            position: 'left'
          },
          {
            type: 'value',
            name: 'Tournaments',
            position: 'right'
          }
        ],
        series: [
          {
            name: 'Active Players',
            type: 'bar',
            data: games.map(g => g.activePlayers),
            itemStyle: { color: '#6366F1' }
          },
          {
            name: 'Tournaments',
            type: 'line',
            yAxisIndex: 1,
            data: games.map(g => g.tournaments),
            itemStyle: { color: '#10B981' },
            lineStyle: {
              width: 3
            }
          }
        ]
      };
      chartInstance.current.setOption(option);
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, [games]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter games based on search
  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    game.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.gameGenre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    navigate(`/games/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/games/view/${id}`);
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Game Management</h1>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center whitespace-nowrap"
            onClick={() => navigate('/games/add')}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Game
          </button>
        </div>
      </div>

      {/* Tabs and Stats */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              All Games
            </button>
            {['FPS', 'MOBA', 'Battle Royale', 'Sports', 'Strategy', 'Racing'].map(type => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === type ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {type}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">Total Games</p>
                <p className="text-2xl font-bold">{games.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Active Players</p>
                <p className="text-2xl font-bold">{formatNumber(games.reduce((sum, game) => sum + game.playerCount, 0))}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Tournaments</p>
                <p className="text-2xl font-bold">{games.reduce((sum, game) => sum + game.tournamentCount, 0)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Genres</p>
                <p className="text-2xl font-bold">
                  {new Set(games.map(game => game.gameGenre)).size}
                </p>
              </div>
            </div>
            
            <div className="h-96" ref={chartRef}></div>
          </>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredGames.map(game => (
          <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-gray-100 flex items-center justify-center">
              <img 
                src={game.icon} 
                alt={`${game.name} logo`} 
                className="h-20 object-contain"
                style={{ maxWidth: '80%' }}
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{game.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{game.developer}</p>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Genre:</span>
                <span className="font-medium">{game.gameGenre}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Players:</span>
                <span className="font-medium">{formatNumber(game.playerCount)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-500">Tournaments:</span>
                <span className="font-medium">{game.tournamentCount}</span>
              </div>
              
              <div className="flex justify-between space-x-2">
                <button 
                  onClick={() => handleView(game.id)}
                  className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded text-sm font-medium"
                >
                  View
                </button>
                <button 
                  onClick={() => handleEdit(game.id)}
                  className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 rounded text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;