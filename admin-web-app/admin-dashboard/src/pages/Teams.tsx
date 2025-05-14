import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';

const Teams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('all');
  const [teams, setTeams] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Mock data for teams
  useEffect(() => {
    const games = ['Valorant', 'League of Legends', 'CS:GO', 'Dota 2', 'Fortnite', 'Rocket League'];
    const mockTeams = Array.from({ length: 24 }, (_, i) => ({
      id: `TM${1000 + i}`,
      name: `Team ${i + 1}`,
      tag: `T${String.fromCharCode(65 + Math.floor(i / 5))}${i % 5 + 1}`,
      game: games[Math.floor(Math.random() * games.length)],
      status: ['active', 'inactive', 'disbanded'][Math.floor(Math.random() * 3)],
      creationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      members: Math.floor(Math.random() * 10) + 1,
      tournamentsJoined: Math.floor(Math.random() * 15),
      tournamentsWon: Math.floor(Math.random() * 5),
      captain: `Player${Math.floor(Math.random() * 50) + 1}`,
      winRate: Math.floor(Math.random() * 100),
      logo: `https://picsum.photos/seed/team${i}/100/100`
    }));
    setTeams(mockTeams);
  }, []);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
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
            data: [
              { value: teams.filter(t => t.game === 'Valorant').length, name: 'Valorant', itemStyle: { color: '#FF4655' } },
              { value: teams.filter(t => t.game === 'League of Legends').length, name: 'League of Legends', itemStyle: { color: '#0BC6E3' } },
              { value: teams.filter(t => t.game === 'CS:GO').length, name: 'CS:GO', itemStyle: { color: '#F5B225' } },
              { value: teams.filter(t => t.game === 'Dota 2').length, name: 'Dota 2', itemStyle: { color: '#E83151' } },
              { value: teams.filter(t => t.game === 'Fortnite').length, name: 'Fortnite', itemStyle: { color: '#5CC6F2' } },
              { value: teams.filter(t => t.game === 'Rocket League').length, name: 'Rocket League', itemStyle: { color: '#B37EFC' } }
            ]
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

  // Filter teams based on search and active tab
  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      team.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || team.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  const handleEdit = (id: string) => {
    navigate(`/teams/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/teams/view/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'disbanded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Team Management</h1>
        
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
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center whitespace-nowrap">
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
            {['Valorant', 'League of Legends', 'CS:GO', 'Dota 2'].map(game => (
              <button
                key={game}
                onClick={() => setActiveTab(game.toLowerCase().replace(' ', '-'))}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === game.toLowerCase().replace(' ', '-') ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {game}
              </button>
            ))}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentTeams.map(team => (
          <div key={team.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <img 
                    src={team.logo} 
                    alt={`${team.name} logo`} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div className="ml-3">
                    <h3 className="font-bold">{team.name}</h3>
                    <span className="text-xs text-gray-500">[{team.tag}]</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(team.status)}`}>
                  {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Game:</span>
                <span className="font-medium">{team.game}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Members:</span>
                <span className="font-medium">{team.members}/10</span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Tournaments:</span>
                <span className="font-medium">
                  {team.tournamentsJoined} <span className="text-green-500">({team.tournamentsWon} won)</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-500">Win Rate:</span>
                <span className={`font-medium ${getWinRateColor(team.winRate)}`}>
                  {team.winRate}%
                </span>
              </div>
              
              <div className="flex justify-between space-x-2">
                <button 
                  onClick={() => handleView(team.id)}
                  className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded text-sm font-medium"
                >
                  View
                </button>
                <button 
                  onClick={() => handleEdit(team.id)}
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

      {/* Top Performing Teams */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Top Performing Teams</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {teams
            .sort((a, b) => b.winRate - a.winRate)
            .slice(0, 5)
            .map((team, index) => (
              <div key={team.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-medium w-6">{index + 1}</span>
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`} 
                      className="w-10 h-10 rounded-full object-cover mx-3"
                    />
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-xs text-gray-500">{team.game}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getWinRateColor(team.winRate)}`}>
                      {team.winRate}% Win Rate
                    </span>
                    <p className="text-xs text-gray-500">
                      {team.tournamentsWon} tournament wins
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Teams;