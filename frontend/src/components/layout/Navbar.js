import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, HeartIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav 
      className="sticky top-0 z-50 backdrop-blur-md" 
      style={{ 
        background: 'linear-gradient(135deg, rgba(10, 10, 11, 0.95), rgba(26, 27, 35, 0.95))', 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
      }}
    >
      <div className="container-main">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 fade-in group">
            <div className="relative">
              <span className="text-4xl filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110">🎬</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <span 
              className="text-2xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
              style={{ 
                textShadow: '0 0 20px rgba(255, 7, 58, 0.5)',
                fontFamily: "'Cinzel', serif"
              }}
            >
              CinemaFlix
            </span>
          </Link>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                {/* Notifications Icon */}
                <button className="relative p-2 text-gray-300 hover:text-red-400 transition-colors duration-300 group">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    3
                  </span>
                  <span className="absolute inset-0 rounded-full bg-red-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </button>

                {/* Wishlist Icon */}
                <Link 
                  to="/user/wishlist"
                  className="relative p-2 text-gray-300 hover:text-red-400 transition-colors duration-300 group"
                >
                  <HeartIcon className="h-6 w-6" />
                  <span className="absolute inset-0 rounded-full bg-red-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-3 transition-all duration-200">
                    <span 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: 'var(--brand-primary)', 
                        color: 'var(--text-inverse)',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {user?.name || 'User'}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className="absolute right-0 mt-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 slide-up"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--neutral-200)'
                    }}
                  >
                    <div style={{ padding: 'var(--space-sm)' }}>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--neutral-100)';
                          e.target.style.color = 'var(--brand-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'var(--text-primary)';
                        }}
                      >
                        Profile
                      </Link>
                      {user?.roles?.some(role => role.name === 'ROLE_ADMIN') && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--neutral-100)';
                            e.target.style.color = 'var(--brand-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'var(--text-primary)';
                          }}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--neutral-100)';
                          e.target.style.color = 'var(--brand-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'var(--text-primary)';
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="bg-white text-neutral-900 px-6 py-3 rounded-xl text-lg font-medium hover:bg-neutral-100 transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-neutral-900 px-6 py-3 rounded-xl text-lg font-medium hover:bg-neutral-100 transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-8 h-8 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="py-4 space-y-4">
              <Link 
                to="/movies" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/events" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/sports" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sports
              </Link>
              
              {isAuthenticated() ? (
                <>
                  <Link 
                    to="/my-bookings" 
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user?.roles?.some(role => role.name === 'ROLE_ADMIN') && (
                    <Link 
                      to="/admin" 
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block bg-white text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-100 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;