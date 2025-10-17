import React, { useState, useEffect } from 'react';
import movieService from '../../services/movieService';

const MovieFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    language: '',
    rating: '',
    nowShowing: false,
    comingSoon: false,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    ...initialFilters
  });

  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [genresData, languagesData] = await Promise.all([
          movieService.getGenres(),
          movieService.getLanguages()
        ]);
        setGenres(genresData);
        setLanguages(languagesData);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      genre: '',
      language: '',
      rating: '',
      nowShowing: false,
      comingSoon: false,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Movies</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Movies
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Movie title, actor, director..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Rating</option>
            <option value="8">8+ Excellent</option>
            <option value="7">7+ Very Good</option>
            <option value="6">6+ Good</option>
            <option value="5">5+ Average</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Movie Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Movie Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="movieStatus"
                checked={filters.nowShowing === true}
                onChange={() => handleFilterChange('nowShowing', true)}
                className="mr-2"
              />
              Now Showing
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="movieStatus"
                checked={filters.comingSoon === true}
                onChange={() => handleFilterChange('comingSoon', true)}
                className="mr-2"
              />
              Coming Soon
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="movieStatus"
                checked={filters.nowShowing === null && filters.comingSoon === null}
                onChange={() => {
                  handleFilterChange('nowShowing', null);
                  handleFilterChange('comingSoon', null);
                }}
                className="mr-2"
              />
              All
            </label>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt">Latest Added</option>
            <option value="title">Title</option>
            <option value="releaseDate">Release Date</option>
            <option value="rating">Rating</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            value={filters.sortDirection}
            onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;