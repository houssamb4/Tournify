import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { tournamentService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Tournaments = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tournamentsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Fetch real tournament data from API
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await tournamentService.getTournaments(currentPage - 1, tournamentsPerPage);
        
        if (response.data && Array.isArray(response.data.content)) {
          const tournamentsData = response.data.content;
          
          // Transform the data to match our expected format
          const formattedTournaments = tournamentsData.map((tournament: any) => ({
            id: tournament.id || Math.random().toString(),
            name: tournament.name || 'Unnamed Tournament',
            game: tournament.game?.name || 'Unknown Game',
            status: tournament.startDate && tournament.endDate ? 
                    getStatus(tournament.startDate, tournament.endDate) : 'upcoming',
            startDate: tournament.startDate ? new Date(tournament.startDate) : new Date(),
            endDate: tournament.endDate ? new Date(tournament.endDate) : new Date(),
            participants: tournament.teams?.length || 0,
            prizePool: tournament.prizePool || 0,
            location: tournament.location || 'Online',
            logoUrl: tournament.logoUrl || '',
            description: tournament.description || ''
          }));
          
          setTournaments(formattedTournaments);
        } else {
          console.error('Invalid API response format:', response);
          setTournaments([]);
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setTournaments([]);
      }
    };
    
    fetchTournaments();
  }, [currentPage, tournamentsPerPage]);
  
  // Helper function to determine tournament status
  const getStatus = (startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'completed' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

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
          data: ['Upcoming', 'Ongoing', 'Completed']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Upcoming',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [12, 13, 10, 13, 9, 23, 21, 18, 15, 12, 10, 8],
            itemStyle: { color: '#6366F1' }
          },
          {
            name: 'Ongoing',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [5, 6, 8, 7, 6, 10, 12, 14, 12, 10, 8, 6],
            itemStyle: { color: '#10B981' }
          },
          {
            name: 'Completed',
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series'
            },
            data: [8, 7, 9, 10, 12, 15, 18, 20, 22, 18, 15, 12],
            itemStyle: { color: '#3B82F6' }
          }
        ]
      };
      chartInstance.current.setOption(option);
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter tournaments based on search and active tab
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || tournament.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastTournament = currentPage * tournamentsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
  const currentTournaments = filteredTournaments.slice(indexOfFirstTournament, indexOfLastTournament);
  const totalPages = Math.ceil(filteredTournaments.length / tournamentsPerPage);

  const handleEdit = (id: string) => {
    navigate(`/tournaments/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/tournaments/view/${id}`);
  };

  // Add state for error/success messages
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) {
      return;
    }
    
    // Clear previous messages
    setActionError(null);
    setActionSuccess(null);
    
    try {
      // Check if user has the token in localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        setActionError('You need to be logged in to perform this action.');
        return;
      }
      
      await tournamentService.deleteTournament(Number(id));
      
      // Update UI
      const updatedTournaments = tournaments.filter(tournament => tournament.id !== id);
      setTournaments(updatedTournaments);
      
      // Show success message
      setActionSuccess('Tournament deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error deleting tournament:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401 || error.response.status === 403) {
          setActionError('You do not have permission to delete this tournament.');
        } else if (error.response.status === 404) {
          setActionError('Tournament not found. It may have already been deleted.');
          // Refresh tournaments list
          const updatedTournaments = tournaments.filter(tournament => tournament.id !== id);
          setTournaments(updatedTournaments);
        } else {
          setActionError(error.response.data?.message || 'Failed to delete tournament. Please try again.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setActionError('Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setActionError('An unexpected error occurred. Please try again.');
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setActionError(null);
      }, 5000);
    }
  };

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Tournament Management</h1>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tournaments..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <button 
            onClick={() => navigate('/tournaments/create')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center whitespace-nowrap"
          >
            <i className="fas fa-plus mr-2"></i>
            Create Tournament
          </button>
        </div>
      </div>

      {/* Tabs and Stats */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              All Tournaments
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'ongoing' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'completed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Completed
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">Total Tournaments</p>
              <p className="text-2xl font-bold">{tournaments.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Upcoming</p>
              <p className="text-2xl font-bold">{tournaments.filter(t => t.status === 'upcoming').length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Ongoing</p>
              <p className="text-2xl font-bold">{tournaments.filter(t => t.status === 'ongoing').length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Completed</p>
              <p className="text-2xl font-bold">{tournaments.filter(t => t.status === 'completed').length}</p>
            </div>
          </div>
          
          <div className="h-64" ref={chartRef}></div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {actionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{actionError}</p>
        </div>
      )}
      
      {actionSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>{actionSuccess}</p>
        </div>
      )}
      
      {/* Tournaments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournament Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prize Pool
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTournaments.map((tournament) => (
                <tr key={tournament.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tournament.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tournament.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tournament.game}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tournament.participants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${tournament.prizePool.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tournament.startDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleView(tournament.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(tournament.id)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(tournament.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstTournament + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastTournament, filteredTournaments.length)}
                </span>{' '}
                of <span className="font-medium">{filteredTournaments.length}</span> results
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
      </div>
    </div>
  );
};

export default Tournaments;