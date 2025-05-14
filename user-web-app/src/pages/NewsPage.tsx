import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate, Link } from 'react-router-dom';
import { 
  faSearch, 
  faCalendar, 
  faClock, 
  faArrowRight,
  faChevronDown,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const NewsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('fortnite');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leaderboardChartRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'tournaments', name: 'Tournaments' },
    { id: 'teams', name: 'Teams' },
    { id: 'updates', name: 'Game Updates' },
    { id: 'hardware', name: 'Hardware' },
    { id: 'industry', name: 'Industry' }
  ];

  const newsArticles = [
    {
      id: 1,
      title: "Fortnite World Cup 2025 Announced with Record $10M Prize Pool",
      excerpt: "Epic Games has officially announced the return of the Fortnite World Cup with the largest prize pool in esports history, setting new standards for competitive gaming.",
      category: "tournaments",
      date: "April 15, 2025",
      readTime: "5 min read",
      image: "https://readdy.ai/api/search-image?query=Fortnite%20World%20Cup%20esports%20tournament%20announcement%2C%20professional%20gaming%20arena%2C%20dramatic%20lighting%2C%20championship%20trophy%2C%20crowd%20of%20fans%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news1&orientation=landscape",
      featured: true
    },
    {
      id: 2,
      title: "Team Liquid Signs 16-Year-Old Valorant Prodigy to Roster",
      excerpt: "In a surprising move, Team Liquid has signed the youngest player in Valorant Champions Tour history to their professional roster ahead of Masters Berlin.",
      category: "teams",
      date: "April 14, 2025",
      readTime: "4 min read",
      image: "https://readdy.ai/api/search-image?query=Professional%20esports%20team%20signing%20ceremony%2C%20Team%20Liquid%20jersey%2C%20gaming%20organization%20headquarters%2C%20professional%20player%2C%20press%20conference%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news2&orientation=landscape",
      featured: true
    },
    {
      id: 3,
      title: "New Battle Royale 'Extinction' Breaks All Streaming Records",
      excerpt: "The newly released battle royale game has shattered viewership records on Twitch and YouTube Gaming during its launch weekend.",
      category: "updates",
      date: "April 12, 2025",
      readTime: "3 min read",
      image: "https://readdy.ai/api/search-image?query=New%20battle%20royale%20game%20launch%20event%2C%20streaming%20setup%20with%20multiple%20monitors%2C%20viewers%20count%20statistics%2C%20excited%20gamers%2C%20dramatic%20lighting%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news3&orientation=landscape"
    },
    {
      id: 4,
      title: "Riot Games Announces Major Format Changes to LCS 2025 Season",
      excerpt: "Significant changes are coming to the League of Legends Championship Series format that will reshape competitive play in North America.",
      category: "tournaments",
      date: "April 10, 2025",
      readTime: "6 min read",
      image: "https://readdy.ai/api/search-image?query=League%20of%20Legends%20Championship%20Series%20announcement%2C%20Riot%20Games%20headquarters%2C%20professional%20esports%20stage%2C%20tournament%20brackets%2C%20press%20conference%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news4&orientation=landscape"
    },
    {
      id: 5,
      title: "Next-Gen Gaming Controller Released for Competitive Players",
      excerpt: "The new controller promises to give competitive gamers an edge with advanced features, customization, and reduced input latency.",
      category: "hardware",
      date: "April 8, 2025",
      readTime: "4 min read",
      image: "https://readdy.ai/api/search-image?query=Professional%20gaming%20controller%20product%20launch%2C%20high-tech%20gaming%20hardware%2C%20detailed%20product%20photography%2C%20esports%20ready%20equipment%2C%20studio%20lighting%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news5&orientation=landscape"
    },
    {
      id: 6,
      title: "Esports Viewership Surpasses Traditional Sports Among Gen Z",
      excerpt: "A new Nielsen report shows esports has overtaken traditional sports viewership among 18-25 year olds for the first time.",
      category: "industry",
      date: "April 5, 2025",
      readTime: "7 min read",
      image: "https://readdy.ai/api/search-image?query=Esports%20viewership%20statistics%2C%20packed%20arena%20with%20fans%20watching%20gaming%20tournament%2C%20viewership%20graphs%20and%20charts%2C%20comparison%20with%20traditional%20sports%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news6&orientation=landscape"
    },
    {
      id: 7,
      title: "Apex Legends Global Series Finals Location Revealed",
      excerpt: "Electronic Arts has announced that the ALGS 2025 Championship will take place at the Staples Center in Los Angeles.",
      category: "tournaments",
      date: "April 3, 2025",
      readTime: "3 min read",
      image: "https://readdy.ai/api/search-image?query=Apex%20Legends%20Global%20Series%20finals%20announcement%2C%20Staples%20Center%20Los%20Angeles%2C%20esports%20arena%20setup%2C%20excited%20fans%2C%20dramatic%20lighting%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news7&orientation=landscape"
    },
    {
      id: 8,
      title: "New Study Shows Esports Athletes Have Faster Reaction Times Than F1 Drivers",
      excerpt: "Research from Oxford University reveals professional gamers outperform racing drivers in cognitive tests measuring reaction speed.",
      category: "industry",
      date: "March 30, 2025",
      readTime: "5 min read",
      image: "https://readdy.ai/api/search-image?query=Scientific%20study%20of%20esports%20athletes%2C%20cognitive%20testing%20lab%2C%20professional%20gamer%20with%20EEG%20cap%2C%20reaction%20time%20charts%2C%20research%20environment%2C%20ultra%20HD%2C%20photorealistic&width=600&height=400&seq=news8&orientation=landscape"
    }
  ];

  const filteredArticles = newsArticles
    .filter(article => 
      activeCategory === 'all' || article.category === activeCategory
    )
    .filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
        return a.title.localeCompare(b.title);
      }
    });

  const featuredArticles = newsArticles.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-blue-900/50 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://maysalward.com/wp-content/uploads/2024/02/eSports.maysalward-blog.jpg')] bg-cover opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Esports</span> News
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Stay updated with the latest tournaments, team news, game updates, and industry trends in competitive gaming.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search news articles..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="w-4 h-4 bg-purple-500 rounded-full mr-3"></span>
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {featuredArticles.map(article => (
                <div
                  key={article.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-900/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === article.category)?.name}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{article.excerpt}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main News Content */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Latest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
              <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <div
                key={article.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-900/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-gray-900/80 text-white px-2 py-1 rounded text-sm font-medium">
                    {categories.find(cat => cat.id === article.category)?.name}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">No articles found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          )}

          {filteredArticles.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-4 rounded-lg bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 font-semibold flex items-center">
                Load More Articles <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-gray-400 mb-6">
                  Subscribe to our newsletter and never miss important esports news, tournament announcements, and exclusive content.
                </p>
                <div className="flex space-x-4">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm">No spam</span>
                  </div>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm">Unsubscribe anytime</span>
                  </div>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full bg-gray-800 border-none rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="consent"
                      className="rounded bg-gray-800 border-gray-700 text-purple-500 focus:ring-purple-500 mr-2"
                      required
                    />
                    <label htmlFor="consent" className="text-sm text-gray-400">
                      I agree to receive marketing emails from Tournify
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;