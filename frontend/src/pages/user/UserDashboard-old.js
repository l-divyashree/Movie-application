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
import AnimatedCounter from '../../components/common/AnimatedCounter';

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
    favoriteGenres: []
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
        favoriteGenres: extractFavoriteGenres(validBookings)
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
        favoriteGenres: ['Action', 'Drama', 'Comedy']
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

  const StatCard = ({ title, value, icon, color, onClick, isAnimated = false }) => (
    <div 
      className={`relative group transform transition-all duration-500 hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{
        background: 'linear-gradient(145deg, var(--background-secondary), var(--background-tertiary))',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        boxShadow: 'var(--shadow-xl)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xl), var(--glow-red)';
        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.1)';
      }}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-transparent to-cyan-400/10 rounded-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p 
            className="text-sm font-semibold mb-2 text-gray-400 group-hover:text-red-400 transition-colors duration-300"
            style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            {title}
          </p>
          <div 
            className="text-4xl font-bold text-white transition-all duration-500 group-hover:text-red-400"
            style={{ 
              fontFamily: 'monospace',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            {isAnimated ? (
              <AnimatedCounter 
                endValue={typeof value === 'string' && value.includes('₹') ? 
                  parseInt(value.replace('₹', '').replace(',', '')) : 
                  parseInt(value) || 0
                }
                prefix={typeof value === 'string' && value.includes('₹') ? '₹' : ''}
                duration={2000}
              />
            ) : (
              value
            )}
          </div>
        </div>
        <div 
          className={`p-4 rounded-2xl ${color} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
          style={{ 
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.3)' 
          }}
        >
          {icon}
        </div>
      </div>
      
      {/* Shine Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700"
        style={{ borderRadius: '20px' }}
      />
    </div>
  );

  const QuickActionCard = ({ title, description, onClick, icon, color }) => (
    <div 
      className="card-simple cursor-pointer fade-in"
      onClick={onClick}
      style={{ '--hover-border': 'var(--brand-primary-light)' }}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="heading-3" style={{ fontSize: 'var(--font-size-lg)' }}>{title}</h3>
          <p className="text-muted text-sm mt-1">{description}</p>
        </div>
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent mx-auto loading-pulse"
               style={{ 
                 borderTopColor: 'var(--brand-primary)',
                 borderRightColor: 'var(--brand-primary-light)',
               }}></div>
          <p className="mt-6 text-large" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Debug log
  console.log('UserStats:', userStats);
  console.log('Bookings:', bookings);

  return (
    <div className="min-h-screen bg-gray-900 text-white"></div>
      {/* Main Container */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          {/* User Profile Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Welcome back,</h3>
                <p className="text-red-400 text-sm">{user?.email || 'ash@gmail.com'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/movies')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              >
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <FilmIcon className="h-5 w-5" />
                </div>
                <span className="font-medium">Browse Movies</span>
              </button>
              
              <button 
                onClick={() => navigate('/my-bookings')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="w-8 h-8 bg-cyan-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <TicketIcon className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="font-medium">My Bookings</span>
              </button>

              <button 
                onClick={() => navigate('/payments')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <CurrencyRupeeIcon className="h-5 w-5 text-purple-400" />
                </div>
                <span className="font-medium">Payments & Wallet</span>
              </button>
            </div>
          </div>

          {/* Dashboard Modules */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Dashboard Modules</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/movies')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FilmIcon className="h-5 w-5 text-gray-400" />
                  <span>Browse Movies</span>
                </div>
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  BOOK NOW
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="container-main">
          <div className="flex justify-between items-center py-12">
            <div className="slide-up">
              <h1 
                className="text-4xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-2"
                style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
              >
                My Cinema Dashboard
              </h1>
              <p 
                className="text-xl text-gray-300"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                Welcome back, <span className="text-red-400 font-semibold">{user?.email || 'Cinephile'}!</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadUserBookings}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => navigate('/user/profile')}
                className="btn-secondary"
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--error)', 
                  color: 'var(--text-inverse)',
                  border: 'none'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        {error && (
          <div className="mb-8 p-4 rounded-lg fade-in" 
               style={{ 
                 backgroundColor: '#FFFBEB', 
                 border: '1px solid var(--warning)', 
                 color: 'var(--warning)' 
               }}>
            <p>{error} - Showing sample data</p>
          </div>
        )}
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard
            title="Total Bookings"
            value={userStats?.totalBookings || 0}
            icon={<TicketIcon className="h-8 w-8 text-black" />}
            color="bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-2xl"
            onClick={() => navigate('/user/bookings')}
            isAnimated={true}
          />
          <StatCard
            title="Upcoming Shows"
            value={userStats?.upcomingShows || 0}
            icon={<CalendarIcon className="h-8 w-8 text-black" />}
            color="bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 shadow-2xl"
            onClick={() => navigate('/user/bookings')}
            isAnimated={true}
          />
          <StatCard
            title="Completed"
            value={userStats?.completedBookings || 0}
            icon={<CheckCircleIcon className="h-8 w-8 text-black" />}
            color="bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-2xl"
            isAnimated={true}
          />
          <StatCard
            title="Total Spent"
            value={`₹${userStats?.totalSpent || 0}`}
            icon={<CurrencyRupeeIcon className="h-8 w-8 text-black" />}
            color="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-2xl"
            onClick={() => navigate('/user/payments')}
            isAnimated={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="heading-2 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Browse Movies"
              description="Discover new movies and book tickets for latest shows"
              onClick={() => navigate('/movies')}
              icon={<FilmIcon className="h-6 w-6 text-white" />}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <QuickActionCard
              title="My Bookings"
              description="View and manage all your movie bookings with QR codes"
              onClick={() => navigate('/user/bookings')}
              icon={<TicketIcon className="h-6 w-6 text-white" />}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <QuickActionCard
              title="Payments & Wallet"
              description="Manage your wallet, payment methods and transactions"
              onClick={() => navigate('/user/payments')}
              icon={<span className="text-white text-lg">💰</span>}
              color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            />
          </div>
        </div>

        {/* Dashboard Modules */}
        <div className="mb-12">
          <h2 className="heading-2 mb-8">Dashboard Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              title="Profile Settings"
              description="Manage your personal information and preferences"
              onClick={() => navigate('/user/profile')}
              icon={<span className="text-white text-lg">👤</span>}
              color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            />
            <QuickActionCard
              title="Invoices & Tickets"
              description="Download invoices, e-tickets and print receipts"
              onClick={() => navigate('/user/invoices')}
              icon={<span className="text-white text-lg">📄</span>}
              color="bg-gradient-to-r from-red-500 to-red-600"
            />
            <QuickActionCard
              title="Notifications"
              description="Manage your notifications and alert preferences"
              onClick={() => navigate('/user/notifications')}
              icon={<span className="text-white text-lg">🔔</span>}
              color="bg-gradient-to-r from-red-500 to-red-600"
            />
            <QuickActionCard
              title="Offers & Deals"
              description="Browse exclusive offers and promotional deals"
              onClick={() => navigate('/user/offers')}
              icon={<span className="text-white text-lg">🎁</span>}
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            />
            <QuickActionCard
              title="Wishlist & Reviews"
              description="Manage your wishlist and write movie reviews"
              onClick={() => navigate('/user/wishlist')}
              icon={<span className="text-white text-lg">❤️</span>}
              color="bg-gradient-to-r from-pink-500 to-pink-600"
            />
            <QuickActionCard
              title="Movie Reviews"
              description="Read and write reviews for movies you've watched"
              onClick={() => navigate('/user/reviews')}
              icon={<span className="text-white text-lg">⭐</span>}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
            />
            <QuickActionCard
              title="Events & Sports"
              description="Book tickets for live events and sports matches"
              onClick={() => navigate('/events')}
              icon={<CalendarIcon className="h-6 w-6 text-white" />}
              color="bg-gradient-to-r from-teal-500 to-teal-600"
            />
            <QuickActionCard
              title="Account Settings"
              description="Manage privacy, security and account preferences"
              onClick={() => navigate('/user/settings')}
              icon={<span className="text-white text-lg">⚙️</span>}
              color="bg-gradient-to-r from-slate-500 to-slate-600"
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="card-elevated">
          <h2 className="heading-2 mb-8">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-simple text-center fade-in">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex-center" 
                   style={{ background: 'linear-gradient(135deg, var(--brand-primary-light), var(--brand-primary))' }}>
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="heading-3 mb-2">The Batman</h3>
              <p className="text-muted text-sm mb-4">Action • Drama</p>
              <button className="btn-primary" onClick={() => navigate('/movies')}>
                Book Now
              </button>
            </div>
            <div className="card-simple text-center fade-in">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex-center" 
                   style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}>
                <span className="text-3xl">🎭</span>
              </div>
              <h3 className="heading-3 mb-2">Hamilton</h3>
              <p className="text-muted text-sm mb-4">Musical • Drama</p>
              <button className="btn-primary" onClick={() => navigate('/movies')}>
                Book Now
              </button>
            </div>
            <div className="card-simple text-center fade-in">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex-center" 
                   style={{ background: 'linear-gradient(135deg, var(--info), #2563EB)' }}>
                <span className="text-3xl">⚽</span>
              </div>
              <h3 className="heading-3 mb-2">Premier League</h3>
              <p className="text-muted text-sm mb-4">Sports • Live</p>
              <button className="btn-primary" onClick={() => navigate('/events')}>
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