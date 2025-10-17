import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/movies/MovieCard';
import MovieFilters from '../components/movies/MovieFilters';
import Pagination from '../components/common/Pagination';
import movieService from '../services/movieService';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    language: '',
    rating: '',
    nowShowing: false,
    comingSoon: false,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });

  const fetchMovies = useCallback(async (currentFilters = filters, currentPage = pagination.page) => {
    setLoading(true);
    setError(null);
    
    try {
      const filterParams = {
        ...currentFilters,
        page: currentPage,
        size: pagination.size
      };

      console.log('Fetching movies with params:', filterParams);
      const response = await movieService.getMovies(filterParams);
      console.log('Movies response:', response);
      
      setMovies(response.content || []);
      setPagination({
        page: response.pageable?.pageNumber || 0,
        size: response.pageable?.pageSize || 12,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      });
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to prevent infinite re-renders

  useEffect(() => {
    fetchMovies(filters, pagination.page);
  }, []); // Only run once on component mount

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    fetchMovies(newFilters, 0); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    fetchMovies(filters, newPage);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-80 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Movies</h1>
          <p className="text-gray-600">
            Discover the latest blockbusters and timeless classics
          </p>
        </div>

        {/* Filters */}
        <MovieFilters 
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => fetchMovies()}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : movies.length > 0 ? (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {pagination.totalElements} movie{pagination.totalElements !== 1 ? 's' : ''}
                {filters.search && ` matching "${filters.search}"`}
                {filters.genre && ` in ${filters.genre}`}
                {filters.language && ` in ${filters.language}`}
              </p>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalElements={pagination.totalElements}
              size={pagination.size}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No movies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleFiltersChange({
                  search: '',
                  genre: '',
                  language: '',
                  rating: '',
                  nowShowing: null,
                  comingSoon: null,
                  sortBy: 'createdAt',
                  sortDirection: 'desc'
                })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;