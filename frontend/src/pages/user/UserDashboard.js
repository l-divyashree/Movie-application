import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  TicketIcon, 
  FilmIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    upcomingShows: 0,
    totalSpent: 0,
    favoriteGenres: []
  });
  
  console.log('UserDashboard - Current userStats state:', userStats);

  const loadData = () => {
    console.log('UserDashboard - loadData called');
    try {
      setLoading(true);
      
      // Load bookings from localStorage (same as MyBookingsEnhanced)
      const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      
      console.log('UserDashboard - Raw localStorage data:', { 
        userBookings, 
        userBookingsLength: userBookings.length,
        userBookingsContent: userBookings
      });
      
      // Calculate stats directly from userBookings (same logic as MyBookingsEnhanced)
      let totalBookings = userBookings.length;
      let totalSpent = 0;
      let upcomingShows = 0;

      // Calculate total spent
      userBookings.forEach((booking, index) => {
        console.log(`UserDashboard - Processing booking ${index}:`, booking);
        const amount = booking.totalAmount || 0;
        totalSpent += amount;
        console.log(`UserDashboard - Added amount ${amount}, running total: ${totalSpent}`);
      });

      // Calculate upcoming shows
      const now = new Date();
      userBookings.forEach(booking => {
        try {
          const showDateTime = new Date(booking.date + ' ' + booking.showTime);
          if (showDateTime > now) {
            upcomingShows++;
          }
        } catch (err) {
          console.warn('Error parsing date for booking:', booking, err);
        }
      });

      // Extract favorite genres from bookings
      const genreCount = {};
      userBookings.forEach(booking => {
        const genre = booking.genre || booking.movieTitle || 'Action';
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });

      const favoriteGenres = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      const finalStats = {
        totalBookings: Number(totalBookings) || 0,
        upcomingShows: Number(upcomingShows) || 0,
        totalSpent: Number(totalSpent) || 0,
        favoriteGenres: favoriteGenres.length > 0 ? favoriteGenres : ['Action', 'Drama', 'Comedy']
      };
      
      console.log('UserDashboard - Validated stats:', finalStats);
      
      setUserStats(finalStats);
      
    } catch (err) {
      console.error('UserDashboard - Error loading data:', err);
      // Fallback to demo data
      setUserStats({
        totalBookings: 0,
        upcomingShows: 0,
        totalSpent: 0,
        favoriteGenres: ['Action', 'Drama', 'Comedy']
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('UserDashboard - Component mounted, loading data...');
    loadData();

    // Listen for storage changes to update stats in real-time
    const handleStorageChange = (e) => {
      console.log('UserDashboard - Storage change detected:', e.key, e.newValue);
      if (e.key === 'userBookings' || e.key === 'userDashboardStats') {
        console.log('UserDashboard - Reloading data due to storage change');
        loadData();
      }
    };

    // Listen for focus events to refresh data when user comes back to dashboard
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    // Listen for custom booking updates (same-tab)
    const handleBookingUpdate = (event) => {
      console.log('UserDashboard - Custom booking update received:', event.detail);
      loadData();
    };
    window.addEventListener('bookingUpdate', handleBookingUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('bookingUpdate', handleBookingUpdate);
    };
  }, []);



  // Mock data for Now Showing
  const nowShowingMovies = [
    {
      id: 1,
      title: 'DUNE',
      subtitle: 'PART TWO',
      genre: 'Adventure',
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      ticketsLeft: '50%',
      trailer: true
    },
    {
      id: 2,
      title: 'GODZILLA X KONG',
      subtitle: 'THE NEW EMPIRE',
      genre: 'Action',
      poster: 'https://image.tmdb.org/t/p/w500/gmGK92wI1dwI5F1kmrvCRzKRGAJ.jpg',
      ticketsLeft: '80%',
      trailer: true
    },
    {
      id: 3,
      title: 'DEADPOOL',
      subtitle: 'WOLVERINE',
      genre: 'Action',
      poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      ticketsLeft: '30%',
      trailer: true
    },
    {
      id: 4,
      title: 'DUNE',
      subtitle: 'PART TWO',
      genre: 'Adventure',
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      ticketsLeft: '90%',
      trailer: true
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">


      {/* Main Container */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          {/* User Profile Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
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
                <ChevronRightIcon className="h-4 w-4 ml-auto" />
              </button>
              
              <button 
                onClick={() => navigate('/my-bookings')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="w-8 h-8 bg-cyan-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <TicketIcon className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="font-medium">My Bookings</span>
                <ChevronRightIcon className="h-4 w-4 ml-auto" />
              </button>

              <button 
                onClick={() => navigate('/payments')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <CurrencyRupeeIcon className="h-5 w-5 text-purple-400" />
                </div>
                <span className="font-medium">Payments & Wallet</span>
                <ChevronRightIcon className="h-4 w-4 ml-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Bookings */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <TicketIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {isNaN(userStats.totalBookings) ? 0 : userStats.totalBookings}
              </div>
              <div className="text-gray-400 text-sm">TOTAL BOOKINGS</div>
            </div>

            {/* Upcoming Shows */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {isNaN(userStats.upcomingShows) ? 0 : userStats.upcomingShows}
              </div>
              <div className="text-gray-400 text-sm">UPCOMING SHOWS</div>
            </div>

            {/* Total Spent */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <CurrencyRupeeIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ₹{isNaN(userStats.totalSpent) ? 0 : userStats.totalSpent}
              </div>
              <div className="text-gray-400 text-sm">TOTAL SPENT</div>
            </div>
          </div>

          {/* Now Showing Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Now Showing</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm transition-colors">
                  Action
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm transition-colors">
                  Comedy
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm transition-colors">
                  Horror
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors">
                  Action
                </button>
              </div>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {nowShowingMovies.map((movie) => (
                <div key={movie.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group hover:border-red-500 transition-colors cursor-pointer"
                     onClick={() => navigate(`/movies/${movie.id}`)}>
                  <div className="aspect-[3/4] relative">
                    {/* Movie Poster */}
                    <img 
                      src={movie.poster} 
                      alt={`${movie.title} poster`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback for failed image loading */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center" style={{ display: 'none' }}>
                      <FilmIcon className="h-16 w-16 text-gray-600" />
                    </div>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                        <PlayIcon className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                    {/* Book Now Button */}
                    <div className="absolute top-3 right-3">
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/movies');
                        }}
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-1">{movie.title}</h3>
                    <p className="text-gray-400 text-xs mb-2">{movie.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{movie.genre}</span>
                      {movie.trailer && (
                        <span className="text-red-400 text-xs">🔴 TRAILER</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;