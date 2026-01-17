import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Team {
  id?: number;
  name: string;
  tag?: string;
  game?: string;
  status?: 'active' | 'inactive' | 'disbanded';
  creationDate?: string;
  members?: number;
  captain?: string;
  logo?: string;
  location?: string;
  players?: any[];
  logoUrl?: string;
}

interface TeamFormProps {
  isViewOnly?: boolean;
}

const TeamForm = ({ isViewOnly = false }: TeamFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [team, setTeam] = useState<Team>({
    name: '',
    tag: '',
    game: '',
    status: 'active' as const,
    captain: '',
    location: '',
    logo: '',
    id: undefined
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id && !isViewOnly) {
      const fetchTeam = async () => {
        if (!currentUser) return;
        
        setLoading(true);
        const token = localStorage.getItem('authToken');
        try {
          const response = await axios.get(`http://localhost:8080/home/findATeam/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.data && response.data.data) {
            setTeam(response.data.data);
          } else {
            setError('Invalid data format received from server');
          }
        } catch (err: any) {
          setError(err.message || 'Error fetching team details');
        } finally {
          setLoading(false);
        }
      };

      fetchTeam();
    }
  }, [id, currentUser, isViewOnly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team.name || !currentUser) {
      setError('Team name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      if (id) {
        // Update existing team
        await axios.put(`http://localhost:8080/home/updateTeam/${id}`, team, { headers });
        setSuccess('Team updated successfully!');
      } else {
        // Create new team
        await axios.post('http://localhost:8080/home/createTeam', team, { headers });
        setSuccess('Team created successfully!');
      }
      
      // Navigate back after a short delay to show the success message
      setTimeout(() => {
        navigate('/teams');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving team:', err);
      setError(err.response?.data?.message || err.message || 'Error saving team');
    } finally {
      setLoading(false);
    }
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
          {isViewOnly ? 'View Team' : id ? 'Edit Team' : 'Create New Team'}
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
            value={team.name || ''}
            onChange={(e) => !isViewOnly && setTeam({ ...team, name: e.target.value })}
            disabled={isViewOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tag</label>
          <input
            type="text"
            value={team.tag || ''}
            onChange={(e) => !isViewOnly && setTeam({ ...team, tag: e.target.value })}
            disabled={isViewOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Game</label>
          <input
            type="text"
            value={team.game || ''}
            onChange={(e) => !isViewOnly && setTeam({ ...team, game: e.target.value })}
            disabled={isViewOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={team.status || 'active'}
            onChange={(e) => !isViewOnly && setTeam({ ...team, status: e.target.value as any })}
            disabled={isViewOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="disbanded">Disbanded</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Captain</label>
          <input
            type="text"
            value={team.captain || ''}
            onChange={(e) => !isViewOnly && setTeam({ ...team, captain: e.target.value })}
            disabled={isViewOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={team.location || ''}
            onChange={(e) => !isViewOnly && setTeam({ ...team, location: e.target.value })}
            disabled={isViewOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/teams')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back
          </button>
          
          {!isViewOnly && (
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          )}
        </div>
      </form>
      </div>
    </div>
  );
};

export default TeamForm;
