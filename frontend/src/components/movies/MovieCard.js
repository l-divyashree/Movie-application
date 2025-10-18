import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/300/450';
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return { 
      backgroundColor: 'var(--accent-success)', 
      color: 'var(--text-primary)',
      boxShadow: 'var(--glow-blue)'
    };
    if (rating >= 6) return { 
      backgroundColor: 'var(--brand-primary)', 
      color: 'var(--text-inverse)',
      boxShadow: 'var(--glow-red)'
    };
    return { 
      backgroundColor: 'var(--accent-error)', 
      color: 'var(--text-primary)',
      boxShadow: 'var(--glow-red)'
    };
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, var(--background-secondary), var(--background-tertiary))',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: isHovered ? 'var(--shadow-xl), var(--glow-red)' : 'var(--shadow-lg)',
        border: '1px solid rgba(255, 215, 0, 0.1)'
      }}
    >
      {/* Cinematic Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 rounded-2xl transition-opacity duration-500"
        style={{ opacity: isHovered ? 0.8 : 0.4 }}
      />
      
      {/* Movie Poster */}
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={movie.posterUrl || '/api/placeholder/300/450'}
          alt={movie.title}
          className={`w-full h-96 object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 blur-sm' : 'scale-100'
          }`}
          onError={handleImageError}
        />
        
        {/* Animated Light Streak */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 transition-transform duration-1000"
          style={{
            transform: isHovered 
              ? 'translateX(100%) skewX(-12deg)' 
              : 'translateX(-150%) skewX(-12deg)'
          }}
        />
        
        {/* Rating Badge with Glow */}
        {movie.rating && (
          <div 
            className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all duration-300 hover:scale-110"
            style={{
              ...getRatingColor(movie.rating),
              animation: isHovered ? 'pulse 2s infinite' : 'none'
            }}
          >
            ⭐ {movie.rating}
          </div>
        )}
        
        {/* Status Badge */}
        {movie.isNowShowing && (
          <div 
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
            style={{ 
              background: 'linear-gradient(45deg, var(--accent-error), #FF4081)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--glow-red)'
            }}
          >
            🔴 LIVE
          </div>
        )}
        {movie.isComingSoon && (
          <div 
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
            style={{ 
              background: 'linear-gradient(45deg, var(--brand-primary), #FFA726)',
              color: 'var(--text-inverse)',
              boxShadow: 'var(--glow-red)'
            }}
          >
            🚀 SOON
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div 
            className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl"
            style={{ boxShadow: 'var(--glow-red)' }}
          >
            <div className="w-0 h-0 border-l-8 border-r-0 border-t-6 border-b-6 border-l-black border-t-transparent border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      {/* Movie Details Overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-all duration-500"
        style={{
          background: isHovered 
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
        }}
      >
        {/* Movie Title with Glow Effect */}
        <h3 
          className={`text-2xl font-bold mb-3 transition-all duration-500 ${
            isHovered ? 'text-red-400' : 'text-white'
          }`}
          style={{
            textShadow: isHovered ? '0 0 10px rgba(255, 215, 0, 0.8)' : '0 2px 4px rgba(0,0,0,0.8)',
            transform: isHovered ? 'translateY(-10px)' : 'translateY(0)'
          }}
        >
          {movie.title}
        </h3>
        
        {/* Genre Tags with Neon Effect */}
        <div className={`flex flex-wrap gap-2 mb-4 transition-all duration-700 ${
          isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-2'
        }`}>
          {movie.genre && movie.genre.split(',').slice(0, 2).map((g, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
              style={{ 
                background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(0, 217, 255, 0.2))',
                border: '1px solid rgba(255, 215, 0, 0.4)',
                color: 'var(--brand-primary)',
                boxShadow: isHovered ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
              }}
            >
              {g.trim()}
            </span>
          ))}
        </div>

        {/* Movie Details with Slide Animation */}
        <div 
          className={`text-sm space-y-1 transition-all duration-700 ${
            isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          {movie.language && (
            <div className="flex items-center text-gray-300">
              <span>🌐</span>
              <span className="ml-2">{movie.language}</span>
            </div>
          )}
          
          {movie.durationMinutes && (
            <div className="flex items-center text-gray-300">
              <span>⏱️</span>
              <span className="ml-2">{formatDuration(movie.durationMinutes)}</span>
            </div>
          )}
          
          {movie.releaseDate && (
            <div className="flex items-center text-gray-300">
              <span>📅</span>
              <span className="ml-2">{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons with Cinematic Styling */}
        <div 
          className={`mt-6 flex gap-3 transition-all duration-700 ${
            isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
          }`}
        >
          <Link
            to={`/movies/${movie.id}`}
            className="flex-1 px-4 py-2 rounded-lg font-bold text-center transition-all duration-300 backdrop-blur-sm"
            style={{ 
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              color: 'var(--brand-primary)',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(45deg, rgba(255, 7, 58, 0.2), rgba(255, 7, 58, 0.3))';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--glow-red)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            Details
          </Link>
          
          {movie.isNowShowing && (
            <Link
              to={`/book/${movie.id}`}
              className="flex-1 px-4 py-2 rounded-lg font-bold text-center transition-all duration-300"
              style={{ 
                background: 'linear-gradient(45deg, var(--brand-primary), #FFA726)',
                color: 'var(--text-inverse)',
                textDecoration: 'none',
                boxShadow: 'var(--glow-red)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'var(--glow-red)';
              }}
            >
              🎟️ Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;