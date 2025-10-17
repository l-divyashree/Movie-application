import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  TicketIcon, 
  FilmIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    upcomingShows: 0,
    completedBookings: 0,
    totalSpent: 0,
    favoriteGenres: [],
    recentBookings: []
  });

  useEffect(() => {
    loadUserBookings();
    
    // Listen for new bookings
    const handleBookingCreated = () => {
      console.log('UserDashboard - Booking created event received');
      loadUserBookings();
    };
    
    // Reload when page gains focus
    const handleFocus = () => {
      loadUserBookings();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserBookings();
      }
    };
    
    window.addEventListener('bookingCreated', handleBookingCreated);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('bookingCreated', handleBookingCreated);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadUserBookings = async () => {
    console.log('UserDashboard - loadUserBookings called');
    try {
      setLoading(true);
      
      // Try to load from API first
      let apiBookings = [];
      try {
        const bookingsData = await bookingService.getUserBookings();
        apiBookings = Array.isArray(bookingsData) ? bookingsData : [];
      } catch (apiError) {
        console.log('API bookings not available, using demo data');
      }
      
      // Load demo bookings from localStorage
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('UserDashboard - Current User:', currentUser);
      console.log('UserDashboard - Demo Bookings:', demoBookings);
      
      // Filter demo bookings for current user and convert to API format
      const userDemoBookings = demoBookings
        .filter(booking => booking.userId === currentUser.id)
        .map(booking => ({
          id: booking.id,
          bookingReference: `BK${booking.id}`,
          status: booking.status || 'CONFIRMED',
          bookingDate: booking.bookingDate,
          totalAmount: booking.totalAmount,
          paymentStatus: 'CONFIRMED',
          show: {
            movie: { 
              title: booking.movieTitle,
              genre: 'Action' // Default genre
            },
            venue: { 
              name: booking.venueName
            },
            showDate: booking.showDate,
            showTime: booking.showTime
          },
          seats: booking.seats || []
        }));
      
      console.log('UserDashboard - User Demo Bookings:', userDemoBookings);
      
      // Combine API and demo bookings
      const validBookings = [...apiBookings, ...userDemoBookings];
      console.log('UserDashboard - All Combined Bookings:', validBookings);
      
      setBookings(validBookings);
      
      // Calculate stats
      const now = new Date();
      const upcoming = validBookings.filter(booking => {
        const showDate = new Date(booking?.show?.showDate);
        return showDate >= now && booking?.status === 'CONFIRMED';
      }).length;
      
      const completed = validBookings.filter(booking => {
        const showDate = new Date(booking?.show?.showDate);
        return showDate < now || booking?.status === 'COMPLETED';
      }).length;
      
      const totalSpent = validBookings.reduce((sum, booking) => {
        return sum + (booking?.totalAmount || 0);
      }, 0);
      
      console.log('UserDashboard - Calculated Stats:', {
        totalBookings: validBookings.length,
        upcomingShows: upcoming,
        completedBookings: completed,
        totalSpent: totalSpent
      });
      
      setUserStats({
        totalBookings: validBookings.length,
        upcomingShows: upcoming,
        completedBookings: completed,
        totalSpent: totalSpent,
        favoriteGenres: extractFavoriteGenres(validBookings),
        recentBookings: validBookings.slice(0, 3) // Last 3 bookings
      });
      
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load booking history');
      // Use demo data as fallback
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userBookings = demoBookings.filter(booking => booking.userId === currentUser.id);
      
      setUserStats({
        totalBookings: userBookings.length,
        upcomingShows: userBookings.length,
        completedBookings: 0,
        totalSpent: userBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0),
        favoriteGenres: ['Action', 'Drama', 'Comedy'],
        recentBookings: userBookings.slice(0, 3)
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract favorite genres
  const extractFavoriteGenres = (bookings) => {
    const genres = bookings.map(booking => booking?.show?.movie?.genre).filter(Boolean);
    const genreCounts = genres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]).slice(0, 3);
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
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

  const QuickActionCard = ({ title, description, onClick, icon, color }) => (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.show?.movie?.title || booking.movie || 'Movie Title'}
          </h3>
          <p className="text-gray-600 text-sm">
            {booking.show?.venue?.name || booking.venue || 'Venue Name'}
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>📅 {booking.show?.showDate || booking.date || 'Date'}</span>
            <span>🕐 {booking.show?.showTime || booking.time || 'Time'}</span>
            <span>🎫 Seats: {
              Array.isArray(booking.seats) 
                ? booking.seats.map(seat => seat.seatNumber || seat).join(', ')
                : (booking.seats || 'N/A')
            }</span>
          </div>
        </div>
        <div className="ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            booking.status === 'CONFIRMED' || booking.status === 'confirmed'
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {booking.status || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Debug log
  console.log('UserStats:', userStats);
  console.log('Bookings:', bookings);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email || 'User'}!</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadUserBookings}
                disabled={loading}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => navigate('/user/profile')}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700">{error} - Showing sample data</p>
          </div>
        )}
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={userStats?.totalBookings || 0}
            icon={<TicketIcon className="h-6 w-6 text-white" />}
            color="bg-blue-500"
            onClick={() => navigate('/user/bookings')}
          />
          <StatCard
            title="Upcoming Shows"
            value={userStats?.upcomingShows || 0}
            icon={<CalendarIcon className="h-6 w-6 text-white" />}
            color="bg-green-500"
            onClick={() => navigate('/user/bookings')}
          />
          <StatCard
            title="Completed"
            value={userStats?.completedBookings || 0}
            icon={<CheckCircleIcon className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Spent"
            value={`₹${userStats?.totalSpent || 0}`}
            icon={<CurrencyRupeeIcon className="h-6 w-6 text-white" />}
            color="bg-indigo-500"
            onClick={() => navigate('/user/payments')}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Browse Movies"
              description="Discover new movies and book tickets for latest shows"
              onClick={() => navigate('/movies')}
              icon={<FilmIcon className="h-6 w-6 text-white" />}
              color="bg-blue-500"
            />
            <QuickActionCard
              title="My Bookings"
              description="View and manage all your movie bookings with QR codes"
              onClick={() => navigate('/user/bookings')}
              icon={<TicketIcon className="h-6 w-6 text-white" />}
              color="bg-green-500"
            />
            <QuickActionCard
              title="Payments & Wallet"
              description="Manage your wallet, payment methods and transactions"
              onClick={() => navigate('/user/payments')}
              icon={<span className="text-white text-lg">💰</span>}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Dashboard Modules */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              title="Profile Settings"
              description="Manage your personal information and preferences"
              onClick={() => navigate('/user/profile')}
              icon={<span className="text-white text-lg">👤</span>}
              color="bg-indigo-500"
            />
            <QuickActionCard
              title="Invoices & Tickets"
              description="Download invoices, e-tickets and print receipts"
              onClick={() => navigate('/user/invoices')}
              icon={<span className="text-white text-lg">📄</span>}
              color="bg-yellow-500"
            />
            <QuickActionCard
              title="Notifications"
              description="Manage your notifications and alert preferences"
              onClick={() => navigate('/user/notifications')}
              icon={<span className="text-white text-lg">🔔</span>}
              color="bg-red-500"
            />
            <QuickActionCard
              title="Offers & Deals"
              description="Browse exclusive offers and promotional deals"
              onClick={() => navigate('/user/offers')}
              icon={<span className="text-white text-lg">🎁</span>}
              color="bg-green-600"
            />
            <QuickActionCard
              title="Wishlist & Reviews"
              description="Manage your wishlist and write movie reviews"
              onClick={() => navigate('/user/wishlist')}
              icon={<span className="text-white text-lg">❤️</span>}
              color="bg-pink-500"
            />
            <QuickActionCard
              title="Movie Reviews"
              description="Read and write reviews for movies you've watched"
              onClick={() => navigate('/user/reviews')}
              icon={<span className="text-white text-lg">⭐</span>}
              color="bg-orange-500"
            />
            <QuickActionCard
              title="Events & Sports"
              description="Book tickets for live events and sports matches"
              onClick={() => navigate('/events')}
              icon={<CalendarIcon className="h-6 w-6 text-white" />}
              color="bg-teal-500"
            />
            <QuickActionCard
              title="Account Settings"
              description="Manage privacy, security and account preferences"
              onClick={() => navigate('/user/settings')}
              icon={<span className="text-white text-lg">⚙️</span>}
              color="bg-gray-600"
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
            {bookings.slice(0, 3).map(booking => (
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