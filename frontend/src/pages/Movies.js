import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon as HeartOutline, 
  StarIcon,
  CalendarIcon,
  ClockIcon,
  FilmIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    console.log('Movies - Component mounted');
    loadMovies();
    
    // Listen for admin movie changes
    const handleStorageChange = (e) => {
      if (e.key === 'adminMovies') {
        console.log('Movies - Admin movies updated, reloading...');
        loadMovies();
      }
    };

    // Also reload when navigating to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Movies - Visibility change');
        loadMovies();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadMovies = () => {
    console.log('Movies - loadMovies called - UPDATED VERSION');
    try {
      setLoading(true);
      
      // Load movies from localStorage (admin-managed movies)
      const adminMovies = JSON.parse(localStorage.getItem('adminMovies') || '[]');
      
      console.log('Movies - Raw admin movies:', adminMovies);
      
      // Transform admin movies to expected format for Movies page
      const transformedMovies = adminMovies
        .filter(movie => movie.isActive !== false) // Only show active movies
        .map(movie => ({
          id: movie.id,
          title: movie.title,
          genre: movie.genre,
          language: movie.language,
          rating: 8.5, // Default rating since admin stores text ratings like "PG-13"
          duration: movie.durationMinutes,
          releaseDate: movie.releaseDate,
          poster: movie.posterUrl || 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', // fallback poster
          isNowShowing: movie.isNowShowing || false,
          price: 300 // default price, can be made configurable
        }));

      console.log('Movies - Transformed movies:', transformedMovies);
      console.log('Movies - Setting movies count:', transformedMovies.length);
      setMovies(transformedMovies);
      
      // Load wishlist from localStorage
      const savedWishlist = localStorage.getItem('movieWishlist');
      if (savedWishlist) {
        setWishlist(new Set(JSON.parse(savedWishlist)));
      }
      
    } catch (err) {
      console.error('Error loading movies:', err);
      setMovies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (movieId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(movieId)) {
      newWishlist.delete(movieId);
    } else {
      newWishlist.add(movieId);
    }
    setWishlist(newWishlist);
    const wishlistArray = [...newWishlist];
    localStorage.setItem('movieWishlist', JSON.stringify(wishlistArray));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'movieWishlist',
      newValue: JSON.stringify(wishlistArray)
    }));
  };

  const handleBookNow = (movieId) => {
    navigate(`/book/${movieId}`);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    const matchesLanguage = !selectedLanguage || movie.language === selectedLanguage;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'showing' && movie.isNowShowing) ||
                         (selectedStatus === 'coming' && !movie.isNowShowing);
    
    return matchesSearch && matchesGenre && matchesLanguage && matchesStatus;
  });

  console.log('Movies - Total movies loaded:', movies.length);
  console.log('Movies - Filtered movies count:', filteredMovies.length);
  console.log('Movies - Current filters:', { searchTerm, selectedGenre, selectedLanguage, selectedStatus });

  // Modern Movie Card Component
  const MovieCard = ({ movie }) => {
    const isWishlisted = wishlist.has(movie.id);
    
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-red-500/50">
        {/* Movie Poster */}
        <div className="relative overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Wishlist Heart */}
          <button
            onClick={() => toggleWishlist(movie.id)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
            }`}
          >
            {isWishlisted ? (
              <HeartSolid className="h-5 w-5" />
            ) : (
              <HeartOutline className="h-5 w-5" />
            )}
          </button>
          
          {/* Status Badge */}
          {movie.isNowShowing ? (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Now Showing
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
              Coming Soon
            </div>
          )}
          
          {/* Rating */}
          <div className="absolute bottom-4 left-4 flex items-center bg-black/60 rounded-full px-3 py-1">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-white text-sm font-semibold">{movie.rating}</span>
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{movie.genre}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{movie.duration} min</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-red-500">₹{movie.price}</span>
            <span className="text-gray-400 text-sm">{movie.language}</span>
          </div>
          
          {/* Action Buttons */}
          {movie.isNowShowing ? (
            <button
              onClick={() => handleBookNow(movie.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              <FilmIcon className="h-5 w-5 mr-2" />
              Book Now
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-600 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Coming Soon
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
              Browse Movies
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover amazing movies and book your tickets instantly
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Find Your Perfect Movie</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
              />
            </div>
            
            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
            >
              <option value="">All Genres</option>
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="animation">Animation</option>
              <option value="comedy">Comedy</option>
              <option value="family">Family</option>
              <option value="sci-fi">Sci-Fi</option>
            </select>
            
            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
            </select>
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Movies</option>
              <option value="showing">Now Showing</option>
              <option value="coming">Coming Soon</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <FilmIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;