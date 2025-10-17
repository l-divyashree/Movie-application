import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    upcomingShows: 0,
    totalSpent: 0,
    membershipPoints: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const bookingsResponse = await bookingService.getUserBookings();
      const bookings = bookingsResponse || [];
      
      // Calculate statistics
      const totalBookings = bookings.length;
      const now = new Date();
      const upcomingShows = bookings.filter(booking => 
        new Date(booking.show?.showDateTime) > now
      ).length;
      const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      setStatistics({
        totalBookings,
        upcomingShows,
        totalSpent,
        membershipPoints: Math.floor(totalSpent / 10) // 1 point per $10 spent
      });

      // Set recent bookings (last 3)
      setRecentBookings(bookings.slice(0, 3));
      
      // Set upcoming shows
      const upcoming = bookings
        .filter(booking => new Date(booking.show?.showDateTime) > now)
        .slice(0, 3);
      setUpcomingShows(upcoming);

      // Mock favorite movies and notifications
      setFavoriteMovies([
        { id: 1, title: 'Avengers: Endgame', genre: 'Action', rating: 8.9 },
        { id: 2, title: 'Inception', genre: 'Sci-Fi', rating: 8.8 },
        { id: 3, title: 'The Dark Knight', genre: 'Action', rating: 9.0 }
      ]);

      setNotifications([
        { id: 1, type: 'booking', message: 'Your booking for Avengers: Endgame is confirmed', time: '2 hours ago' },
        { id: 2, type: 'offer', message: 'Special 20% off on weekend shows', time: '1 day ago' },
        { id: 3, type: 'reminder', message: 'Show starting in 2 hours', time: '2 hours ago' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Book Tickets',
      description: 'Browse and book movie tickets',
      icon: '🎬',
      action: () => navigate('/movies'),
      color: 'bg-blue-500'
    },
    {
      title: 'My Bookings',
      description: 'View all your bookings',
      icon: '📋',
      action: () => navigate('/user/bookings'),
      color: 'bg-green-500'
    },
    {
      title: 'Profile',
      description: 'Manage your profile',
      icon: '👤',
      action: () => navigate('/user/profile'),
      color: 'bg-purple-500'
    },
    {
      title: 'Payment History',
      description: 'View payment transactions',
      icon: '💳',
      action: () => navigate('/user/payments'),
      color: 'bg-yellow-500'
    },
    {
      title: 'Offers & Deals',
      description: 'Explore current offers',
      icon: '🎁',
      action: () => navigate('/user/offers'),
      color: 'bg-red-500'
    },
    {
      title: 'Wishlist',
      description: 'Your saved movies',
      icon: '❤️',
      action: () => navigate('/user/wishlist'),
      color: 'bg-pink-500'
    },
    {
      title: 'Reviews',
      description: 'Rate and review movies',
      icon: '⭐',
      action: () => navigate('/user/reviews'),
      color: 'bg-orange-500'
    },
    {
      title: 'Notifications',
      description: 'View all notifications',
      icon: '🔔',
      action: () => navigate('/user/notifications'),
      color: 'bg-indigo-500'
    },
    {
      title: 'Location Settings',
      description: 'Manage preferred locations',
      icon: '📍',
      action: () => navigate('/user/locations'),
      color: 'bg-teal-500'
    },
    {
      title: 'Account Settings',
      description: 'Privacy and security',
      icon: '⚙️',
      action: () => navigate('/user/settings'),
      color: 'bg-gray-500'
    },
    {
      title: 'Support',
      description: 'Help and support',
      icon: '💬',
      action: () => navigate('/user/support'),
      color: 'bg-cyan-500'
    },
    {
      title: 'Activity Log',
      description: 'View account activity',
      icon: '📊',
      action: () => navigate('/user/activity'),
      color: 'bg-lime-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your bookings, explore new movies, and enjoy exclusive offers
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Membership Points</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.membershipPoints}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-green-600 text-xl">🎬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Shows</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.upcomingShows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-yellow-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${statistics.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-purple-600 text-xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reward Points</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.membershipPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className={`${action.color} hover:opacity-90 transition-all duration-200 rounded-lg p-4 cursor-pointer transform hover:scale-105 shadow-md`}
              >
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <Link to="/user/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.show?.movie?.title || 'Movie Title'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.show?.venue?.name || 'Venue'} • {booking.numberOfTickets} tickets
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.show?.showDateTime ? 
                            new Date(booking.show.showDateTime).toLocaleDateString() : 
                            'Date TBD'
                          }
                        </p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        ${booking.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent bookings</p>
              )}
            </div>
          </div>

          {/* Upcoming Shows */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Shows</h3>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {upcomingShows.length} upcoming
              </span>
            </div>
            <div className="space-y-4">
              {upcomingShows.length > 0 ? (
                upcomingShows.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.show?.movie?.title || 'Movie Title'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.show?.venue?.name || 'Venue'}
                        </p>
                        <p className="text-xs text-red-600 font-medium">
                          {booking.show?.showDateTime ? 
                            new Date(booking.show.showDateTime).toLocaleString() : 
                            'Time TBD'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{booking.numberOfTickets} tickets</p>
                        <p className="text-xs text-gray-500">Booking #{booking.id}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No upcoming shows</p>
              )}
            </div>
          </div>

          {/* Favorite Movies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Favorite Movies</h3>
              <Link to="/user/wishlist" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {favoriteMovies.map((movie) => (
                <div key={movie.id} className="flex items-center space-x-3">
                  <div className="w-12 h-16 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-gray-600 text-xs">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{movie.title}</p>
                    <p className="text-gray-600 text-xs">{movie.genre}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <span className="text-gray-600 text-xs ml-1">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2 xl:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
              <Link to="/user/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'booking' ? 'bg-green-100' :
                      notification.type === 'offer' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <span className="text-sm">
                        {notification.type === 'booking' ? '✅' :
                         notification.type === 'offer' ? '🎁' : '⏰'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready for your next movie experience?</h3>
          <p className="mb-4 opacity-90">Discover the latest movies and book your tickets now!</p>
          <button 
            onClick={() => navigate('/movies')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Movies
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;