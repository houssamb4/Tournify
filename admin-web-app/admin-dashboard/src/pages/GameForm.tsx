import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Game {
  id?: number;
  name: string;
  icon: string;
  developer: string;
  gameGenre: string;
  activePlayers?: string;
  tournaments?: number;
}

interface GameFormProps {
  isViewOnly?: boolean;
}

const GameForm = ({ isViewOnly = false }: GameFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [game, setGame] = useState<Game>({
    name: '',
    icon: '',
    developer: '',
    gameGenre: '',
    activePlayers: '',
    tournaments: 0
  });

  const baseUrl = 'http://localhost:8080/home';

  useEffect(() => {
    if (id && !isViewOnly) {
      fetchGame();
    }
  }, [id]);

  const fetchGame = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${baseUrl}/games/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setGame(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching game:', error);
      setError(error.response?.data?.message || 'Failed to fetch game details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let response;
      if (id) {
        // Update existing game
        response = await axios.put(`${baseUrl}/games/${id}`, game, { headers });
      } else {
        // Create new game
        response = await axios.post(`${baseUrl}/games`, game, { headers });
      }

      if (response.data) {
        setSuccess(id ? 'Game updated successfully!' : 'Game created successfully!');
        setTimeout(() => {
          navigate('/games');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error saving game:', error);
      setError(error.response?.data?.message || 'Failed to save game');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGame(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isViewOnly ? 'View Game' : id ? 'Edit Game' : 'Create New Game'}
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <p>{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={game.name}
              onChange={handleChange}
              disabled={isViewOnly}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Icon URL</label>
            <input
              type="url"
              name="icon"
              value={game.icon}
              onChange={handleChange}
              disabled={isViewOnly}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Developer</label>
            <input
              type="text"
              name="developer"
              value={game.developer}
              onChange={handleChange}
              disabled={isViewOnly}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              name="gameGenre"
              value={game.gameGenre}
              onChange={handleChange}
              disabled={isViewOnly}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a genre</option>
              <option value="FPS">FPS</option>
              <option value="MOBA">MOBA</option>
              <option value="Battle Royale">Battle Royale</option>
              <option value="Sports">Sports</option>
              <option value="Strategy">Strategy</option>
              <option value="Racing">Racing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Active Players</label>
            <input
              type="text"
              name="activePlayers"
              value={game.activePlayers}
              onChange={handleChange}
              disabled={isViewOnly}
              placeholder="e.g., 1M"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {!isViewOnly && (
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/games')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Saving...' : id ? 'Update Game' : 'Create Game'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GameForm;
