import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  TicketIcon, 
  FilmIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [availableGenres, setAvailableGenres] = useState(['All']);
  const [wishlist, setWishlist] = useState([]);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    upcomingShows: 0,
    totalSpent: 0,
    favoriteGenres: []
  });

  const loadData = useCallback(() => {
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
      
      // Calculate stats directly from userBookings
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
  }, []);

  const loadNowShowingMovies = useCallback(() => {
    try {
      // Load movies from admin-managed data
      const adminMovies = JSON.parse(localStorage.getItem('adminMovies') || '[]');
      
      // Transform admin movies to display format
      const transformedMovies = adminMovies
        .filter(movie => movie.status === 'Now Showing' || movie.isActive !== false)
        .map(movie => ({
          id: movie.id,
          title: movie.title,
          subtitle: movie.subtitle || '',
          genre: movie.genre || 'Drama',
          poster: movie.posterUrl || movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image',
          rating: movie.rating || 'U/A',
          duration: movie.duration || '120 min',
          language: movie.language || 'English',
          trailer: true,
          ticketsLeft: Math.floor(Math.random() * 100) + '%' // Mock availability
        }));

      // If no admin movies, use fallback movies with different genres
      if (transformedMovies.length === 0) {
        const fallbackMovies = [
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
            title: 'THE CONJURING',
            subtitle: 'THE DEVIL MADE ME DO IT',
            genre: 'Horror',
            poster: 'https://image.tmdb.org/t/p/w500/xbEyJHW1xjhNKA3-kVjELGnbNLJ.jpg',
            ticketsLeft: '65%',
            trailer: true
          },
          {
            id: 5,
            title: 'FREE GUY',
            subtitle: '',
            genre: 'Comedy',
            poster: 'https://image.tmdb.org/t/p/w500/yc2IfL701NiupxeajUp3xcpeuSy.jpg',
            ticketsLeft: '45%',
            trailer: true
          },
          {
            id: 6,
            title: 'SPIDER-MAN',
            subtitle: 'NO WAY HOME',
            genre: 'Action',
            poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
            ticketsLeft: '75%',
            trailer: true
          }
        ];
        setNowShowingMovies(fallbackMovies);
      } else {
        setNowShowingMovies(transformedMovies);
      }

      // Extract unique genres for filtering
      const allMovies = transformedMovies.length > 0 ? transformedMovies : [
        { genre: 'Action' }, { genre: 'Comedy' }, { genre: 'Horror' }, { genre: 'Adventure' }, { genre: 'Drama' }
      ];
      
      const genres = ['All', ...new Set(allMovies.map(movie => movie.genre))];
      setAvailableGenres(genres);
      
    } catch (error) {
      console.error('Error loading now showing movies:', error);
      // Use basic fallback
      setNowShowingMovies([]);
      setAvailableGenres(['All', 'Action', 'Comedy', 'Horror']);
    }
  }, []);

  const getFilteredMovies = () => {
    if (selectedGenre === 'All') {
      return nowShowingMovies;
    }
    return nowShowingMovies.filter(movie => movie.genre === selectedGenre);
  };

  const loadWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const toggleWishlist = (movie) => {
    const isInWishlist = wishlist.some(item => item.id === movie.id);
    let updatedWishlist;
    
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(item => item.id !== movie.id);
    } else {
      updatedWishlist = [...wishlist, movie];
    }
    
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Trigger storage event for navbar to update
    window.dispatchEvent(new Event('storage'));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some(item => item.id === movieId);
  };

  useEffect(() => {
    console.log('UserDashboard - Component mounted, loading data...');
    loadData();
    loadNowShowingMovies();
    loadWishlist();

    // Listen for storage changes to update stats in real-time
    const handleStorageChange = (e) => {
      console.log('UserDashboard - Storage change detected:', e.key, e.newValue);
      if (e.key === 'userBookings' || e.key === 'userDashboardStats') {
        console.log('UserDashboard - Reloading data due to storage change');
        loadData();
      }
      if (e.key === 'adminMovies') {
        console.log('UserDashboard - Admin movies updated, reloading movies...');
        loadNowShowingMovies();
      }
    };

    // Listen for focus events to refresh data when user comes back to dashboard
    const handleFocus = () => {
      loadData();
    };

    // Listen for custom booking updates (same-tab)
    const handleBookingUpdate = (event) => {
      console.log('UserDashboard - Custom booking update received:', event.detail);
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('bookingUpdate', handleBookingUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('bookingUpdate', handleBookingUpdate);
    };
  }, [loadData, loadNowShowingMovies]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
  };

  const handleBookMovie = (movieId) => {
    navigate(`/book/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || user?.name || 'User'}!</h1>
          <p className="text-blue-200">Discover amazing movies and book your favorite shows</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-400">{userStats.totalBookings}</p>
              </div>
              <TicketIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Shows</p>
                <p className="text-2xl font-bold text-green-400">{userStats.upcomingShows}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-yellow-400">₹{userStats.totalSpent}</p>
              </div>
              <CurrencyRupeeIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <button
                onClick={() => navigate('/movies')}
                className="group w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-2xl p-8 hover:from-blue-600 hover:via-blue-700 hover:to-purple-800 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 border border-blue-400/20"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <FilmIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Browse Movies</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">Discover new releases and trending films</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/user/bookings')}
                className="group w-full bg-gradient-to-br from-green-500 via-teal-600 to-blue-700 rounded-2xl p-8 hover:from-green-600 hover:via-teal-700 hover:to-blue-800 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 border border-green-400/20"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <TicketIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">My Bookings</h3>
                  <p className="text-sm text-green-100 leading-relaxed">View and manage your movie tickets</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/user/profile')}
                className="group w-full bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-2xl p-8 hover:from-purple-600 hover:via-pink-700 hover:to-rose-800 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 border border-purple-400/20"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <CalendarIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Profile Settings</h3>
                  <p className="text-sm text-purple-100 leading-relaxed">Update your account preferences</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - Now Showing */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Now Showing</h2>
              <button 
                onClick={() => navigate('/movies')}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                See All <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Genre Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {availableGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredMovies().map((movie) => (
                <div key={movie.id} className="group relative bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-700">
                  <div className="relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleBookMovie(movie.id)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                      >
                        Book Now
                      </button>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(movie);
                        }}
                        className="group p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200"
                      >
                        {isInWishlist(movie.id) ? (
                          <HeartIconSolid className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-white group-hover:text-red-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                      {movie.ticketsLeft} left
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                    {movie.subtitle && (
                      <p className="text-gray-400 text-sm mb-2">{movie.subtitle}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">{movie.genre}</span>
                      <span className="text-gray-400">{movie.rating || 'U/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredMovies().length === 0 && (
              <div className="text-center py-12">
                <FilmIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No movies found for "{selectedGenre}" genre</p>
                <p className="text-gray-500 text-sm">Try selecting a different genre</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;