import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);
      } catch (err) {
        setError('Failed to load movie details');
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/400/600';
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-96 md:h-full bg-gray-200"></div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                {error || 'Movie not found'}
              </h3>
              <button
                onClick={() => navigate('/movies')}
                className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
              >
                Back to Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/movies')}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Movies
        </button>

        {/* Movie Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3">
              <div className="relative">
                <img
                  src={movie.posterUrl || '/api/placeholder/400/600'}
                  alt={movie.title}
                  className="w-full h-96 md:h-full object-cover"
                  onError={handleImageError}
                />
                
                {/* Rating Badge */}
                {movie.rating && (
                  <div className={`absolute top-4 left-4 ${getRatingColor(movie.rating)} text-white px-3 py-1 rounded-full font-bold`}>
                    {movie.rating}/10
                  </div>
                )}
                
                {/* Status Badge */}
                {movie.nowShowing && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    NOW SHOWING
                  </div>
                )}
                {movie.comingSoon && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    COMING SOON
                  </div>
                )}
              </div>
            </div>

            {/* Movie Information */}
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre && movie.genre.split(',').map((g, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>

                {/* Movie Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {movie.language && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Language</dt>
                      <dd className="text-sm text-gray-900">{movie.language}</dd>
                    </div>
                  )}
                  
                  {movie.duration && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="text-sm text-gray-900">{formatDuration(movie.duration)}</dd>
                    </div>
                  )}
                  
                  {movie.releaseDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Release Date</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  
                  {movie.director && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Director</dt>
                      <dd className="text-sm text-gray-900">{movie.director}</dd>
                    </div>
                  )}
                  
                  {movie.cast && (
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Cast</dt>
                      <dd className="text-sm text-gray-900">{movie.cast}</dd>
                    </div>
                  )}
                </div>

                {/* Description */}
                {movie.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Synopsis</h3>
                    <p className="text-gray-700 leading-relaxed">{movie.description}</p>
                  </div>
                )}

                {/* Trailer */}
                {movie.trailerUrl && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Trailer</h3>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={movie.trailerUrl}
                        title={`${movie.title} Trailer`}
                        className="w-full h-64 rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {movie.nowShowing && (
                    <button
                      onClick={() => navigate(`/book/${movie.id}`)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                    >
                      Book Tickets
                    </button>
                  )}
                  
                  <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium">
                    Add to Watchlist
                  </button>
                  
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;