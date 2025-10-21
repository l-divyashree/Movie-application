import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon as HeartSolid,
  StarIcon,
  ClockIcon,
  FilmIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(() => {
    try {
      setLoading(true);
      
      // Get wishlist from localStorage (full movie objects, not just IDs)
      const savedWishlist = localStorage.getItem('wishlist');
      const wishlistMovies = savedWishlist ? JSON.parse(savedWishlist) : [];
      setWishlistItems(wishlistMovies);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
    
    // Listen for storage changes to update wishlist in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'wishlist') {
        fetchWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchWishlist]);

  const removeFromWishlist = (movieId) => {
    const savedWishlist = localStorage.getItem('wishlist');
    const wishlistMovies = savedWishlist ? JSON.parse(savedWishlist) : [];
    const updatedWishlist = wishlistMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Update local state immediately
    setWishlistItems(updatedWishlist);
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'wishlist',
      newValue: JSON.stringify(updatedWishlist)
    }));
  };

  const handleBookNow = (movieId) => {
    navigate(`/book/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading your wishlist...</p>
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
              My Wishlist
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your favorite movies saved for later
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <HeartOutline className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-8">Start adding movies to your wishlist by clicking the heart icon on movie cards.</p>
            <button
              onClick={() => navigate('/movies')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                {wishlistItems.length} movie{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((movie) => (
                <div 
                  key={movie.id} 
                  className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden h-96">
                    <img
                      src={movie.poster}
                      alt={`${movie.title} ${movie.subtitle || ''}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Remove from Wishlist - Enhanced */}
                    <button
                      onClick={() => removeFromWishlist(movie.id)}
                      className="absolute top-4 right-4 p-3 rounded-full bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                      <HeartSolid className="h-5 w-5" />
                    </button>
                    
                    {/* Now Showing Badge - Enhanced */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Now Showing
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-white font-bold">{movie.rating}</span>
                    </div>
                    
                    {/* Tickets Left */}
                    <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {movie.ticketsLeft} left
                    </div>
                  </div>
                  
                  {/* Movie Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
                        {movie.title}
                        {movie.subtitle && (
                          <span className="block text-lg text-gray-300 font-medium">{movie.subtitle}</span>
                        )}
                      </h3>
                      <p className="text-red-400 text-sm font-semibold uppercase tracking-wider">{movie.genre}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{movie.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FilmIcon className="h-4 w-4" />
                        <span>{movie.language}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        ₹{movie.price}
                      </span>
                    </div>
                    
                    {/* Enhanced Action Buttons */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleBookNow(movie.id)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]"
                        style={{
                          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <FilmIcon className="h-5 w-5" />
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;