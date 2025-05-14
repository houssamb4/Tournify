import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const HomePage: React.FC = () => {
const [isScrolled, setIsScrolled] = useState<boolean>(false);
const [activeTab, setActiveTab] = useState<string>('fortnite');
const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
const videoRef = useRef<HTMLVideoElement>(null);
const leaderboardChartRef = useRef<HTMLDivElement>(null);
const navigate = useNavigate();

// Handle navbar background change on scroll
useEffect(() => {
const handleScroll = () => {
if (window.scrollY > 50) {
setIsScrolled(true);
} else {
setIsScrolled(false);
}
};
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Initialize leaderboard chart
useEffect(() => {
if (leaderboardChartRef.current) {
const chart = echarts.init(leaderboardChartRef.current);
const option = {
animation: false,
tooltip: {
trigger: 'axis',
axisPointer: {
type: 'shadow'
}
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis: {
type: 'value',
boundaryGap: [0, 0.01],
axisLabel: {
color: '#fff'
},
axisLine: {
lineStyle: {
color: 'rgba(255, 255, 255, 0.2)'
}
},
splitLine: {
lineStyle: {
color: 'rgba(255, 255, 255, 0.1)'
}
}
},
yAxis: {
type: 'category',
data: ['NinjaGamer', 'ProSniper', 'MythicQueen', 'LegendX', 'VictoryRoyal', 'StormChaser', 'EliteGamer', 'ShadowWolf', 'TitanFury', 'EpicSlayer'],
axisLabel: {
color: '#fff'
},
axisLine: {
lineStyle: {
color: 'rgba(255, 255, 255, 0.2)'
}
}
},
series: [
{
name: 'Points',
type: 'bar',
data: [9850, 9720, 9580, 9320, 9150, 8970, 8840, 8720, 8650, 8540],
itemStyle: {
color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
{ offset: 0, color: '#3366ff' },
{ offset: 1, color: '#00ccff' }
])
}
}
]
};
chart.setOption(option);
const handleResize = () => {
chart.resize();
};
window.addEventListener('resize', handleResize);
return () => {
chart.dispose();
window.removeEventListener('resize', handleResize);
};
}
}, [activeTab]);

// Mute/unmute video
const toggleMute = (): void => {
if (videoRef.current) {
videoRef.current.muted = !videoRef.current.muted;
}
};

return (
  <div className="min-h-screen bg-gray-900 text-white">
    {/* Navigation */}
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Tournify
            </a>
            <div className="hidden md:flex ml-10 space-x-8">
              <a href="#" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Home</a>
              <a href="#tournaments" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Tournaments</a>
              <a href="#streams" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Live Streams</a>
              <a href="#leaderboards" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">Leaderboards</a>
              <a href="#news" className="hover:text-blue-400 transition-colors duration-300 cursor-pointer">News</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              id="signInButton"
              onClick={() => setIsSignInModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Sign In
            </button>
            {/* Sign In Modal */}
            {isSignInModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md relative">
                  <button
                    onClick={() => setIsSignInModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h2 className="text-2xl font-bold mb-6 text-center">Sign In to Tournify</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email or Username</label>
                      <input
                        type="text"
                        id="email"
                        className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email or username"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="w-full bg-gray-700 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="remember"
                          className="rounded bg-gray-700 border-none text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm">Remember me</label>
                      </div>
                      <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot Password?</a>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold !rounded-button whitespace-nowrap"
                    >
                      Sign In
                    </button>
                  </form>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <button className="flex justify-center items-center py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300 !rounded-button whitespace-nowrap">
                        <i className="fab fa-google text-xl"></i>
                      </button>
                      <button className="flex justify-center items-center py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300 !rounded-button whitespace-nowrap">
                        <i className="fab fa-facebook text-xl"></i>
                      </button>
                      <button className="flex justify-center items-center py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300 !rounded-button whitespace-nowrap">
                        <i className="fab fa-twitter text-xl"></i>
                      </button>
                    </div>
                  </div>
                  <p className="mt-6 text-center text-sm text-gray-400">
                    Don&apos;t have an account?{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                      Register now
                    </a>
                  </p>
                </div>
              </div>
            )}
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">
              Register
            </button>
            <button className="md:hidden text-white">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
    {/* Hero Section */}
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
        ref={videoRef}
        autoPlay
        loop
        muted
        className="object-cover w-full h-full"
        poster="/background.jpg"  
      >
        <source src="/background.mp4" type="video/mp4" />
        {/* Add fallback sources if needed */}
        <source src="/background.mp4" type="video/webm" />
        Your browser does not support the video tag.
      </video>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Compete.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Dominate.</span>
            <span className="block text-white">Become Legend.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Join the ultimate esports platform where champions are made. Compete in tournaments, stream your gameplay, and climb the ranks.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/join"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-lg shadow-blue-500/30 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Join Tournament
            </Link>
            <button className="px-8 py-4 rounded-lg bg-transparent border border-white/30 hover:border-white/60 backdrop-blur-sm transition-all duration-300 text-lg font-semibold !rounded-button whitespace-nowrap cursor-pointer">
              Watch Streams
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all duration-300 cursor-pointer"
      >
        <i className="fas fa-volume-mute text-white"></i>
      </button>
    </section>
    {/* Tournament Section */}
    <section id="tournaments" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Upcoming</span> Tournaments
          </h2>
          <button className="px-6 py-3 rounded-lg bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">
            View All <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "Fortnite World Cup Qualifier",
              game: "Fortnite",
              prize: "$100,000",
              players: "128/128",
              date: "April 25, 2025",
              image: "https://readdy.ai/api/search-image?query=Fortnite%20battle%20royale%20game%20scene%20with%20professional%20esports%20tournament%20setup%2C%20dramatic%20lighting%2C%20high-tech%20gaming%20arena%2C%20competitive%20atmosphere%2C%20ultra%20HD%2C%20photorealistic%20rendering&width=600&height=400&seq=tournament1&orientation=landscape"
            },
            {
              id: 2,
              title: "League of Legends Championship",
              game: "League of Legends",
              prize: "$250,000",
              players: "64/64",
              date: "May 2, 2025",
              image: "https://readdy.ai/api/search-image?query=League%20of%20Legends%20championship%20arena%20with%20professional%20esports%20tournament%20setup%2C%20dramatic%20lighting%2C%20high-tech%20gaming%20environment%2C%20competitive%20atmosphere%2C%20ultra%20HD%2C%20photorealistic%20rendering&width=600&height=400&seq=tournament2&orientation=landscape"
            },
            {
              id: 3,
              title: "Call of Duty Warzone Invitational",
              game: "Call of Duty",
              prize: "$75,000",
              players: "96/100",
              date: "April 30, 2025",
              image: "https://readdy.ai/api/search-image?query=Call%20of%20Duty%20Warzone%20battle%20scene%20with%20professional%20esports%20tournament%20setup%2C%20dramatic%20lighting%2C%20high-tech%20gaming%20arena%2C%20competitive%20atmosphere%2C%20ultra%20HD%2C%20photorealistic%20rendering&width=600&height=400&seq=tournament3&orientation=landscape"
            },
            {
              id: 4,
              title: "Valorant Masters Series",
              game: "Valorant",
              prize: "$150,000",
              players: "32/32",
              date: "May 10, 2025",
              image: "https://readdy.ai/api/search-image?query=Valorant%20competitive%20gameplay%20scene%20with%20professional%20esports%20tournament%20setup%2C%20dramatic%20lighting%2C%20high-tech%20gaming%20arena%2C%20competitive%20atmosphere%2C%20ultra%20HD%2C%20photorealistic%20rendering&width=600&height=400&seq=tournament4&orientation=landscape"
            },
            {
              id: 5,
              title: "Apex Legends Global Series",
              game: "Apex Legends",
              prize: "$120,000",
              players: "60/60",
              date: "May 5, 2025",
              image: "https://readdy.ai/api/search-image?query=Apex%20Legends%20battle%20royale%20scene%20with%20professional%20esports%20tournament%20setup%2C%20dramatic%20lighting%2C%20high-tech%20gaming%20arena%2C%20competitive%20atmosphere%2C%20ultra%20HD%2C%20photorealistic%20rendering&width=600&height=400&seq=tournament5&orientation=landscape"
            },
            {
              id: 6,
              title: "FIFA eWorld Cup",
              game: "EA Sports FC",
              prize: "$80,000",
              players: "16/16",
              date: "April 29, 2025",
              image: "https://digitalhub.fifa.com/transform/ae68f39e-06d9-4a92-90d4-8bc225cd62f7/FIFA-esports-participants"
            }
          ].map(tournament => (
            <div
              key={tournament.id}
              className="bg-gray-800 rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-900/20 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tournament.image}
                  alt={tournament.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {tournament.game}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tournament.title}</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-trophy text-yellow-500 mr-2"></i>
                    <span>{tournament.prize}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-users text-blue-400 mr-2"></i>
                    <span>{tournament.players}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar text-purple-400 mr-2"></i>
                    <span>{tournament.date}</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold !rounded-button whitespace-nowrap cursor-pointer">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* Live Streams Section */}
    <section id="streams" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Live</span> Streams
          </h2>
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold !rounded-button whitespace-nowrap cursor-pointer">
            Go Live <i className="fas fa-video ml-2"></i>
          </button>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-6 min-w-max">
            {[
              {
                id: 1,
                streamer: "NinjaGamer",
                avatar: "https://readdy.ai/api/search-image?query=Professional%20male%20esports%20gamer%20with%20headset%2C%20focused%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=100&height=100&seq=avatar1&orientation=squarish",
                title: "Fortnite Tournament Practice - Road to World Cup",
                game: "Fortnite",
                viewers: "12.5K",
                thumbnail: "https://readdy.ai/api/search-image?query=Fortnite%20gameplay%20stream%20with%20professional%20setup%2C%20streamer%20webcam%20overlay%2C%20chat%20interaction%2C%20high%20quality%20broadcast%2C%20esports%20tournament%20practice&width=500&height=300&seq=stream1&orientation=landscape"
              },
              {
                id: 2,
                streamer: "ProSniper",
                avatar: "https://readdy.ai/api/search-image?query=Professional%20female%20esports%20gamer%20with%20headset%2C%20confident%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=100&height=100&seq=avatar2&orientation=squarish",
                title: "Valorant Ranked Grind - Immortal Push",
                game: "Valorant",
                viewers: "8.3K",
                thumbnail: "https://readdy.ai/api/search-image?query=Valorant%20gameplay%20stream%20with%20professional%20setup%2C%20streamer%20webcam%20overlay%2C%20chat%20interaction%2C%20high%20quality%20broadcast%2C%20competitive%20ranked%20gameplay&width=500&height=300&seq=stream2&orientation=landscape"
              },
              {
                id: 3,
                streamer: "LegendX",
                avatar: "https://readdy.ai/api/search-image?query=Professional%20male%20esports%20gamer%20with%20headset%2C%20serious%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=100&height=100&seq=avatar3&orientation=squarish",
                title: "League of Legends Championship Qualifier",
                game: "League of Legends",
                viewers: "15.7K",
                thumbnail: "https://readdy.ai/api/search-image?query=League%20of%20Legends%20gameplay%20stream%20with%20professional%20setup%2C%20streamer%20webcam%20overlay%2C%20chat%20interaction%2C%20high%20quality%20broadcast%2C%20championship%20qualifier&width=500&height=300&seq=stream3&orientation=landscape"
              },
              {
                id: 4,
                streamer: "StormChaser",
                avatar: "https://readdy.ai/api/search-image?query=Professional%20female%20esports%20gamer%20with%20headset%2C%20focused%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=100&height=100&seq=avatar4&orientation=squarish",
                title: "Apex Legends Global Series Practice",
                game: "Apex Legends",
                viewers: "7.2K",
                thumbnail: "https://readdy.ai/api/search-image?query=Apex%20Legends%20gameplay%20stream%20with%20professional%20setup%2C%20streamer%20webcam%20overlay%2C%20chat%20interaction%2C%20high%20quality%20broadcast%2C%20global%20series%20practice&width=500&height=300&seq=stream4&orientation=landscape"
              }
            ].map(stream => (
              <div
                key={stream.id}
                className="flex-shrink-0 w-80 bg-gray-900 rounded-xl overflow-hidden shadow-xl shadow-black/30 group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-44 object-cover object-top"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                    <i className="fas fa-circle text-xs mr-1"></i> LIVE
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {stream.viewers} viewers
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <img
                      src={stream.avatar}
                      alt={stream.streamer}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h4 className="font-bold">{stream.streamer}</h4>
                      <p className="text-sm text-blue-400">{stream.game}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-3 line-clamp-2">{stream.title}</h3>
                  <button className="w-full py-2 rounded-lg bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">
                    Watch Stream
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    {/* Leaderboards Section */}
    <section id="leaderboards" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Global</span> Leaderboards
        </h2>
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            {['fortnite', 'valorant', 'league', 'apex', 'cod'].map((game) => (
              <button
                key={game}
                onClick={() => setActiveTab(game)}
                className={`px-5 py-3 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                  activeTab === game
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {game === 'fortnite' && 'Fortnite'}
                {game === 'valorant' && 'Valorant'}
                {game === 'league' && 'League of Legends'}
                {game === 'apex' && 'Apex Legends'}
                {game === 'cod' && 'Call of Duty'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-trophy text-yellow-500 mr-2"></i>
                Top Players
              </h3>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'NinjaGamer', points: 9850, winRate: '68%', avatar: "https://readdy.ai/api/search-image?query=Professional%20male%20gamer%20with%20headset%2C%20focused%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=50&height=50&seq=leaderAvatar1&orientation=squarish" },
                  { rank: 2, name: 'ProSniper', points: 9720, winRate: '65%', avatar: "https://readdy.ai/api/search-image?query=Professional%20female%20gamer%20with%20headset%2C%20confident%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=50&height=50&seq=leaderAvatar2&orientation=squarish" },
                  { rank: 3, name: 'MythicQueen', points: 9580, winRate: '63%', avatar: "https://readdy.ai/api/search-image?query=Professional%20female%20gamer%20with%20headset%2C%20serious%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=50&height=50&seq=leaderAvatar3&orientation=squarish" },
                  { rank: 4, name: 'LegendX', points: 9320, winRate: '61%', avatar: "https://readdy.ai/api/search-image?query=Professional%20male%20gamer%20with%20headset%2C%20focused%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=50&height=50&seq=leaderAvatar4&orientation=squarish" },
                  { rank: 5, name: 'VictoryRoyal', points: 9150, winRate: '60%', avatar: "https://readdy.ai/api/search-image?query=Professional%20male%20gamer%20with%20headset%2C%20confident%20expression%2C%20dramatic%20studio%20lighting%2C%20high%20quality%20portrait%2C%20photorealistic&width=50&height=50&seq=leaderAvatar5&orientation=squarish" }
                ].map(player => (
                  <div
                    key={player.rank}
                    className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                      {player.rank === 1 && <i className="fas fa-crown text-yellow-500"></i>}
                      {player.rank === 2 && <i className="fas fa-medal text-gray-300"></i>}
                      {player.rank === 3 && <i className="fas fa-medal text-amber-700"></i>}
                      {player.rank > 3 && player.rank}
                    </div>
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-10 h-10 rounded-full mx-3 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{player.name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-400">{player.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Win Rate: {player.winRate}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-lg bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">
                View Full Leaderboard
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <i className="fas fa-chart-bar text-blue-500 mr-2"></i>
                Points Distribution
              </h3>
              <div ref={leaderboardChartRef} className="w-full h-80"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* News Section */}
    <section id="news" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Latest</span> News
          </h2>
          <button className="px-6 py-3 rounded-lg bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer">
            View All News <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "Fortnite World Cup 2025 Announced with $10M Prize Pool",
              excerpt: "Epic Games has announced the return of the Fortnite World Cup with the biggest prize pool in esports history.",
              category: "Tournament",
              date: "April 15, 2025",
              readTime: "5 min read",
              image: "https://readdy.ai/api/search-image?query=Fortnite%20World%20Cup%20esports%20tournament%20announcement%2C%20professional%20gaming%20arena%2C%20dramatic%20lighting%2C%20championship%20trophy%2C%20crowd%20of%20fans%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news1&orientation=landscape"
            },
            {
              id: 2,
              title: "Pro Team Liquid Signs Rising Star for Valorant Roster",
              excerpt: "Team Liquid has announced the signing of a new prodigy to their professional Valorant roster ahead of Masters.",
              category: "Team News",
              date: "April 14, 2025",
              readTime: "3 min read",
              image: "https://readdy.ai/api/search-image?query=Professional%20esports%20team%20signing%20ceremony%2C%20Team%20Liquid%20jersey%2C%20gaming%20organization%20headquarters%2C%20professional%20player%2C%20press%20conference%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news2&orientation=landscape"
            },
            {
              id: 3,
              title: "New Battle Royale &apos;Extinction&apos; Breaks Streaming Records",
              excerpt: "The newly released battle royale game has broken all previous viewership records on streaming platforms.",
              category: "Game Release",
              date: "April 12, 2025",
              readTime: "4 min read",
              image: "https://readdy.ai/api/search-image?query=New%20battle%20royale%20game%20launch%20event%2C%20streaming%20setup%20with%20multiple%20monitors%2C%20viewers%20count%20statistics%2C%20excited%20gamers%2C%20dramatic%20lighting%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news3&orientation=landscape"
            },
            {
              id: 4,
              title: "Major Update Coming to League of Legends Championship Series",
              excerpt: "Riot Games announces significant format changes to the LCS that will reshape competitive play.",
              category: "Esports",
              date: "April 10, 2025",
              readTime: "6 min read",
              image: "https://readdy.ai/api/search-image?query=League%20of%20Legends%20Championship%20Series%20announcement%2C%20Riot%20Games%20headquarters%2C%20professional%20esports%20stage%2C%20tournament%20brackets%2C%20press%20conference%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news4&orientation=landscape"
            },
            {
              id: 5,
              title: "Gaming Hardware Giant Releases Pro Controller for Competitive Play",
              excerpt: "The new controller promises to give competitive gamers an edge with advanced features and customization.",
              category: "Hardware",
              date: "April 8, 2025",
              readTime: "4 min read",
              image: "https://readdy.ai/api/search-image?query=Professional%20gaming%20controller%20product%20launch%2C%20high-tech%20gaming%20hardware%2C%20detailed%20product%20photography%2C%20esports%20ready%20equipment%2C%20studio%20lighting%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news5&orientation=landscape"
            },
            {
              id: 6,
              title: "Esports Viewership Surpasses Traditional Sports for First Time",
              excerpt: "A new report shows that esports viewership has finally overtaken traditional sports among younger demographics.",
              category: "Industry",
              date: "April 5, 2025",
              readTime: "7 min read",
              image: "https://readdy.ai/api/search-image?query=Esports%20viewership%20statistics%2C%20packed%20arena%20with%20fans%20watching%20gaming%20tournament%2C%20viewership%20graphs%20and%20charts%2C%20comparison%20with%20traditional%20sports%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news6&orientation=landscape"
            }
          ].map(article => (
            <div
              key={article.id}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-900/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors duration-300">{article.title}</h3>
                <p className="text-gray-400 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="far fa-calendar mr-2"></i>
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="far fa-clock mr-2"></i>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/20 !rounded-button whitespace-nowrap cursor-pointer">
            Load More News <i className="fas fa-spinner ml-2"></i>
          </button>
        </div>
      </div>
    </section>
    {/* Footer */}
    <footer className="bg-gray-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <a href="#" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 inline-block">
              NEXUS<span className="text-white">ARENA</span>
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
                { name: "Home", url: "#" },
                { name: "Tournaments", url: "#tournaments" },
                { name: "Live Streams", url: "#streams" },
                { name: "Leaderboards", url: "#leaderboards" },
                { name: "News & Updates", url: "#news" },
                { name: "About Us", url: "#" }
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
}

export default HomePage;
