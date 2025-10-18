import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminMovieManagement from '../../components/admin/AdminMovieManagement';
import AdminShowManagement from '../../components/admin/AdminShowManagement';
import AdminUserManagement from '../../components/admin/AdminUserManagement';
import AdminVenueManagement from '../../components/admin/AdminVenueManagement';
import AdminSeatManagement from '../../components/admin/AdminSeatManagement';
import AdminBookingManagement from '../../components/admin/AdminBookingManagement';
import adminService from '../../services/adminService';
import AdminAnalytics from '../../components/admin/AdminAnalytics';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }

    // Load real admin statistics
    loadDashboardStats();
  }, [isAdmin, navigate]);

  // Reload stats when activeTab changes (especially when going to bookings or dashboard)
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'bookings') {
      loadDashboardStats();
    }
  }, [activeTab]);

  // Reload stats when page gains focus
  useEffect(() => {
    const handleFocus = () => {
      loadDashboardStats();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboardStats();
      }
    };
    
    // Listen for new bookings to update stats
    const handleBookingCreated = () => {
      loadDashboardStats();
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('bookingCreated', handleBookingCreated);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('bookingCreated', handleBookingCreated);
    };
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      
      // Load demo bookings from localStorage
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const demoBookingCount = demoBookings.length;
      const demoRevenue = demoBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      setStats({
        totalUsers: data.totalUsers || 0,
        totalMovies: data.totalMovies || 0,
        totalBookings: (data.totalBookings || 0) + demoBookingCount,
        totalRevenue: (data.totalRevenue || 0) + demoRevenue
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      
      // Fallback to demo data only
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const demoBookingCount = demoBookings.length;
      const demoRevenue = demoBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      setStats({
        totalUsers: 0,
        totalMovies: 0,
        totalBookings: demoBookingCount,
        totalRevenue: demoRevenue
      });
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, action, icon, color }) => (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-700" onClick={action}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-black shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-red-400">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-800">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['dashboard','movies','shows','bookings','users','venues','seats','analytics'].map((t)=> (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`${activeTab===t ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-red-300 hover:border-gray-700'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>} color="bg-blue-500" />
              <StatCard title="Total Movies" value={stats.totalMovies} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 11V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15l4-4 4 4"/></svg>} color="bg-green-500" />
              <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>} color="bg-purple-500" />
              <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>} color="bg-yellow-500" />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickAction title="Manage Users" description="View, edit, and manage user accounts" action={() => setActiveTab('users')} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>} color="bg-blue-500" />
                <QuickAction title="Manage Movies" description="Add and edit movies in the catalog" action={() => setActiveTab('movies')} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 11V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15l4-4 4 4"/></svg>} color="bg-green-500" />
                <QuickAction title="Manage Shows" description="Schedule and manage movie shows" action={() => setActiveTab('shows')} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} color="bg-purple-500" />
                <QuickAction title="View Bookings" description="Monitor and manage all customer bookings" action={() => setActiveTab('bookings')} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>} color="bg-orange-500" />
                <QuickAction title="Manage Venues" description="Add and manage cinema venues" action={() => setActiveTab('venues')} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>} color="bg-red-500" />
                <QuickAction title="Manage Seats" description="Configure theater seating layouts" action={() => setActiveTab('seats')} icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>} color="bg-gray-500" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 py-3 border-b border-gray-700">
                  <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">New user registered</p>
                    <p className="text-sm text-gray-400">john.doe@example.com - 2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 py-3 border-b border-gray-700">
                  <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Movie booking completed</p>
                    <p className="text-sm text-gray-400">Avengers: Endgame - Screen 3 - 5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 py-3">
                  <div className="w-10 h-10 bg-yellow-700 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">System maintenance scheduled</p>
                    <p className="text-sm text-gray-400">Database backup - Tonight at 2:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs */}
        {activeTab === 'movies' && <AdminMovieManagement />}
        {activeTab === 'shows' && <AdminShowManagement />}
        {activeTab === 'bookings' && <AdminBookingManagement />}
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'venues' && <AdminVenueManagement />}
        {activeTab === 'seats' && <AdminSeatManagement />}
        {activeTab === 'analytics' && (
          <div className="mt-6">
            <AdminAnalytics />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;