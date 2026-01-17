import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Define the Player interface to match backend structure
interface Player {
  id: number;
  name: string;
  age: number;
  team?: {
    id: number;
    name: string;
  };
  team_id?: number;
}

// Define the Team interface for dropdown selection
interface Team {
  id: number;
  name: string;
}

const Players = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    age: 18,
    team_id: undefined
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const baseUrl = 'http://localhost:8080/home';

  // Function to set auth token in axios headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Function to fetch players
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/listPlayers?page=${currentPage - 1}&size=${playersPerPage}`,
        getAuthHeaders()
      );

      console.log('Players API response:', response.data); // Debug log

      // Handle the nested data structure
      if (response.data && response.data.data && response.data.data.data) {
        // Handle triple nested data structure
        const { content, totalPages, totalElements } = response.data.data.data;
        if (Array.isArray(content)) {
          setPlayers(content);
          setTotalPages(totalPages || Math.ceil(totalElements / playersPerPage));
        } else {
          console.error('Invalid content format:', content);
          setPlayers([]);
          setTotalPages(1);
        }
      } else if (response.data && response.data.data && response.data.data.content) {
        // Handle double nested data structure
        const { content, totalPages, totalElements } = response.data.data;
        if (Array.isArray(content)) {
          setPlayers(content);
          setTotalPages(totalPages || Math.ceil(totalElements / playersPerPage));
        } else {
          console.error('Invalid content format:', content);
          setPlayers([]);
          setTotalPages(1);
        }
      } else if (response.data && response.data.content) {
        // Handle single nested data structure
        const { content, totalPages, totalElements } = response.data;
        if (Array.isArray(content)) {
          setPlayers(content);
          setTotalPages(totalPages || Math.ceil(totalElements / playersPerPage));
        } else {
          console.error('Invalid content format:', content);
          setPlayers([]);
          setTotalPages(1);
        }
      } else if (Array.isArray(response.data)) {
        // Handle direct array response
        setPlayers(response.data);
        setTotalPages(Math.ceil(response.data.length / playersPerPage));
      } else {
        console.error('Invalid API response format:', response.data);
        setPlayers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      setPlayers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handler for creating a new player
  const handleCreatePlayer = async () => {
    setActionError(null);
    setActionSuccess(null);

    if (!newPlayer.name || !newPlayer.age) {
      setActionError('Name and age are required.');
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/createPlayer`,
        newPlayer,
        getAuthHeaders()
      );

      console.log('Create player response:', response.data); // Debug log

      if (response.data && response.data.data) {
        // Update players list with new player
        setPlayers([...players, response.data.data]);
        setActionSuccess('Player created successfully!');
        setIsAddModalOpen(false);
        
        // Reset form
        setNewPlayer({
          name: '',
          age: 18,
          team_id: undefined
        });

        // Refresh players list
        fetchPlayers();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error creating player:', error);
      if (error.response?.data?.message) {
        setActionError(error.response.data.message);
      } else if (error.message) {
        setActionError(error.message);
      } else {
        setActionError('Failed to create player. Please try again.');
      }
    }
  };

  // Handler for updating a player
  const handleUpdatePlayer = async () => {
    setActionError(null);
    setActionSuccess(null);

    if (!selectedPlayer) {
      setActionError('No player selected.');
      return;
    }

    if (!selectedPlayer.name || !selectedPlayer.age) {
      setActionError('Name and age are required.');
      return;
    }

    try {
      const response = await axios.put(
        `${baseUrl}/updatePlayer/${selectedPlayer.id}`,
        {
          name: selectedPlayer.name,
          age: selectedPlayer.age,
          team_id: selectedPlayer.team_id || selectedPlayer.team?.id
        },
        getAuthHeaders()
      );

      if (response.data && response.data.data) {
        // Update player in the list
        setPlayers(players.map(p => p.id === selectedPlayer.id ? response.data.data : p));
        setActionSuccess('Player updated successfully!');
        setIsEditModalOpen(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error updating player:', error);
      if (error.response?.data?.message) {
        setActionError(error.response.data.message);
      } else if (error.message) {
        setActionError(error.message);
      } else {
        setActionError('Failed to update player. Please try again.');
      }
    }
  };

  // Handler for deleting a player
  const handleDeletePlayer = async (playerId: number) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;

    try {
      const response = await axios.delete(
        `${baseUrl}/deletePlayer/${playerId}`,
        getAuthHeaders()
      );

      if (response.data && response.data.status === 200) {
        setActionSuccess('Player deleted successfully');
        // Refresh players list
        fetchPlayers();
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      setActionError('Failed to delete player');
    }
  };

  // Fetch players when component mounts or when page/size changes
  useEffect(() => {
    fetchPlayers();
  }, [currentPage, playersPerPage]);

  // Fetch teams when component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/listTeams?page=0&size=100`,
          getAuthHeaders()
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
          setTeams(response.data.data.content);
        } else {
          console.error('Invalid API response format for teams:', response.data);
          setTeams([]);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };

    fetchTeams();
  }, []);

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.team?.name && player.team.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Player Management</h1>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center whitespace-nowrap"
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Player
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <p>{actionError}</p>
          </div>
        </div>
      )}
      
      {actionSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-md">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            <p>{actionSuccess}</p>
          </div>
        </div>
      )}

      {/* Players table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center">
                      <div className="loader"></div>
                      <span className="ml-2">Loading players...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No players found
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.team?.name || 'No Team'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPlayer(player);
                            setIsEditModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredPlayers.length > 0 && (
        <div className="mt-4 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}

      {/* Add player modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Player</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={newPlayer.age}
                  onChange={(e) => setNewPlayer({...newPlayer, age: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Team</label>
                <select
                  value={newPlayer.team_id || ''}
                  onChange={(e) => setNewPlayer({...newPlayer, team_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlayer}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit player modal */}
      {isEditModalOpen && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Player</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedPlayer.name}
                  onChange={(e) => setSelectedPlayer({...selectedPlayer, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={selectedPlayer.age}
                  onChange={(e) => setSelectedPlayer({...selectedPlayer, age: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Team</label>
                <select
                  value={selectedPlayer.team_id || selectedPlayer.team?.id || ''}
                  onChange={(e) => setSelectedPlayer({...selectedPlayer, team_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePlayer}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Update Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;
