import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


// Base URL for API calls
// Note: The base URL should not include '/home' as it's already included in the endpoint paths
const baseUrl = 'http://localhost:8080';

interface Team {
  id: number;
  name: string;
  tag?: string; // Optional fields based on actual API response
  game?: string;
  status?: 'active' | 'inactive' | 'disbanded';
  creationDate?: string;
  members?: number;
  tournamentsJoined?: number;
  tournamentsWon?: number;
  captain?: string;
  winRate?: number;
  logo?: string;
  location?: string;
  created_at?: number;
  updated_at?: number;
  players?: any[];
  logoUrl?: string; // API seems to use logoUrl instead of logo
}


const Teams = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('all');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        if (currentUser) {
          // Get auth token from localStorage
          const token = localStorage.getItem('authToken');
          
          let url = `${baseUrl}/home/listTeams?page=${currentPage - 1}&size=${teamsPerPage}`;
          
          if (activeTab !== 'all') {
            url += `&status=${activeTab}`;
          }

          console.log('Fetching teams from URL:', url);
          
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Teams API response:', response.data);
          
          // Check for all possible response formats
          // This is the actual structure from your backend:
          // { data: { content: [...teams] }, error: "OK", message: "..." }
          if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
            // The real API format - nested under data.data.content
            console.log('Processing correct API format with nested data envelope');
            setTeams(response.data.data.content);
            setTotalPages(response.data.data.totalPages || 1);
            setError(null);
          } else if (response.data && Array.isArray(response.data.content)) {
            // Standard Spring pagination format
            console.log('Processing paginated response with content array');
            setTeams(response.data.content);
            setTotalPages(response.data.totalPages);
            setError(null);
          } else if (Array.isArray(response.data)) {
            // Direct array format
            console.log('Processing direct array response');
            setTeams(response.data);
            setTotalPages(Math.ceil(response.data.length / teamsPerPage));
            setError(null);
          } else if (response.data && response.data.teams && Array.isArray(response.data.teams)) {
            // Nested teams property format
            console.log('Processing nested teams array response');
            setTeams(response.data.teams);
            setTotalPages(Math.ceil(response.data.teams.length / teamsPerPage));
            setError(null);
          } else if (response.data && typeof response.data === 'object') {
            // Try to adapt any object format by extracting team-like objects
            console.log('Attempting to adapt unknown object format');
            try {
              // If it's a single team object
              if (response.data.id && response.data.name) {
                setTeams([response.data as Team]);
                setTotalPages(1);
                setError(null);
              } else {
                // Log the actual structure for debugging
                console.error('Unexpected data structure:', JSON.stringify(response.data, null, 2));
                setTeams([]);
                setError(`Unexpected data format: ${JSON.stringify(response.data).substring(0, 100)}...`);
              }
            } catch (err) {
              console.error('Error parsing response:', err);
              setTeams([]);
              setError('Error parsing response data');
            }
          } else {
            console.error('Completely unexpected response format:', response.data);
            setTeams([]);
            setError('Unexpected data format received from server');
          }
        }
      } catch (error: any) {
        console.error('Error fetching teams:', error);
        setError(error.response?.data?.message || 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, [currentPage, teamsPerPage, currentUser]);

  // Filter teams based on search and active tab
  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (team.tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (team.game?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (['active', 'inactive', 'disbanded'].includes(activeTab)) {
      return matchesSearch && team.status === activeTab;
    } else {
      return matchesSearch && (team.game?.toLowerCase() || '').includes(activeTab.replace('-', ' '));
    }
  });

  // Pagination logic
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && teams.length > 0) {
      chartInstance.current = echarts.init(chartRef.current);
      
      // Count teams by game
      const gameCount: Record<string, number> = {};
      teams.forEach(team => {
        const game = team.game || 'Unknown';
        gameCount[game] = (gameCount[game] || 0) + 1;
      });
      
      const topGames = Object.entries(gameCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center',
          textStyle: {
            color: '#64748B'
          }
        },
        series: [
          {
            name: 'Teams by Game',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: topGames.map(([game, count]) => ({
              value: count,
              name: game
            }))
          }
        ]
      };
      
      chartInstance.current.setOption(option);
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, [teams]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/teams/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/teams/view/${id}`);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'disbanded': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800'; // Default to active
    }
  };

  // Helper function to get team logo URL
  const getTeamLogoUrl = (team: Team) => {
    if (team.logo) return team.logo;
    if (team.logoUrl) return team.logoUrl;
    return 'https://via.placeholder.com/50';
  };

  const getWinRateColor = (rate: number | undefined) => {
    if (!rate) return 'text-gray-600';
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-blue-600';
    if (rate >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Team Management</h1>
        
        {error && (
          <div className="w-full mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <button
            onClick={() => navigate('/teams/add')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center whitespace-nowrap transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="fas fa-plus mr-2"></i>
            Create Team
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
              All Teams
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'active' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'inactive' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Inactive
            </button>
            <button
              onClick={() => setActiveTab('disbanded')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'disbanded' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Disbanded
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">Total Teams</p>
              <p className="text-2xl font-bold">{teams.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold">{teams.filter(t => t.status === 'active').length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Inactive</p>
              <p className="text-2xl font-bold">{teams.filter(t => t.status === 'inactive').length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Disbanded</p>
              <p className="text-2xl font-bold">{teams.filter(t => t.status === 'disbanded').length}</p>
            </div>
          </div>
          
          <div className="h-64" ref={chartRef}></div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">Loading teams...</p>
            </div>
          ) : currentTeams.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-users text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-500">No teams found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentTeams.map((team: Team) => (
                <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <img 
                      src={getTeamLogoUrl(team)} 
                      alt={`${team.name} logo`} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(team.status || 'active')}`}>
                      {team.status ? team.status.charAt(0).toUpperCase() + team.status.slice(1) : 'Active'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                  <span className="text-sm text-gray-500">[{team.tag}]</span>
                  
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Game:</span>
                      <span className="font-medium">{team.game}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Members:</span>
                      <span className="font-medium">{team.members}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Win Rate:</span>
                      <span className={`font-medium ${getWinRateColor(team.winRate)}`}>
                        {team.winRate}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => handleView(team.id.toString())}
                      className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded text-sm font-medium"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(team.id.toString())}
                      className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 rounded text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredTeams.length > teamsPerPage && (
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
                Showing <span className="font-medium">{indexOfFirstTeam + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastTeam, filteredTeams.length)}
                </span>{' '}
                of <span className="font-medium">{filteredTeams.length}</span> teams
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

export default Teams;