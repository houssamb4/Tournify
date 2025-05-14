import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';

const Games = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('all');
  const [games, setGames] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Mock data for games
  useEffect(() => {
    const gameTypes = ['FPS', 'MOBA', 'Battle Royale', 'Sports', 'Strategy', 'Racing'];
    const mockGames = [
      {
        id: 'G001',
        name: 'Valorant',
        developer: 'Riot Games',
        releaseDate: new Date('2020-06-02'),
        type: 'FPS',
        activePlayers: 14500000,
        tournamentsLastMonth: 124,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png',
        popularity: 95
      },
      {
        id: 'G002',
        name: 'League of Legends',
        developer: 'Riot Games',
        releaseDate: new Date('2009-10-27'),
        type: 'MOBA',
        activePlayers: 180000000,
        tournamentsLastMonth: 356,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/League_of_Legends_2019_vector.svg/1200px-League_of_Legends_2019_vector.svg.png',
        popularity: 98
      },
      {
        id: 'G003',
        name: 'Counter-Strike 2',
        developer: 'Valve',
        releaseDate: new Date('2023-09-27'),
        type: 'FPS',
        activePlayers: 42000000,
        tournamentsLastMonth: 287,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Counter-Strike_2_Logo.svg/1200px-Counter-Strike_2_Logo.svg.png',
        popularity: 97
      },
      {
        id: 'G004',
        name: 'Dota 2',
        developer: 'Valve',
        releaseDate: new Date('2013-07-09'),
        type: 'MOBA',
        activePlayers: 7500000,
        tournamentsLastMonth: 198,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Dota_2_logo.svg/1200px-Dota_2_logo.svg.png',
        popularity: 90
      },
      {
        id: 'G005',
        name: 'Fortnite',
        developer: 'Epic Games',
        releaseDate: new Date('2017-07-25'),
        type: 'Battle Royale',
        activePlayers: 250000000,
        tournamentsLastMonth: 312,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fortnite_logo.png/1200px-Fortnite_logo.png',
        popularity: 99
      },
      {
        id: 'G006',
        name: 'Rocket League',
        developer: 'Psyonix',
        releaseDate: new Date('2015-07-07'),
        type: 'Sports',
        activePlayers: 85000000,
        tournamentsLastMonth: 143,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Rocket_League_coverart.jpg/1200px-Rocket_League_coverart.jpg',
        popularity: 88
      },
      {
        id: 'G007',
        name: 'Apex Legends',
        developer: 'Respawn Entertainment',
        releaseDate: new Date('2019-02-04'),
        type: 'Battle Royale',
        activePlayers: 130000000,
        tournamentsLastMonth: 176,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apex_legends_cover.jpg/1200px-Apex_legends_cover.jpg',
        popularity: 94
      },
      {
        id: 'G008',
        name: 'StarCraft II',
        developer: 'Blizzard Entertainment',
        releaseDate: new Date('2010-07-27'),
        type: 'Strategy',
        activePlayers: 3500000,
        tournamentsLastMonth: 87,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/StarCraft_II_-_Box_Art.jpg/220px-StarCraft_II_-_Box_Art.jpg',
        popularity: 82
      },
      {
        id: 'G009',
        name: 'Overwatch 2',
        developer: 'Blizzard Entertainment',
        releaseDate: new Date('2022-10-04'),
        type: 'FPS',
        activePlayers: 25000000,
        tournamentsLastMonth: 92,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Overwatch_2_logo.svg/1200px-Overwatch_2_logo.svg.png',
        popularity: 89
      },
      {
        id: 'G010',
        name: 'Rainbow Six Siege',
        developer: 'Ubisoft',
        releaseDate: new Date('2015-12-01'),
        type: 'FPS',
        activePlayers: 45000000,
        tournamentsLastMonth: 134,
        status: 'active',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Tom_Clancy%27s_Rainbow_Six_Siege_cover_art.jpg/220px-Tom_Clancy%27s_Rainbow_Six_Siege_cover_art.jpg',
        popularity: 91
      }
    ];
    setGames(mockGames);
  }, []);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Active Players (millions)', 'Tournaments Last Month'],
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
            name: 'Players (millions)',
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
            name: 'Active Players (millions)',
            type: 'bar',
            data: games.map(g => Math.round(g.activePlayers / 1000000)),
            itemStyle: { color: '#6366F1' }
          },
          {
            name: 'Tournaments Last Month',
            type: 'line',
            yAxisIndex: 1,
            data: games.map(g => g.tournamentsLastMonth),
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

  // Filter games based on search and active tab
  const filteredGames = games.filter(game => {
    const matchesSearch = 
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      game.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || game.type.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handleEdit = (id: string) => {
    navigate(`/games/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/games/view/${id}`);
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'bg-green-100 text-green-800';
    if (popularity >= 75) return 'bg-blue-100 text-blue-800';
    if (popularity >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatNumber = (num: number) => {
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
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center whitespace-nowrap">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">Total Games</p>
              <p className="text-2xl font-bold">{games.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Players</p>
              <p className="text-2xl font-bold">{formatNumber(games.reduce((sum, game) => sum + game.activePlayers, 0))}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Monthly Tournaments</p>
              <p className="text-2xl font-bold">{games.reduce((sum, game) => sum + game.tournamentsLastMonth, 0)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Avg. Popularity</p>
              <p className="text-2xl font-bold">
                {Math.round(games.reduce((sum, game) => sum + game.popularity, 0) / games.length)}%
              </p>
            </div>
          </div>
          
          <div className="h-96" ref={chartRef}></div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentGames.map(game => (
          <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-gray-100 flex items-center justify-center">
              <img 
                src={game.logo} 
                alt={`${game.name} logo`} 
                className="h-20 object-contain"
                style={{ maxWidth: '80%' }}
              />
              <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${getPopularityColor(game.popularity)}`}>
                {game.popularity}% Popular
              </span>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{game.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{game.developer}</p>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Release:</span>
                <span className="font-medium">{game.releaseDate.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{game.type}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Players:</span>
                <span className="font-medium">{formatNumber(game.activePlayers)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-500">Tournaments:</span>
                <span className="font-medium">{game.tournamentsLastMonth}</span>
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
      {filteredGames.length > gamesPerPage && (
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
                Showing <span className="font-medium">{indexOfFirstGame + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastGame, filteredGames.length)}
                </span>{' '}
                of <span className="font-medium">{filteredGames.length}</span> games
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

      {/* Game Types Breakdown */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Game Types Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['FPS', 'MOBA', 'Battle Royale', 'Sports', 'Strategy', 'Racing'].map(type => {
              const typeGames = games.filter(g => g.type === type);
              if (typeGames.length === 0) return null;
              
              const totalPlayers = typeGames.reduce((sum, game) => sum + game.activePlayers, 0);
              const totalTournaments = typeGames.reduce((sum, game) => sum + game.tournamentsLastMonth, 0);
              const avgPopularity = Math.round(typeGames.reduce((sum, game) => sum + game.popularity, 0) / typeGames.length);
              
              return (
                <div key={type} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <h3 className="font-medium text-lg mb-3">{type}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Games:</span>
                      <span className="font-medium">{typeGames.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Players:</span>
                      <span className="font-medium">{formatNumber(totalPlayers)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tournaments:</span>
                      <span className="font-medium">{totalTournaments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Avg. Popularity:</span>
                      <span className={`font-medium ${avgPopularity >= 90 ? 'text-green-600' : avgPopularity >= 75 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        {avgPopularity}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;