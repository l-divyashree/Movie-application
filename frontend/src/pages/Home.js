import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black/80 to-neutral-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-red-500">
              🎬 Welcome to MovieBook
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-300">
              Your ultimate destination for booking movies, events & sports
            </p>
            {!isAuthenticated() ? (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/movies"
                  className="border-2 border-red-600 text-red-300 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
                >
                  Browse Movies
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <p className="text-lg mb-4 text-neutral-300">Welcome back, {user?.name}! 👋</p>
                <Link
                  to="/movies"
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Browse Movies
                </Link>
                <Link
                  to="/my-bookings"
                  className="border-2 border-red-600 text-red-300 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
                >
                  My Bookings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need for Entertainment
          </h2>
          <p className="text-lg text-neutral-300">
            Book tickets, manage your entertainment, and never miss out on the fun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movies */}
          <Link to="/movies" className="group">
            <div className="bg-neutral-800/60 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-neutral-700">
              <div className="text-4xl mb-4 text-center">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Latest Movies
              </h3>
              <p className="text-neutral-300 text-center mb-4">
                Discover and book tickets for the latest blockbusters and indie films
              </p>
              <div className="text-center">
                <span className="text-red-400 group-hover:text-red-500 font-medium">
                  Explore Movies →
                </span>
              </div>
            </div>
          </Link>

          {/* Events */}
          <Link to="/events" className="group">
            <div className="bg-neutral-800/60 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-neutral-700">
              <div className="text-4xl mb-4 text-center">🎪</div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Live Events
              </h3>
              <p className="text-neutral-300 text-center mb-4">
                Concerts, comedy shows, theater performances and more
              </p>
              <div className="text-center">
                <span className="text-red-400 group-hover:text-red-500 font-medium">
                  Browse Events →
                </span>
              </div>
            </div>
          </Link>

          {/* Sports */}
          <Link to="/sports" className="group">
            <div className="bg-neutral-800/60 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-neutral-700">
              <div className="text-4xl mb-4 text-center">⚽</div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Sports Matches
              </h3>
              <p className="text-neutral-300 text-center mb-4">
                Cricket, football, basketball and other sporting events
              </p>
              <div className="text-center">
                <span className="text-red-400 group-hover:text-red-500 font-medium">
                  View Sports →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-neutral-800/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">10K+</div>
              <div className="text-neutral-300">Movies Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">500+</div>
              <div className="text-neutral-300">Cinema Halls</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">1M+</div>
              <div className="text-neutral-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">50+</div>
              <div className="text-neutral-300">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Entertainment Journey?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            Join thousands of users who trust MovieBook for their entertainment needs
          </p>
          {!isAuthenticated() ? (
            <Link
              to="/register"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign Up Now
            </Link>
          ) : (
            <Link
              to="/movies"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Start Booking
            </Link>
          )}
        </div>
      </div>

      {/* Tech Info Section removed as requested */}
    </div>
  );
};

export default Home;