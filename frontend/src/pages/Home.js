import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🎬 Welcome to MovieBook
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your ultimate destination for booking movies, events & sports
            </p>
            {!isAuthenticated() ? (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/movies"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Browse Movies
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <p className="text-lg mb-4">Welcome back, {user?.name}! 👋</p>
                <Link
                  to="/movies"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Movies
                </Link>
                <Link
                  to="/my-bookings"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Entertainment
          </h2>
          <p className="text-lg text-gray-600">
            Book tickets, manage your entertainment, and never miss out on the fun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movies */}
          <Link to="/movies" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Latest Movies
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Discover and book tickets for the latest blockbusters and indie films
              </p>
              <div className="text-center">
                <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                  Explore Movies →
                </span>
              </div>
            </div>
          </Link>

          {/* Events */}
          <Link to="/events" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">🎪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Live Events
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Concerts, comedy shows, theater performances and more
              </p>
              <div className="text-center">
                <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                  Browse Events →
                </span>
              </div>
            </div>
          </Link>

          {/* Sports */}
          <Link to="/sports" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">⚽</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Sports Matches
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Cricket, football, basketball and other sporting events
              </p>
              <div className="text-center">
                <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                  View Sports →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Movies Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Cinema Halls</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Entertainment Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users who trust MovieBook for their entertainment needs
          </p>
          {!isAuthenticated() ? (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign Up Now
            </Link>
          ) : (
            <Link
              to="/movies"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Booking
            </Link>
          )}
        </div>
      </div>

      {/* Tech Info Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Application Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Backend API</h4>
                <div className="text-sm text-green-700">
                  <p>✅ Spring Boot 3.x running on port 8080</p>
                  <p>✅ H2 Database connected</p>
                  <p>✅ JWT Authentication configured</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Frontend Application</h4>
                <div className="text-sm text-blue-700">
                  <p>✅ React 18 with TailwindCSS</p>
                  <p>✅ Authentication system integrated</p>
                  <p>🚧 UI components in development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;