import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    upcomingShows: 0,
    favoriteGenres: [],
    recentBookings: []
  });

  useEffect(() => {
    // Load user statistics (mock data for now)
    setUserStats({
      totalBookings: 8,
      upcomingShows: 3,
      favoriteGenres: ['Action', 'Comedy', 'Drama'],
      recentBookings: [
        {
          id: 1,
          movie: 'Spider-Man: No Way Home',
          venue: 'PVR Cinemas',
          date: '2025-10-20',
          time: '7:30 PM',
          seats: ['F12', 'F13'],
          status: 'confirmed'
        },
        {
          id: 2,
          movie: 'Dune: Part Two',
          venue: 'INOX Multiplex',
          date: '2025-10-18',
          time: '3:00 PM',
          seats: ['H8', 'H9'],
          status: 'completed'
        }
      ]
    });
  }, []);

  const QuickAction = ({ title, description, action, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={action}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{booking.movie}</h3>
          <p className="text-gray-600 text-sm">{booking.venue}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>📅 {booking.date}</span>
            <span>🕐 {booking.time}</span>
            <span>🎫 Seats: {booking.seats.join(', ')}</span>
          </div>
        </div>
        <div className="ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            booking.status === 'confirmed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {booking.status}
          </span>
        </div>
      </div>
    </div>
  );

  const handleQuickAction = (action) => {
    switch(action) {
      case 'Browse Movies':
        navigate('/movies');
        break;
      case 'View Bookings':
        navigate('/my-bookings');
        break;
      case 'Profile':
        navigate('/profile');
        break;
      case 'Events':
        navigate('/events');
        break;
      case 'Sports':
        navigate('/sports');
        break;
      default:
        alert(`${action} feature coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={userStats.totalBookings}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>}
            color="bg-blue-500"
          />
          <StatCard
            title="Upcoming Shows"
            value={userStats.upcomingShows}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            color="bg-green-500"
          />
          <StatCard
            title="Favorite Genres"
            value={userStats.favoriteGenres.length}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>}
            color="bg-red-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction
              title="Browse Movies"
              description="Discover new movies and book tickets"
              action={() => handleQuickAction('Browse Movies')}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 11V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15l4-4 4 4" />
              </svg>}
              color="bg-blue-500"
            />
            <QuickAction
              title="My Bookings"
              description="View and manage your bookings"
              action={() => handleQuickAction('View Bookings')}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>}
              color="bg-green-500"
            />
            <QuickAction
              title="Events & Sports"
              description="Book tickets for live events"
              action={() => handleQuickAction('Events')}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>}
              color="bg-purple-500"
            />
            <QuickAction
              title="My Profile"
              description="Update your personal information"
              action={() => handleQuickAction('Profile')}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>}
              color="bg-indigo-500"
            />
            <QuickAction
              title="Favorites"
              description="Manage your favorite movies and genres"
              action={() => handleQuickAction('Favorites')}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>}
              color="bg-red-500"
            />
            <QuickAction
              title="Notifications"
              description="View your notifications and updates"
              action={() => handleQuickAction('Notifications')}
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 17.868l6.364-6.364M20.132 17.868l-6.364-6.364M12 3v9M3 12h18" />
              </svg>}
              color="bg-yellow-500"
            />
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button 
              onClick={() => navigate('/my-bookings')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {userStats.recentBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                🎬
              </div>
              <h3 className="font-semibold text-gray-900">The Batman</h3>
              <p className="text-sm text-gray-600 mt-1">Action • Drama</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                🎭
              </div>
              <h3 className="font-semibold text-gray-900">Hamilton</h3>
              <p className="text-sm text-gray-600 mt-1">Musical • Drama</p>
              <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                Book Now
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                ⚽
              </div>
              <h3 className="font-semibold text-gray-900">Premier League</h3>
              <p className="text-sm text-gray-600 mt-1">Sports • Live</p>
              <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;