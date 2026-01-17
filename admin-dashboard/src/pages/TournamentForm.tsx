import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentService, gameService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

interface TournamentFormProps {
  isViewOnly?: boolean;
}

interface Game {
  id: number;
  name: string;
}

interface Tournament {
  id?: string | number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  prizePool: number;
  logoUrl: string;
  game: {
    id: number;
    name?: string;
  };
  teams?: Team[];
  maxParticipants?: number;
  registrationDeadline?: string;
  rules?: string;
  format?: string;
  streamUrl?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

interface Team {
  id: number;
  name: string;
  logoUrl?: string;
  members?: number;
}

const TournamentForm = ({ isViewOnly = false }: TournamentFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const [teamsInTournament, setTeamsInTournament] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState<Tournament>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    prizePool: 0,
    logoUrl: '',
    game: {
      id: 0
    },
    maxParticipants: 16,
    registrationDeadline: '',
    rules: '',
    format: 'Single Elimination',
    streamUrl: '',
    status: 'upcoming'
  });
  
  const isEditMode = Boolean(id);
  const pageTitle = isViewOnly 
    ? 'Tournament Details' 
    : isEditMode 
      ? 'Edit Tournament' 
      : 'Create Tournament';

  // Check if user has admin rights
  const isAdmin = currentUser?.authorities?.some(
    auth => auth.authority === 'ROLE_ADMIN'
  );

  // Format date from ISO string to input format
  const formatDateForInput = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };
  
  // Load games for dropdown
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gameService.getAllGames();
        if (response && response.content) {
          setGames(response.content);
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again.');
      }
    };
    
    fetchGames();
  }, []);
  
  // Load tournament data if in edit mode
  useEffect(() => {
    if (id) {
      const fetchTournament = async () => {
        setLoading(true);
        try {
          const response = await tournamentService.getTournamentById(Number(id));
          
          if (response) {
            setFormData({
              id: response.id,
              name: response.name || '',
              description: response.description || '',
              startDate: formatDateForInput(response.startDate) || '',
              endDate: formatDateForInput(response.endDate) || '',
              location: response.location || '',
              prizePool: response.prizePool || 0,
              logoUrl: response.logoUrl || '',
              game: {
                id: response.game?.id || 0
              }
            });
          }
        } catch (err: any) {
          console.error('Error fetching tournament:', err);
          setError(err.response?.data?.message || 'Failed to load tournament data.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchTournament();
    }
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'gameId') {
      setFormData({
        ...formData,
        game: {
          id: Number(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? Number(value) : value
      });
    }
  };
  
  // Load teams for tournament
  const loadTeamsForTournament = useCallback(async () => {
    if (!id) return;
    
    setLoadingTeams(true);
    try {
      const response = await tournamentService.getTeamsInTournament(Number(id));
      if (response && response.content) {
        setTeamsInTournament(response.content);
      }
    } catch (err) {
      console.error('Error loading teams for tournament:', err);
    } finally {
      setLoadingTeams(false);
    }
  }, [id]);
  
  // Load teams for tournament when on teams tab
  useEffect(() => {
    if (activeTab === 'teams') {
      loadTeamsForTournament();
    }
  }, [activeTab, loadTeamsForTournament]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setError('You do not have permission to perform this action.');
      return;
    }
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please correct the errors in the form before submitting.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Format dates for API
      const apiData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
        prizePool: Number(formData.prizePool),
        maxParticipants: Number(formData.maxParticipants || 16)
      };
      
      if (isEditMode) {
        await tournamentService.updateTournament(Number(id), apiData);
        setSuccess('Tournament updated successfully!');
      } else {
        const result = await tournamentService.createTournament(apiData);
        setSuccess('Tournament created successfully!');
        
        // If we have the ID of the new tournament, redirect to edit page
        if (result && result.id) {
          setTimeout(() => {
            navigate(`/tournaments/edit/${result.id}`);
          }, 1500);
        } else {
          // Otherwise just go back to tournaments list
          setTimeout(() => {
            navigate('/tournaments');
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('Error saving tournament:', err);
      setError(err.response?.data?.message || 'Failed to save tournament. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/tournaments');
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Tournament name is required';
    if (!formData.game.id) errors.game = 'Game selection is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (formData.prizePool < 0) errors.prizePool = 'Prize pool cannot be negative';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle logo URL change with preview
  useEffect(() => {
    if (formData.logoUrl) {
      setImagePreview(formData.logoUrl);
    } else {
      setImagePreview('');
    }
  }, [formData.logoUrl]);

  return (
    <div className="p-6 bg-gray-50">
      {/* Loading Indicator */}
      {loading && id ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            {isEditMode && <p className="text-gray-500 mt-1">ID: {formData.id}</p>}
          </div>
        
        {isViewOnly && (
          <button
            onClick={() => navigate(`/tournaments/edit/${id}`)}
            className="mt-3 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
            disabled={!isAdmin}
          >
            <i className="fas fa-edit mr-2"></i>
            Edit Tournament
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Success</p>
          <p>{success}</p>
        </div>
      )}
      
      {!isAdmin && !isViewOnly && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Permission Required</p>
          <p>You need administrator privileges to edit tournament information.</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <i className="fas fa-info-circle mr-2"></i>
              Tournament Details
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'teams' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              disabled={!id}
            >
              <i className="fas fa-users mr-2"></i>
              Teams
              {teamsInTournament.length > 0 && (
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {teamsInTournament.length}
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'rules' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <i className="fas fa-gavel mr-2"></i>
              Rules & Format
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'media' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <i className="fas fa-image mr-2"></i>
              Media
            </button>
          </nav>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Tournament Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="game">
                  Game
                </label>
                <select
                  id="gameId"
                  name="gameId"
                  value={formData.game.id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                  required
                >
                  <option value="">Select a Game</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prizePool">
                  Prize Pool ($)
                </label>
                <input
                  type="number"
                  id="prizePool"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                  min="0"
                  step="100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logoUrl">
                  Logo URL
                </label>
                <input
                  type="text"
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isViewOnly}
                />
              </div>
          </div>
          
          <div className="col-span-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              disabled={isViewOnly}
              placeholder="Provide a detailed description of the tournament..."
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs italic mt-1">{formErrors.description}</p>
            )}
          </div>
            </>
          )}
          
          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
            {!isEditMode ? (
              <div className="text-center py-8">
                <i className="fas fa-info-circle text-3xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Save the tournament first to manage teams</p>
              </div>
            ) : loadingTeams ? (
              <div className="text-center py-8">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2 text-gray-500">Loading teams...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Teams in Tournament</h3>
                  {!isViewOnly && (
                    <button
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => alert('Add team functionality would go here')}
                      disabled={!isAdmin}
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add Team
                    </button>
                  )}
                </div>
                
                {teamsInTournament.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <i className="fas fa-users text-3xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500">No teams have joined this tournament yet</p>
                    {!isViewOnly && (
                      <button
                        type="button"
                        className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => alert('Add team functionality would go here')}
                        disabled={!isAdmin}
                      >
                        <i className="fas fa-plus mr-1"></i>
                        Add the first team
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Members
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teamsInTournament.map((team) => (
                          <tr key={team.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {team.logoUrl ? (
                                  <img src={team.logoUrl} alt={team.name} className="h-10 w-10 rounded-full mr-3" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                    <i className="fas fa-users text-gray-400"></i>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{team.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {team.members || '?'} members
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {!isViewOnly && (
                                <button
                                  type="button"
                                  onClick={() => alert(`Would remove team ${team.id} from tournament`)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={!isAdmin}
                                >
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            </div>
          )}
          
          {/* Rules & Format Tab */}
          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="format">
                Tournament Format
              </label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isViewOnly}
              >
                <option value="Single Elimination">Single Elimination</option>
                <option value="Double Elimination">Double Elimination</option>
                <option value="Round Robin">Round Robin</option>
                <option value="Swiss System">Swiss System</option>
                <option value="Group Stage + Knockout">Group Stage + Knockout</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxParticipants">
                Maximum Participants
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isViewOnly}
                min="2"
                step="1"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationDeadline">
                Registration Deadline
              </label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isViewOnly}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Tournament Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isViewOnly}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rules">
                Tournament Rules
              </label>
              <textarea
                id="rules"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                disabled={isViewOnly}
                placeholder="Specify detailed rules for the tournament..."
              />
            </div>
            </div>
          )}
          
          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logoUrl">
                Logo URL
              </label>
              <input
                type="text"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isViewOnly}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streamUrl">
                Stream URL
              </label>
              <input
                type="text"
                id="streamUrl"
                name="streamUrl"
                value={formData.streamUrl}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isViewOnly}
                placeholder="https://twitch.tv/channel"
              />
            </div>
            
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Logo Preview
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-64">
                {imagePreview ? (
                  <img src={imagePreview} alt="Tournament logo" className="max-h-full object-contain" />
                ) : (
                  <div className="space-y-1 text-center">
                    <i className="fas fa-image text-5xl text-gray-400"></i>
                    <div className="text-sm text-gray-600">
                      <p className="mt-1">No logo provided</p>
                      <p className="mt-1">Enter a URL in the Logo URL field to see a preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6 border-t pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              {isViewOnly ? 'Back' : 'Cancel'}
            </button>
            
            {!isViewOnly && (
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : isEditMode ? (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Tournament
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Create Tournament
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
      </>
      )}
    </div>
  );
};

export default TournamentForm;
