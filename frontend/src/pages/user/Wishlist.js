import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon as HeartSolid,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  FilmIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock movie data to match with wishlist IDs
  const movieDatabase = {
    1: {
      id: 1,
      title: 'Dune: Part Two',
      genre: 'Sci-Fi, Adventure',
      language: 'English',
      rating: 8.5,
      duration: 166,
      releaseDate: '2024-03-01',
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      isNowShowing: true,
      price: 350
    },
    2: {
      id: 2,
      title: 'Godzilla x Kong: The New Empire',
      genre: 'Action, Adventure',
      language: 'English',
      rating: 6.4,
      duration: 115,
      releaseDate: '2024-03-29',
      poster: 'https://image.tmdb.org/t/p/w500/gmGK92wI1dwI5F1kmrvCRzKRGAJ.jpg',
      isNowShowing: true,
      price: 300
    },
    3: {
      id: 3,
      title: 'Deadpool & Wolverine',
      genre: 'Action, Comedy',
      language: 'English',
      rating: 7.8,
      duration: 128,
      releaseDate: '2024-07-26',
      poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      isNowShowing: true,
      price: 400
    },
    4: {
      id: 4,
      title: 'Inside Out 2',
      genre: 'Animation, Family',
      language: 'English',
      rating: 7.6,
      duration: 96,
      releaseDate: '2024-06-14',
      poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      isNowShowing: true,
      price: 250
    },
    5: {
      id: 5,
      title: 'Transformers One',
      genre: 'Animation, Action',
      language: 'English',
      rating: 7.9,
      duration: 104,
      releaseDate: '2024-09-20',
      poster: 'https://image.tmdb.org/t/p/w500/qbkAqmmEIZfrCO8ZQAuIuVMlWoV.jpg',
      isNowShowing: false,
      price: 320
    },
    6: {
      id: 6,
      title: 'The Wild Robot',
      genre: 'Animation, Family',
      language: 'English',
      rating: 8.3,
      duration: 102,
      releaseDate: '2024-09-27',
      poster: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
      isNowShowing: true,
      price: 280
    }
  };

  useEffect(() => {
    fetchWishlist();
    
    // Listen for storage changes to update wishlist in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'movieWishlist') {
        fetchWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchWishlist = () => {
    try {
      setLoading(true);
      
      // Get wishlist IDs from localStorage
      const savedWishlist = localStorage.getItem('movieWishlist');
      const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      // Map wishlist IDs to movie objects
      const wishlistMovies = wishlistIds.map(id => {
        const movie = movieDatabase[id];
        if (!movie) return null;
        
        return {
          ...movie,
          dateAdded: new Date(Date.now()).toISOString() // Safe date creation
        };
      }).filter(movie => movie !== null);
      
      setWishlistItems(wishlistMovies);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (movieId) => {
    const savedWishlist = localStorage.getItem('movieWishlist');
    const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
    const updatedWishlist = wishlistIds.filter(id => id !== movieId);
    localStorage.setItem('movieWishlist', JSON.stringify(updatedWishlist));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'movieWishlist',
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((movie) => (
                <div key={movie.id} className="bg-gray-800 rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-red-500/50">
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Remove from Wishlist */}
                    <button
                      onClick={() => removeFromWishlist(movie.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                    >
                      <HeartSolid className="h-5 w-5" />
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;