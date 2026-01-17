import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faPhone, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'; 


library.add(faArrowLeft, faUser, faEnvelope, faPhone, faGamepad);

const SecondPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [showTournamentDetails, setShowTournamentDetails] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [participationType, setParticipationType] = useState('individual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gamertag: '',
    teamName: '',
    skillLevel: 'intermediate',
    region: 'na',
    agreeToTerms: false
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    game: 'all',
    format: 'all',
    entryFeeMin: 0,
    entryFeeMax: 500,
    skillLevel: 'all',
    region: 'all'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      game: 'all',
      format: 'all',
      entryFeeMin: 0,
      entryFeeMax: 500,
      skillLevel: 'all',
      region: 'all'
    });
  };

  // View tournament details
  const viewTournamentDetails = (tournament: any) => {
    setSelectedTournament(tournament);
    setShowTournamentDetails(true);
    window.scrollTo(0, 0);
  };

  // Start registration process
  const startRegistration = () => {
    setShowTournamentDetails(false);
    setShowRegistrationForm(true);
    setActiveStep(2);
    window.scrollTo(0, 0);
  };

  // Submit registration form
  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegistrationForm(false);
    setShowConfirmation(true);
    setActiveStep(3);
    window.scrollTo(0, 0);
  };

  // Mock tournament data
  const tournaments = [
    {
      id: 1,
      title: "Fortnite World Cup Qualifier",
      game: "Fortnite",
      format: "Solo",
      prize: "$100,000",
      entryFee: "$25",
      players: "128/256",
      skillLevel: "Professional",
      region: "Global",
      startDate: "April 25, 2025",
      endDate: "April 27, 2025",
      registrationDeadline: "April 20, 2025",
      description: "Official qualifier for the Fortnite World Cup 2025. Top players will advance to the finals with a chance to compete for the $10M prize pool.",
      rules: "Standard Fortnite competitive rules apply. Matches will be played in a series of 6 games with points awarded for placement and eliminations.",
      prizeDistribution: "1st: $50,000, 2nd: $25,000, 3rd: $10,000, 4th-10th: $2,000 each, 11th-20th: $500 each",
      requirements: "Players must be at least 13 years old and have a verified Epic Games account with 2FA enabled.",
      image: "https://readdy.ai/api/search-image?query=Fortnite%2520competitive%2520tournament%2520with%2520professional%2520players%2520in%2520a%2520high-tech%2520esports%2520arena%2520with%2520large%2520screens%2520displaying%2520gameplay%252C%2520dramatic%2520lighting%252C%2520enthusiastic%2520audience%252C%2520official%2520tournament%2520branding%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament1&orientation=landscape"
    },
    {
      id: 2,
      title: "League of Legends Championship",
      game: "League of Legends",
      format: "Team",
      prize: "$250,000",
      entryFee: "$100",
      players: "64/64",
      skillLevel: "Professional",
      region: "North America",
      startDate: "May 2, 2025",
      endDate: "May 10, 2025",
      registrationDeadline: "April 25, 2025",
      description: "The premier League of Legends tournament in North America. Teams will compete in a double elimination bracket to crown the champion.",
      rules: "Standard LCS rules apply. All matches are best-of-three until finals which will be best-of-five.",
      prizeDistribution: "1st: $125,000, 2nd: $60,000, 3rd: $30,000, 4th: $15,000, 5th-8th: $5,000 each",
      requirements: "All team members must be at least 16 years old and have a verified Riot Games account.",
      image: "https://readdy.ai/api/search-image?query=League%2520of%2520Legends%2520championship%2520tournament%2520with%2520professional%2520teams%2520competing%2520on%2520stage%2520in%2520a%2520packed%2520arena%252C%2520dramatic%2520lighting%252C%2520team%2520logos%2520displayed%252C%2520commentators%2520at%2520desk%252C%2520enthusiastic%2520crowd%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament2&orientation=landscape"
    },
    {
      id: 3,
      title: "Call of Duty Warzone Invitational",
      game: "Call of Duty",
      format: "Team",
      prize: "$75,000",
      entryFee: "$50",
      players: "96/100",
      skillLevel: "Advanced",
      region: "Europe",
      startDate: "April 30, 2025",
      endDate: "May 1, 2025",
      registrationDeadline: "April 23, 2025",
      description: "An exclusive Warzone tournament featuring the best teams in Europe. Teams of 4 will battle in custom lobbies for the championship.",
      rules: "Custom Warzone lobbies with 25 teams per match. Points awarded for placement and eliminations across 5 matches.",
      prizeDistribution: "1st: $30,000, 2nd: $20,000, 3rd: $10,000, 4th-5th: $5,000 each, 6th-10th: $1,000 each",
      requirements: "Players must be at least 18 years old and have a verified Activision account.",
      image: "https://readdy.ai/api/search-image?query=Call%2520of%2520Duty%2520Warzone%2520tournament%2520with%2520teams%2520competing%2520in%2520a%2520professional%2520esports%2520setup%252C%2520multiple%2520screens%2520showing%2520gameplay%252C%2520team%2520branding%252C%2520dramatic%2520lighting%252C%2520commentators%2520and%2520analysts%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament3&orientation=landscape"
    },
    {
      id: 4,
      title: "Valorant Masters Series",
      game: "Valorant",
      format: "Team",
      prize: "$150,000",
      entryFee: "$75",
      players: "32/32",
      skillLevel: "Professional",
      region: "Asia",
      startDate: "May 10, 2025",
      endDate: "May 15, 2025",
      registrationDeadline: "May 1, 2025",
      description: "The most prestigious Valorant tournament in Asia. Teams will compete in a round-robin group stage followed by a single elimination playoff.",
      rules: "Standard Valorant competitive rules apply. All matches are best-of-three until finals which will be best-of-five.",
      prizeDistribution: "1st: $75,000, 2nd: $35,000, 3rd: $20,000, 4th: $10,000, 5th-8th: $2,500 each",
      requirements: "All team members must be at least 16 years old and have a verified Riot Games account.",
      image: "https://readdy.ai/api/search-image?query=Valorant%2520Masters%2520tournament%2520with%2520professional%2520teams%2520on%2520stage%2520in%2520a%2520high-tech%2520esports%2520arena%252C%2520large%2520screens%2520showing%2520gameplay%252C%2520team%2520logos%252C%2520dramatic%2520lighting%252C%2520enthusiastic%2520crowd%252C%2520official%2520Valorant%2520branding%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament4&orientation=landscape"
    },
    {
      id: 5,
      title: "Apex Legends Global Series",
      game: "Apex Legends",
      format: "Team",
      prize: "$120,000",
      entryFee: "$60",
      players: "60/60",
      skillLevel: "Professional",
      region: "Global",
      startDate: "May 5, 2025",
      endDate: "May 7, 2025",
      registrationDeadline: "April 28, 2025",
      description: "The official Apex Legends Global Series tournament. Teams of 3 will compete in a series of matches to determine the champion.",
      rules: "Standard ALGS rules apply. Points awarded for placement and eliminations across 6 matches.",
      prizeDistribution: "1st: $50,000, 2nd: $30,000, 3rd: $15,000, 4th-5th: $7,500 each, 6th-10th: $2,000 each",
      requirements: "All team members must be at least 16 years old and have a verified EA account.",
      image: "https://readdy.ai/api/search-image?query=Apex%2520Legends%2520Global%2520Series%2520tournament%2520with%2520professional%2520teams%2520competing%2520in%2520a%2520high-tech%2520esports%2520arena%252C%2520multiple%2520screens%2520showing%2520gameplay%252C%2520team%2520logos%252C%2520commentators%2520at%2520desk%252C%2520enthusiastic%2520crowd%252C%2520official%2520ALGS%2520branding%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament5&orientation=landscape"
    },
    {
      id: 6,
      title: "Rocket League Championship",
      game: "Rocket League",
      format: "Team",
      prize: "$80,000",
      entryFee: "$40",
      players: "16/16",
      skillLevel: "Advanced",
      region: "Europe",
      startDate: "April 29, 2025",
      endDate: "April 30, 2025",
      registrationDeadline: "April 22, 2025",
      description: "The premier Rocket League tournament in Europe. Teams will compete in a double elimination bracket to crown the champion.",
      rules: "Standard RLCS rules apply. All matches are best-of-five until finals which will be best-of-seven.",
      prizeDistribution: "1st: $40,000, 2nd: $20,000, 3rd: $10,000, 4th: $5,000, 5th-8th: $1,250 each",
      requirements: "All team members must be at least 15 years old and have a verified Epic Games account.",
      image: "https://readdy.ai/api/search-image?query=Rocket%2520League%2520Championship%2520tournament%2520with%2520professional%2520teams%2520competing%2520on%2520stage%2520in%2520a%2520packed%2520arena%252C%2520large%2520screens%2520showing%2520gameplay%252C%2520dramatic%2520lighting%252C%2520team%2520logos%252C%2520enthusiastic%2520crowd%252C%2520official%2520RLCS%2520branding%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament6&orientation=landscape"
    },
    {
      id: 7,
      title: "Overwatch Contenders Series",
      game: "Overwatch",
      format: "Team",
      prize: "$60,000",
      entryFee: "$30",
      players: "12/16",
      skillLevel: "Advanced",
      region: "North America",
      startDate: "May 12, 2025",
      endDate: "May 14, 2025",
      registrationDeadline: "May 5, 2025",
      description: "The official Overwatch Contenders tournament for North America. Teams will compete in a round-robin group stage followed by a single elimination playoff.",
      rules: "Standard Overwatch Contenders rules apply. All matches are best-of-five.",
      prizeDistribution: "1st: $30,000, 2nd: $15,000, 3rd: $7,500, 4th: $3,500, 5th-8th: $1,000 each",
      requirements: "All team members must be at least 16 years old and have a verified Battle.net account.",
      image: "https://readdy.ai/api/search-image?query=Overwatch%2520Contenders%2520tournament%2520with%2520professional%2520teams%2520competing%2520in%2520a%2520high-tech%2520esports%2520arena%252C%2520large%2520screens%2520showing%2520gameplay%252C%2520team%2520logos%252C%2520commentators%2520at%2520desk%252C%2520enthusiastic%2520crowd%252C%2520official%2520Overwatch%2520branding%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament7&orientation=landscape"
    },
    {
      id: 8,
      title: "Counter-Strike 2 Major",
      game: "Counter-Strike",
      format: "Team",
      prize: "$200,000",
      entryFee: "$100",
      players: "24/24",
      skillLevel: "Professional",
      region: "Global",
      startDate: "May 15, 2025",
      endDate: "May 22, 2025",
      registrationDeadline: "May 1, 2025",
      description: "The prestigious Counter-Strike 2 Major tournament. Teams will compete in a Swiss system group stage followed by a single elimination playoff.",
      rules: "Standard CS2 Major rules apply. Group stage matches are best-of-one, playoff matches are best-of-three.",
      prizeDistribution: "1st: $100,000, 2nd: $50,000, 3rd-4th: $15,000 each, 5th-8th: $5,000 each",
      requirements: "All team members must be at least 16 years old and have a verified Steam account.",
      image: "https://readdy.ai/api/search-image?query=Counter-Strike%2520Major%2520tournament%2520with%2520professional%2520teams%2520competing%2520on%2520stage%2520in%2520a%2520packed%2520arena%252C%2520large%2520screens%2520showing%2520gameplay%252C%2520team%2520logos%252C%2520dramatic%2520lighting%252C%2520enthusiastic%2520crowd%252C%2520official%2520CS2%2520branding%252C%2520ultra%2520HD%2520photorealistic%2520rendering&width=800&height=400&seq=tournament8&orientation=landscape"
    }
  ];

  const filteredTournaments = tournaments.filter(tournament => {
    if (filters.search && !tournament.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.game !== 'all' && tournament.game !== filters.game) {
      return false;
    }
    
    if (filters.format !== 'all' && tournament.format !== filters.format) {
      return false;
    }
    
    const entryFeeValue = parseInt(tournament.entryFee.replace('$', ''));
    if (entryFeeValue < filters.entryFeeMin || entryFeeValue > filters.entryFeeMax) {
      return false;
    }
    
    if (filters.skillLevel !== 'all' && tournament.skillLevel !== filters.skillLevel) {
      return false;
    }
    
    if (filters.region !== 'all' && tournament.region !== filters.region) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Tournify
            </a>
              <div className="hidden md:flex ml-10 space-x-8">
                <a href="https://readdy.ai/home/883c499d-8614-4974-a263-038c34ac54e5/ed2200d6-98b9-4bcd-b9da-a585f6d452c2" data-readdy="true" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Home</a>
                <a href="#" className="text-blue-400 border-b-2 border-blue-400 cursor-pointer">Tournaments</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Live Streams</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Leaderboards</a>
                <a href="#" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">News</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-lg bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">
                Sign In
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">Register</button>
              <button className="md:hidden text-white cursor-pointer">
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-20">
        {/* Breadcrumb */}
        <div className="bg-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center text-sm">
              <a href="https://readdy.ai/home/883c499d-8614-4974-a263-038c34ac54e5/ed2200d6-98b9-4bcd-b9da-a585f6d452c2" data-readdy="true" className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">Home</a>
              <i className="fas fa-chevron-right text-gray-600 mx-2 text-xs"></i>
              <span className="text-white">Tournaments</span>
              {selectedTournament && (
                <>
                  <i className="fas fa-chevron-right text-gray-600 mx-2 text-xs"></i>
                  <span className="text-white">{selectedTournament.title}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 1 ? 'bg-blue-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  <i className="fas fa-search"></i>
                </div>
                <span className="text-sm font-medium">Browse</span>
              </div>
              <div className={`w-24 h-1 ${activeStep >= 2 ? 'bg-blue-400' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 2 ? 'bg-blue-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  <i className="fas fa-user-plus"></i>
                </div>
                <span className="text-sm font-medium">Register</span>
              </div>
              <div className={`w-24 h-1 ${activeStep >= 3 ? 'bg-blue-400' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 3 ? 'bg-blue-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  <i className="fas fa-check"></i>
                </div>
                <span className="text-sm font-medium">Confirm</span>
              </div>
            </div>
          </div>
        </div>

{/* Tournament Browse Section */}
{activeStep === 1 && !showTournamentDetails && (
  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-8 text-center md:text-left">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Available</span> Tournaments
      </h1>
      <p className="text-gray-400 text-base sm:text-lg max-w-3xl">
        Browse and register for upcoming tournaments across various games and skill levels.
      </p>
    </div>

    {/* Filters */}
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-white">Filter Tournaments</h2>
        <button 
          onClick={resetFilters}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <i className="fas fa-redo text-xs"></i>
          Reset Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium mb-2 text-gray-300">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tournaments..."
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Game Type */}
        <div>
          <label htmlFor="game" className="block text-sm font-medium mb-2 text-gray-300">Game</label>
          <div className="relative">
            <select
              id="game"
              name="game"
              value={filters.game}
              onChange={handleFilterChange}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-3 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none text-sm transition-all duration-200"
            >
              <option value="all">All Games</option>
              <option value="Fortnite">Fortnite</option>
              <option value="League of Legends">League of Legends</option>
              <option value="Call of Duty">Call of Duty</option>
              <option value="Valorant">Valorant</option>
              <option value="Apex Legends">Apex Legends</option>
              <option value="Rocket League">Rocket League</option>
              <option value="Overwatch">Overwatch</option>
              <option value="Counter-Strike">Counter-Strike</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tournament Format */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium mb-2 text-gray-300">Format</label>
          <div className="relative">
            <select
              id="format"
              name="format"
              value={filters.format}
              onChange={handleFilterChange}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-3 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none text-sm transition-all duration-200"
            >
              <option value="all">All Formats</option>
              <option value="Solo">Solo</option>
              <option value="Team">Team</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Entry Fee Range */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="entryFeeRange" className="block text-sm font-medium mb-2 text-gray-300">Entry Fee</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">$</span>
              <input
                type="number"
                id="entryFeeMin"
                name="entryFeeMin"
                value={filters.entryFeeMin}
                onChange={handleFilterChange}
                min="0"
                max="500"
                placeholder="Min"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-8 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all duration-200"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">$</span>
              <input
                type="number"
                id="entryFeeMax"
                name="entryFeeMax"
                value={filters.entryFeeMax}
                onChange={handleFilterChange}
                min="0"
                max="500"
                placeholder="Max"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-8 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label htmlFor="skillLevel" className="block text-sm font-medium mb-2 text-gray-300">Skill Level</label>
          <div className="relative">
            <select
              id="skillLevel"
              name="skillLevel"
              value={filters.skillLevel}
              onChange={handleFilterChange}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-3 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none text-sm transition-all duration-200"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Region */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium mb-2 text-gray-300">Region</label>
          <div className="relative">
            <select
              id="region"
              name="region"
              value={filters.region}
              onChange={handleFilterChange}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-3 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none text-sm transition-all duration-200"
            >
              <option value="all">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="South America">South America</option>
              <option value="Oceania">Oceania</option>
              <option value="Global">Global</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

{/* Tournament Tabs */}
<div className="bg-gray-800 rounded-xl p-6 shadow-xl">
  <div className="flex mb-8 border-b border-gray-700 overflow-x-auto scrollbar-hide">
    {['all', 'featured', 'upcoming', 'open', 'closing'].map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-5 py-3 font-medium whitespace-nowrap cursor-pointer transition-colors ${
          activeTab === tab
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        {tab === 'all' && 'All Tournaments'}
        {tab === 'featured' && 'Featured'}
        {tab === 'upcoming' && 'Upcoming'}
        {tab === 'open' && 'Open Registration'}
        {tab === 'closing' && 'Closing Soon'}
      </button>
    ))}
  </div>
</div>

    {/* Tournament Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTournaments.length > 0 ? (
        filteredTournaments.map(tournament => (
          <div
            key={tournament.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
            onClick={() => viewTournamentDetails(tournament)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={tournament.image}
                alt={tournament.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-blue-600/90 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  {tournament.game}
                </span>
                <span className="bg-purple-600/90 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  {tournament.format}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-gray-900/80 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {tournament.entryFee}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2 line-clamp-1">{tournament.title}</h3>
              <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>{tournament.prize}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{tournament.players}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{tournament.startDate}</span>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  viewTournamentDetails(tournament);
                }}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2"
              >
                View Details
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-3 py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">No tournaments found</h3>
          <p className="text-gray-400 max-w-md mx-auto">Try adjusting your filters or search for different terms.</p>
        </div>
      )}
    </div>
  </div>
)}

        {/* Tournament Details */}
        {showTournamentDetails && selectedTournament && (
          <div className="container mx-auto px-6 py-10">
            <div className="mb-6">
              <button 
                onClick={() => {
                  setShowTournamentDetails(false);
                  setSelectedTournament(null);
                }}
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to tournaments
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={selectedTournament.image}
                  alt={selectedTournament.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedTournament.game}
                    </div>
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedTournament.format}
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedTournament.skillLevel}
                    </div>
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedTournament.region}
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">{selectedTournament.title}</h1>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-blue-400 text-sm font-medium mb-1">Prize Pool</div>
                    <div className="text-2xl font-bold">{selectedTournament.prize}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-blue-400 text-sm font-medium mb-1">Entry Fee</div>
                    <div className="text-2xl font-bold">{selectedTournament.entryFee}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-blue-400 text-sm font-medium mb-1">Players</div>
                    <div className="text-2xl font-bold">{selectedTournament.players}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-blue-400 text-sm font-medium mb-1">Registration Deadline</div>
                    <div className="text-2xl font-bold">{selectedTournament.registrationDeadline}</div>
                  </div>
                </div>

                <div className="mb-8 border-b border-gray-700">
                  <div className="flex overflow-x-auto">
                    {['overview', 'rules', 'prizes', 'schedule', 'requirements'].map(tab => (
                      <button
                        key={tab}
                        className={`px-6 py-3 font-medium text-lg whitespace-nowrap cursor-pointer ${
                          'overview' === tab
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {tab === 'overview' && 'Overview'}
                        {tab === 'rules' && 'Rules & Format'}
                        {tab === 'prizes' && 'Prize Distribution'}
                        {tab === 'schedule' && 'Schedule'}
                        {tab === 'requirements' && 'Requirements'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Tournament Overview</h2>
                  <p className="text-gray-300 mb-6">{selectedTournament.description}</p>
                  
                  <h3 className="text-xl font-bold mb-3">Tournament Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <i className="fas fa-calendar-alt text-blue-400 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium">Tournament Dates</div>
                        <div className="text-gray-400">{selectedTournament.startDate} - {selectedTournament.endDate}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-clock text-blue-400 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium">Registration Deadline</div>
                        <div className="text-gray-400">{selectedTournament.registrationDeadline}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-users text-blue-400 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium">Format</div>
                        <div className="text-gray-400">{selectedTournament.format}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-globe-americas text-blue-400 mt-1 mr-3"></i>
                      <div>
                        <div className="font-medium">Region</div>
                        <div className="text-gray-400">{selectedTournament.region}</div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">Rules & Format</h3>
                  <p className="text-gray-300 mb-6">{selectedTournament.rules}</p>
                  
                  <h3 className="text-xl font-bold mb-3">Prize Distribution</h3>
                  <p className="text-gray-300 mb-6">{selectedTournament.prizeDistribution}</p>
                  
                  <h3 className="text-xl font-bold mb-3">Requirements</h3>
                  <p className="text-gray-300">{selectedTournament.requirements}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={startRegistration}
                    className="flex-1 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-lg shadow-blue-500/30 !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    Register Now
                  </button>
                  <button className="flex-1 py-4 rounded-lg bg-transparent border border-white/30 hover:border-white/60 backdrop-blur-sm transition-all duration-300 text-lg font-semibold !rounded-button whitespace-nowrap cursor-pointer">
                    Share Tournament <i className="fas fa-share-alt ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {showRegistrationForm && selectedTournament && (
          <div className="container mx-auto px-6 py-10">
            <div className="mb-6">
              <button 
                onClick={() => {
                  setShowRegistrationForm(false);
                  setShowTournamentDetails(true);
                  setActiveStep(1);
                }}
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to tournament details
              </button>
            </div>

            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Register for Tournament</h1>
              <p className="text-gray-400 mb-8">{selectedTournament.title}</p>

              <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
                <h2 className="text-xl font-bold mb-6">Registration Information</h2>
                
                {selectedTournament.format === 'Team' && (
                  <div className="mb-6">
                    <label className="block text-lg font-medium mb-4">Participation Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setParticipationType('individual')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          participationType === 'individual' 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            participationType === 'individual' ? 'border-blue-500' : 'border-gray-500'
                          }`}>
                            {participationType === 'individual' && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <h3 className="font-bold">Individual Player</h3>
                        </div>
                        <p className="text-sm text-gray-400 ml-8">
                          Register as an individual player. You&apos;ll be matched with other players or assigned to a team.
                        </p>
                      </div>
                      <div 
                        onClick={() => setParticipationType('team')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          participationType === 'team' 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            participationType === 'team' ? 'border-blue-500' : 'border-gray-500'
                          }`}>
                            {participationType === 'team' && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <h3 className="font-bold">Team Registration</h3>
                        </div>
                        <p className="text-sm text-gray-400 ml-8">
                          Register as a team. You&apos;ll need to provide details for all team members.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={submitRegistration}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="gamertag" className="block text-sm font-medium mb-2">Gamertag / In-game Name</label>
                      <input
                        type="text"
                        id="gamertag"
                        name="gamertag"
                        value={formData.gamertag}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your gamertag"
                      />
                    </div>
                    
                    {participationType === 'team' && (
                      <div>
                        <label htmlFor="teamName" className="block text-sm font-medium mb-2">Team Name</label>
                        <input
                          type="text"
                          id="teamName"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your team name"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="skillLevel" className="block text-sm font-medium mb-2">Skill Level</label>
                      <div className="relative">
                        <select
                          id="skillLevel"
                          name="skillLevel"
                          value={formData.skillLevel}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-700 border-none rounded-lg pl-4 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="professional">Professional</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium mb-2">Region</label>
                      <div className="relative">
                        <select
                          id="region"
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-700 border-none rounded-lg pl-4 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="na">North America</option>
                          <option value="eu">Europe</option>
                          <option value="asia">Asia</option>
                          <option value="sa">South America</option>
                          <option value="oce">Oceania</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                        </div>
                      </div>
                    </div>
                    
                    {participationType === 'team' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Team Members</label>
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map(index => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-medium">
                                {index}
                              </div>
                              <input
                                type="text"
                                className="flex-1 bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={index === 1 ? "Team Captain (You)" : `Team Member ${index}`}
                                disabled={index === 1}
                                value={index === 1 ? formData.gamertag : ''}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Note: You are registered as the team captain. You can add or edit team members later.
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-lg font-bold mb-4">Payment Information</h3>
                      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <i className="fas fa-info-circle text-blue-400 mt-1 mr-3"></i>
                          <div>
                            <p className="text-blue-300 font-medium">Entry Fee: {selectedTournament.entryFee}</p>
                            <p className="text-sm text-blue-200/70">
                              Payment will be processed securely. You can cancel your registration up to 48 hours before the tournament starts for a full refund.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center justify-center w-12 h-8 bg-gray-700 rounded">
                          <i className="fab fa-cc-visa text-xl text-white"></i>
                        </div>
                        <div className="flex items-center justify-center w-12 h-8 bg-gray-700 rounded">
                          <i className="fab fa-cc-mastercard text-xl text-white"></i>
                        </div>
                        <div className="flex items-center justify-center w-12 h-8 bg-gray-700 rounded">
                          <i className="fab fa-cc-paypal text-xl text-white"></i>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium mb-2">Name on Card</label>
                          <input
                            type="text"
                            id="cardName"
                            className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter name on card"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">Card Number</label>
                          <input
                            type="text"
                            id="cardNumber"
                            className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="XXXX XXXX XXXX XXXX"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="expiry" className="block text-sm font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            id="expiry"
                            className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium mb-2">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="XXX"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeToTerms"
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          required
                          className="w-4 h-4 rounded bg-gray-700 border-none text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                      </div>
                      <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-300">
                        I agree to the tournament rules and the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>. I understand that my registration is subject to approval.
                      </label>
                    </div>
                    
                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-lg shadow-blue-500/30 !rounded-button whitespace-nowrap cursor-pointer"
                      >
                        Complete Registration
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Section */}
        {showConfirmation && selectedTournament && (
          <div className="container mx-auto px-6 py-10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800 rounded-xl p-8 shadow-xl text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check text-3xl text-green-500"></i>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">Registration Successful!</h1>
                <p className="text-gray-400 mb-8">You have successfully registered for {selectedTournament.title}</p>
                
                <div className="bg-gray-700 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Registration Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                    <div>
                      <div className="text-sm text-gray-400">Tournament</div>
                      <div className="font-medium">{selectedTournament.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Registration Date</div>
                      <div className="font-medium">April 18, 2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Tournament Date</div>
                      <div className="font-medium">{selectedTournament.startDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Confirmation Number</div>
                      <div className="font-medium">#TRN-{Math.floor(100000 + Math.random() * 900000)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Entry Fee</div>
                      <div className="font-medium">{selectedTournament.entryFee}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Payment Status</div>
                      <div className="text-green-400 font-medium">Paid</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-6">
                    <h3 className="font-bold mb-3">Next Steps</h3>
                    <ul className="text-left space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <i className="fas fa-envelope text-blue-400 mt-1 mr-3"></i>
                        <span>Check your email for a confirmation and additional details</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-calendar-check text-blue-400 mt-1 mr-3"></i>
                        <span>Mark your calendar for {selectedTournament.startDate}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-users text-blue-400 mt-1 mr-3"></i>
                        <span>Join the tournament Discord server for updates and communication</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-gamepad text-blue-400 mt-1 mr-3"></i>
                        <span>Prepare your setup and practice for the tournament</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://readdy.ai/home/883c499d-8614-4974-a263-038c34ac54e5/ed2200d6-98b9-4bcd-b9da-a585f6d452c2" 
                    data-readdy="true"
                    className="flex-1 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-lg shadow-blue-500/30 !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    Return to Home
                  </a>
                  <button className="flex-1 py-4 rounded-lg bg-transparent border border-white/30 hover:border-white/60 backdrop-blur-sm transition-all duration-300 text-lg font-semibold !rounded-button whitespace-nowrap cursor-pointer">
                    View My Tournaments
                  </button>
                </div>
                
                <div className="mt-8">
                  <p className="text-gray-400 mb-3">Share your registration</p>
                  <div className="flex justify-center space-x-4">
                    {['facebook', 'twitter', 'instagram', 'discord'].map(social => (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group cursor-pointer"
                      >
                        <i className={`fab fa-${social} text-gray-400 group-hover:text-white`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <a href="https://readdy.ai/home/883c499d-8614-4974-a263-038c34ac54e5/ed2200d6-98b9-4bcd-b9da-a585f6d452c2" data-readdy="true" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 inline-block">
                Tournify
              </a>
              <p className="text-gray-400 mb-6">
                The ultimate esports platform for competitive gamers. Join tournaments, stream your gameplay, and climb the global leaderboards.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube', 'twitch'].map(social => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group cursor-pointer"
                  >
                    <i className={`fab fa-${social} text-gray-400 group-hover:text-white`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { name: "Home", url: "https://readdy.ai/home/883c499d-8614-4974-a263-038c34ac54e5/ed2200d6-98b9-4bcd-b9da-a585f6d452c2", isExternal: true },
                  { name: "Tournaments", url: "#", isExternal: false },
                  { name: "Live Streams", url: "#", isExternal: false },
                  { name: "Leaderboards", url: "#", isExternal: false },
                  { name: "News & Updates", url: "#", isExternal: false },
                  { name: "About Us", url: "#", isExternal: false }
                ].map(link => (
                  <li key={link.name}>
                    {link.isExternal ? (
                      <a
                        href={link.url}
                        data-readdy="true"
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <a
                        href={link.url}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Support</h4>
              <ul className="space-y-4">
                {[
                  { name: "Help Center", url: "#" },
                  { name: "Community Guidelines", url: "#" },
                  { name: "Terms of Service", url: "#" },
                  { name: "Privacy Policy", url: "#" },
                  { name: "Contact Us", url: "#" }
                ].map(link => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter to get the latest updates on tournaments and events.
              </p>
              <form className="mb-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 bg-gray-800 border-none rounded-l-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                </div>
                <div className="flex items-center">
                  <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                </div>
                <div className="flex items-center">
                  <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
                </div>
                <div className="flex items-center">
                  <i className="fab fa-cc-apple-pay text-2xl text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 NexusArena. All rights reserved.
            </p>
            <div className="flex items-center">
              <div className="relative mr-4">
                <button className="flex items-center bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
                  <i className="fas fa-globe mr-2"></i>
                  English
                  <i className="fas fa-chevron-down ml-2 text-xs"></i>
                </button>
              </div>
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors duration-300 cursor-pointer">
                <i className="fas fa-arrow-up"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecondPage;

