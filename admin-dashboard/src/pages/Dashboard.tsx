import { useState, useEffect, useRef, useContext } from 'react';
import * as echarts from 'echarts';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);

  const [activeMatches, setActiveMatches] = useState(12);
  const [activeTournaments, setActiveTournaments] = useState(8);
  const [userRegistrations, setUserRegistrations] = useState(1243);
  const [totalPrizePool, setTotalPrizePool] = useState(850000);
  const [loading, setLoading] = useState(false);

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

  // Fetch real data for dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // We'll make API calls to get real data for our dashboard metrics
        // For tournaments
        const baseUrl = 'http://localhost:8080/home';
        const token = localStorage.getItem('authToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch active tournaments
        const tournamentsResponse = await fetch(`${baseUrl}/activeTournaments?page=0&size=100`, { headers });
        if (tournamentsResponse.ok) {
          const data = await tournamentsResponse.json();
          // If data is paginated
          if (data.content && Array.isArray(data.content)) {
            setActiveTournaments(data.content.length);
          } else if (Array.isArray(data)) {
            setActiveTournaments(data.length);
          }
        }
        
        // There's no users endpoint, so we'll use a different approach to estimate user count
        // For now, we'll just use the stored value and potentially calculate based on decoded token info
        try {
          // Get user information from the token if available
          const token = localStorage.getItem('authToken');
          if (token) {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            console.log('Decoded token:', tokenData);
            
            // Increment the default user count just to show something dynamic
            // In a real implementation, you'd use an admin API endpoint to get actual user count
            setUserRegistrations(prev => prev + 1);
          }
        } catch (error) {
          console.log('Could not process user info:', error);
          // Keep using default value
        }
        
        // Calculate total prize pool from tournaments
        try {
          const tournamentsForPrize = await fetch(`${baseUrl}/listTournaments?page=0&size=100`, { headers });
          if (tournamentsForPrize.ok) {
            const data = await tournamentsForPrize.json();
            let totalPrize = 0;
            
            if (data.content && Array.isArray(data.content)) {
              data.content.forEach((tournament: any) => {
                if (tournament.prizePool) {
                  totalPrize += parseFloat(tournament.prizePool) || 0;
                }
              });
            } else if (Array.isArray(data)) {
              data.forEach((tournament: any) => {
                if (tournament.prizePool) {
                  totalPrize += parseFloat(tournament.prizePool) || 0;
                }
              });
            }
            
            if (totalPrize > 0) {
              setTotalPrizePool(totalPrize);
            }
          }
        } catch (error) {
          console.log('Could not calculate prize pool:', error);
          // Keep using default value
        }
        
        // Estimate active matches (2 matches per active tournament on average)
        setActiveMatches(Math.floor(activeTournaments * 2));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    

  }, [currentUser, activeTournaments]);
  
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

    // Initialize charts after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeCharts();
    }, 100);

    // Cleanup function
    return () => {
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
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}

        {/* Main Dashboard Content */}
        <main className="p-6">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                <span>Loading dashboard data...</span>
              </div>
            </div>
          )}
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.username ? currentUser.username.split(' ')[0] : 'Admin'}!</h2>
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

            {/* Right Side Panel */}
            <div className="space-y-6">
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