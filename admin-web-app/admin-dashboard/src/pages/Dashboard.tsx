import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as echarts from 'echarts';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMatches, setActiveMatches] = useState(12);
  const [activeTournaments, setActiveTournaments] = useState(8);
  const [userRegistrations, setUserRegistrations] = useState(1243);
  const [totalPrizePool, setTotalPrizePool] = useState(850000);

  // Refs for chart containers
  const userChartRef = useRef<HTMLDivElement>(null);
  const prizeChartRef = useRef<HTMLDivElement>(null);
  const serverChartRef = useRef<HTMLDivElement>(null);
  const distributionChartRef = useRef<HTMLDivElement>(null);

  // Chart instances ref
  const chartsRef = useRef<{
    userChart: echarts.ECharts | null;
    prizeChart: echarts.ECharts | null;
    serverChart: echarts.ECharts | null;
    distributionChart: echarts.ECharts | null;
  }>({
    userChart: null,
    prizeChart: null,
    serverChart: null,
    distributionChart: null
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Initialize charts when component mounts
    const initializeCharts = () => {
      if (userChartRef.current) {
        chartsRef.current.userChart = echarts.init(userChartRef.current);
        const userOption = {
          animation: false,
          grid: { top: 0, right: 0, bottom: 0, left: 0 },
          xAxis: { show: false, type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
          yAxis: { show: false, type: 'value' },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: '#6366F1' },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
            ]} }
          }]
        };
        chartsRef.current.userChart?.setOption(userOption);
      }

      if (prizeChartRef.current) {
        chartsRef.current.prizeChart = echarts.init(prizeChartRef.current);
        const prizeOption = {
          animation: false,
          grid: { top: 0, right: 0, bottom: 0, left: 0 },
          xAxis: { show: false, type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
          yAxis: { show: false, type: 'value' },
          series: [{
            data: [150000, 200000, 350000, 400000, 500000, 700000, 850000],
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: '#10B981' },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
            ]} }
          }]
        };
        chartsRef.current.prizeChart?.setOption(prizeOption);
      }

      if (serverChartRef.current) {
        chartsRef.current.serverChart = echarts.init(serverChartRef.current);
        const serverOption = {
          animation: false,
          grid: { top: 10, right: 10, bottom: 10, left: 10 },
          xAxis: { show: false, type: 'category', data: Array.from({length: 24}, (_, i) => i) },
          yAxis: { show: false, type: 'value', min: 0, max: 100 },
          series: [{
            data: [45, 42, 44, 41, 38, 43, 42, 45, 48, 50, 52, 53, 55, 58, 56, 54, 52, 50, 48, 45, 42, 40, 38, 41],
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: '#3B82F6' },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]} }
          }]
        };
        chartsRef.current.serverChart?.setOption(serverOption);
      }

      if (distributionChartRef.current) {
        chartsRef.current.distributionChart = echarts.init(distributionChartRef.current);
        const distributionOption = {
          animation: false,
          tooltip: { trigger: 'item' },
          legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#64748B' } },
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            emphasis: { label: { show: false } },
            data: [
              { value: 500000, name: '1st Place', itemStyle: { color: '#6366F1' } },
              { value: 200000, name: '2nd Place', itemStyle: { color: '#8B5CF6' } },
              { value: 100000, name: '3rd Place', itemStyle: { color: '#EC4899' } },
              { value: 50000, name: '4th Place', itemStyle: { color: '#F43F5E' } }
            ]
          }]
        };
        chartsRef.current.distributionChart?.setOption(distributionOption);
      }
    };

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Initialize charts after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeCharts();
    }, 100);

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      // Dispose all charts
      Object.values(chartsRef.current).forEach(chart => {
        chart?.dispose();
      });
    };
  }, []);

  // Handle window resize for charts
  useEffect(() => {
    const handleResize = () => {
      Object.values(chartsRef.current).forEach(chart => {
        chart?.resize();
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div className={`fixed h-full bg-gray-900 text-white transition-all duration-300 z-10 ${isMenuOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className={`flex items-center ${isMenuOpen ? 'justify-start' : 'justify-center w-full'}`}>
            <i className="fas fa-gamepad text-indigo-500 text-2xl"></i>
            {isMenuOpen && <span className="ml-3 font-bold text-xl">Tournify Admin</span>}
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white cursor-pointer !rounded-button whitespace-nowrap">
            <i className={`fas ${isMenuOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        <nav className="mt-5">
          <ul>
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-gray-800 text-indigo-500' : 'text-gray-400'}`}
              >
                <i className="fas fa-tachometer-alt w-6 text-center"></i>
                {isMenuOpen && <span className="ml-3">Dashboard</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('tournaments')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap ${activeTab === 'tournaments' ? 'bg-gray-800 text-indigo-500' : 'text-gray-400'}`}
              >
                <i className="fas fa-trophy w-6 text-center"></i>
                {isMenuOpen && <span className="ml-3">Tournaments</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap ${activeTab === 'users' ? 'bg-gray-800 text-indigo-500' : 'text-gray-400'}`}
              >
                <i className="fas fa-users w-6 text-center"></i>
                {isMenuOpen && <span className="ml-3">User Management</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('moderation')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap ${activeTab === 'moderation' ? 'bg-gray-800 text-indigo-500' : 'text-gray-400'}`}
              >
                <i className="fas fa-shield-alt w-6 text-center"></i>
                {isMenuOpen && <span className="ml-3">Content Moderation</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('finance')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap ${activeTab === 'finance' ? 'bg-gray-800 text-indigo-500' : 'text-gray-400'}`}
              >
                <i className="fas fa-dollar-sign w-6 text-center"></i>
                {isMenuOpen && <span className="ml-3">Financial Controls</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap ${activeTab === 'settings' ? 'bg-gray-800 text-indigo-500' : 'text-gray-400'}`}
              >
                <i className="fas fa-cog w-6 text-center"></i>
                {isMenuOpen && <span className="ml-3">Settings</span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full text-red-400 hover:text-red-300 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
          >
            <i className="fas fa-sign-out-alt w-6 text-center"></i>
            {isMenuOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <span className="ml-2 text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-bell text-xl"></i>
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUspugOXub65sbxVHOEaD-JEKC8NNWgkWhlg&s" alt="" />
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{currentUser?.name || currentUser?.email || 'Houssam Bouzid'}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      <i className="fas fa-shield-alt mr-1 text-green-500"></i>
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}!</h2>
            <p className="opacity-90">Here's what's happening with your tournaments today.</p>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Tournaments */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Active Tournaments</p>
                  <h3 className="text-3xl font-bold mt-2">{activeTournaments}</h3>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <i className="fas fa-trophy text-indigo-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 flex items-center text-sm">
                  <i className="fas fa-arrow-up mr-1"></i>
                  12%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </div>

            {/* Live Matches */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Live Matches</p>
                  <h3 className="text-3xl font-bold mt-2">{activeMatches}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <i className="fas fa-gamepad text-red-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 flex items-center text-sm">
                  <i className="fas fa-arrow-up mr-1"></i>
                  8%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </div>

            {/* User Registrations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Daily User Registrations</p>
                  <h3 className="text-3xl font-bold mt-2">{userRegistrations}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <i className="fas fa-user-plus text-blue-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 flex items-center text-sm">
                  <i className="fas fa-arrow-up mr-1"></i>
                  24%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
              <div className="h-10 mt-2" ref={userChartRef}></div>
            </div>

            {/* Total Prize Pool */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Prize Pool</p>
                  <h3 className="text-3xl font-bold mt-2">${totalPrizePool.toLocaleString()}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <i className="fas fa-dollar-sign text-green-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 flex items-center text-sm">
                  <i className="fas fa-arrow-up mr-1"></i>
                  18%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
              <div className="h-10 mt-2" ref={prizeChartRef}></div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <i className="fas fa-user text-indigo-600"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          New user registration
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          User #{Math.floor(Math.random() * 10000)} just registered for tournament
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-xs text-gray-500">
                          {Math.floor(Math.random() * 60)} min ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View all activity
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Panel */}
            <div className="space-y-6">
              {/* Server Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Server Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="font-medium">All Systems Operational</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Response Time</span>
                      <span className="text-sm font-medium">42ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database Load</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="h-40 mt-4" ref={serverChartRef}></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Quick Actions</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <i className="fas fa-plus text-indigo-600"></i>
                    </div>
                    <span className="font-medium text-sm">New Tournament</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <i className="fas fa-users text-indigo-600"></i>
                    </div>
                    <span className="font-medium text-sm">Manage Users</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <i className="fas fa-flag text-indigo-600"></i>
                    </div>
                    <span className="font-medium text-sm">Reports</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <i className="fas fa-cog text-indigo-600"></i>
                    </div>
                    <span className="font-medium text-sm">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;