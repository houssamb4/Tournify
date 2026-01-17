import axios from 'axios';

// Base URLs from requette.http
const BASE_URL = 'http://localhost:8080/home';
const AUTH_URL = 'http://localhost:8080/api/auth';

// Create axios instances
const authApi = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set in API headers');
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete authApi.defaults.headers.common['Authorization'];
    console.log('Auth token removed from API headers');
  }
};

// Ensure token is set on initial load
const initializeAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
  }
};

// Call initialization
initializeAuthToken();

// Auth endpoints
export const authService = {
  login: async (usernameOrEmail: string, password: string) => {
    const response = await authApi.post('/login', { usernameOrEmail, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await authApi.post('/signup', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await authApi.get('/me');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await authApi.put('/update-profile', profileData);
    return response.data;
  },
  
  logout: async () => {
    const response = await authApi.post('/logout');
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await authApi.post('/forgot-password', { email });
    return response.data;
  },
  
  verifyResetCode: async (email: string, code: string) => {
    const response = await authApi.post('/verify-reset-code', { email, code });
    return response.data;
  },
  
  resetPassword: async (email: string, code: string, newPassword: string, confirmPassword: string) => {
    const response = await authApi.post('/reset-password', { 
      email, 
      code, 
      newPassword, 
      confirmPassword 
    });
    return response.data;
  }
};

// Tournament endpoints
export const tournamentService = {
  getTournaments: async (page: number = 0, size: number = 8) => {
    const response = await api.get(`/listTournaments?page=${page}&size=${size}`);
    return response.data;
  },
  
  createTournament: async (tournamentData: any) => {
    const response = await api.post('/createTournament', tournamentData);
    return response.data;
  },
  
  getTournamentById: async (id: number) => {
    const response = await api.get(`/findATournament/${id}`);
    return response.data;
  },
  
  updateTournament: async (id: number, tournamentData: any) => {
    const response = await api.put(`/updateTournament/${id}`, tournamentData);
    return response.data;
  },
  
  deleteTournament: async (id: number) => {
    const response = await api.delete(`/deleteTournament/${id}`);
    return response.data;
  },
  
  deleteAllTournaments: async () => {
    const response = await api.delete('/deleteAllTournaments');
    return response.data;
  },
  
  searchTournaments: async (name: string, page: number = 0, size: number = 8) => {
    const response = await api.get(`/searchTournaments?name=${name}&page=${page}&size=${size}`);
    return response.data;
  },
  
  getActiveTournaments: async (page: number = 0, size: number = 8) => {
    const response = await api.get(`/activeTournaments?page=${page}&size=${size}`);
    return response.data;
  },

  // Team-Tournament relationship endpoints
  addTeamToTournament: async (tournamentId: number, teamId: number) => {
    const response = await api.post(`/addTeamToTournament/${tournamentId}/${teamId}`);
    return response.data;
  },

  removeTeamFromTournament: async (tournamentId: number, teamId: number) => {
    const response = await api.delete(`/removeTeamFromTournament/${tournamentId}/${teamId}`);
    return response.data;
  },

  getTeamsInTournament: async (tournamentId: number, page: number = 0, size: number = 8) => {
    const response = await api.get(`/teamsInTournament/${tournamentId}?page=${page}&size=${size}`);
    return response.data;
  },

  deleteAllTeamsInTournament: async (tournamentId: number) => {
    const response = await api.delete(`/deleteAllTeamsInTournament/${tournamentId}`);
    return response.data;
  },

  // Player endpoints for tournament
  getPlayersInTournament: async (tournamentId: number, page: number = 0, size: number = 8) => {
    const response = await api.get(`/playersInTournament/${tournamentId}?page=${page}&size=${size}`);
    return response.data;
  },

  deleteAllPlayersInTournament: async (tournamentId: number) => {
    const response = await api.delete(`/deleteAllPlayersInTournament/${tournamentId}`);
    return response.data;
  }
};

// Game endpoints
export const gameService = {
  getAllGames: async (page: number = 0, size: number = 10) => {
    const response = await api.get(`/games?page=${page}&size=${size}`);
    return response.data;
  },
  
  getGameById: async (id: number) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  getGamesByGenre: async (genre: string, page: number = 0, size: number = 10) => {
    const response = await api.get(`/games/genre/${genre}?page=${page}&size=${size}`);
    return response.data;
  },

  searchGames: async (query: string, page: number = 0, size: number = 10) => {
    const response = await api.get(`/games/search?query=${query}&page=${page}&size=${size}`);
    return response.data;
  },

  getPopularGames: async () => {
    const response = await api.get('/games/popular');
    return response.data;
  },

  createGame: async (gameData: any) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  updateGame: async (id: number, gameData: any) => {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  }
};

// Team endpoints
export const teamService = {
  getAllTeams: async (page: number = 0, size: number = 10) => {
    const response = await api.get(`/listTeams?page=${page}&size=${size}`);
    return response.data;
  },
  
  getTeamById: async (id: number) => {
    const response = await api.get(`/findATeam/${id}`);
    return response.data;
  },
  
  createTeam: async (teamData: any) => {
    const response = await api.post('/createTeam', teamData);
    return response.data;
  },
  
  updateTeam: async (id: number, teamData: any) => {
    const response = await api.put(`/updateTeam/${id}`, teamData);
    return response.data;
  },
  
  deleteTeam: async (id: number) => {
    const response = await api.delete(`/deleteTeam/${id}`);
    return response.data;
  },

  getTeamByPlayerId: async (playerId: number) => {
    const response = await api.get(`/teamByPlayerId/${playerId}`);
    return response.data;
  }
};

export { setAuthToken };
export default api;
