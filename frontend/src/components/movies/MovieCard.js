import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/300/450';
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Movie Poster */}
      <div className="relative">
        <img
          src={movie.posterUrl || '/api/placeholder/300/450'}
          alt={movie.title}
          className="w-full h-80 object-cover"
          onError={handleImageError}
        />
        
        {/* Rating Badge */}
        {movie.rating && (
          <div className={`absolute top-2 left-2 ${getRatingColor(movie.rating)} text-white px-2 py-1 rounded-full text-sm font-bold`}>
            {movie.rating}/10
          </div>
        )}
        
        {/* Now Showing / Coming Soon Badge */}
        {movie.isNowShowing && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NOW SHOWING
          </div>
        )}
        {movie.isComingSoon && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            COMING SOON
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden">
          <span className="block truncate">{movie.title}</span>
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre && movie.genre.split(',').map((g, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {g.trim()}
            </span>
          ))}
        </div>

        {/* Movie Info */}
        <div className="text-sm text-gray-600 space-y-1">
          {movie.language && (
            <div className="flex items-center">
              <span className="font-medium">Language:</span>
              <span className="ml-1">{movie.language}</span>
            </div>
          )}
          
          {movie.durationMinutes && (
            <div className="flex items-center">
              <span className="font-medium">Duration:</span>
              <span className="ml-1">{formatDuration(movie.durationMinutes)}</span>
            </div>
          )}
          
          {movie.releaseDate && (
            <div className="flex items-center">
              <span className="font-medium">Release:</span>
              <span className="ml-1">{new Date(movie.releaseDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {movie.description && (
          <p className="text-sm text-gray-600 mt-3 h-12 overflow-hidden">
            {movie.description.length > 100 
              ? `${movie.description.substring(0, 100)}...` 
              : movie.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            to={`/movies/${movie.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center text-sm font-medium"
          >
            View Details
          </Link>
          
          {movie.isNowShowing && (
            <Link
              to={`/book/${movie.id}`}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-center text-sm font-medium"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;