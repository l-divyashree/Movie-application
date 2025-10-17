import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      // Mock wishlist data
      const mockWishlist = [
        {
          id: 1,
          movieId: 'MOV001',
          title: 'Spider-Man: No Way Home',
          genre: 'Action, Adventure',
          rating: 8.4,
          duration: 148,
          language: 'English',
          releaseDate: '2021-12-17',
          director: 'Jon Watts',
          cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
          description: 'Peter Parker seeks help from Doctor Strange when his identity is revealed.',
          posterUrl: '/placeholder-movie.jpg',
          dateAdded: '2025-01-15T10:30:00Z',
          status: 'now-showing',
          availableShows: 15
        },
        {
          id: 2,
          movieId: 'MOV002',
          title: 'The Batman',
          genre: 'Action, Crime, Drama',
          rating: 7.8,
          duration: 176,
          language: 'English',
          releaseDate: '2022-03-04',
          director: 'Matt Reeves',
          cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano'],
          description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
          posterUrl: '/placeholder-movie.jpg',
          dateAdded: '2025-01-10T15:45:00Z',
          status: 'now-showing',
          availableShows: 8
        },
        {
          id: 3,
          movieId: 'MOV003',
          title: 'Dune: Part Two',
          genre: 'Sci-Fi, Adventure',
          rating: 8.9,
          duration: 166,
          language: 'English',
          releaseDate: '2024-03-01',
          director: 'Denis Villeneuve',
          cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
          description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.',
          posterUrl: '/placeholder-movie.jpg',
          dateAdded: '2025-01-08T20:15:00Z',
          status: 'coming-soon',
          availableShows: 0
        },
        {
          id: 4,
          movieId: 'MOV004',
          title: 'Avengers: Endgame',
          genre: 'Action, Adventure, Drama',
          rating: 8.4,
          duration: 181,
          language: 'English',
          releaseDate: '2019-04-26',
          director: 'Anthony Russo, Joe Russo',
          cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
          description: 'The Avengers assemble once more to reverse Thanos\' actions.',
          posterUrl: '/placeholder-movie.jpg',
          dateAdded: '2025-01-05T18:20:00Z',
          status: 'ended',
          availableShows: 0
        }
      ];
      setWishlistItems(mockWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const sortItems = (items) => {
    switch (sortBy) {
      case 'title':
        return [...items].sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return [...items].sort((a, b) => b.rating - a.rating);
      case 'releaseDate':
        return [...items].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      case 'dateAdded':
      default:
        return [...items].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
  };

  const filterItems = (items) => {
    switch (filterBy) {
      case 'now-showing':
        return items.filter(item => item.status === 'now-showing');
      case 'coming-soon':
        return items.filter(item => item.status === 'coming-soon');
      case 'ended':
        return items.filter(item => item.status === 'ended');
      case 'all':
      default:
        return items;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'now-showing': return 'text-green-600 bg-green-100';
      case 'coming-soon': return 'text-blue-600 bg-blue-100';
      case 'ended': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'now-showing': return 'Now Showing';
      case 'coming-soon': return 'Coming Soon';
      case 'ended': return 'Ended';
      default: return 'Unknown';
    }
  };

  const bookMovie = (movie) => {
    navigate('/movies', { state: { selectedMovie: movie.movieId } });
  };

  const sortedAndFilteredItems = sortItems(filterItems(wishlistItems));

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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Keep track of movies you want to watch</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100">
                <span className="text-pink-600 text-xl">❤️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Movies</p>
                <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-green-600 text-xl">🎬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Now Showing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wishlistItems.filter(item => item.status === 'now-showing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-blue-600 text-xl">🔜</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Coming Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wishlistItems.filter(item => item.status === 'coming-soon').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wishlistItems.length > 0 
                    ? (wishlistItems.reduce((sum, item) => sum + item.rating, 0) / wishlistItems.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Movies</option>
                  <option value="now-showing">Now Showing</option>
                  <option value="coming-soon">Coming Soon</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                  <option value="releaseDate">Release Date</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => navigate('/movies')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Add Movies
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-6">
          {sortedAndFilteredItems.length > 0 ? (
            sortedAndFilteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-48 h-64 md:h-auto bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">Movie Poster</span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>{item.genre}</span>
                          <span>•</span>
                          <span>{item.duration} min</span>
                          <span>•</span>
                          <span>{item.language}</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">⭐</span>
                            <span className="font-medium">{item.rating}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                          {item.status === 'now-showing' && (
                            <span className="text-sm text-green-600 font-medium">
                              {item.availableShows} shows available
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove from wishlist"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Director:</span> {item.director}</p>
                        <p><span className="font-medium">Cast:</span> {item.cast.slice(0, 3).join(', ')}</p>
                        <p><span className="font-medium">Added:</span> {new Date(item.dateAdded).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        {item.status === 'now-showing' ? (
                          <button
                            onClick={() => bookMovie(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Book Now
                          </button>
                        ) : item.status === 'coming-soon' ? (
                          <button className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed">
                            Coming Soon
                          </button>
                        ) : (
                          <button className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed">
                            No Longer Available
                          </button>
                        )}
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">❤️</div>
              <p className="text-gray-500 text-xl mb-2">Your wishlist is empty</p>
              <p className="text-gray-400 mb-6">Browse movies and add them to your wishlist</p>
              <button
                onClick={() => navigate('/movies')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Movies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;