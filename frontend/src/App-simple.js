import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🎬 Movie Booking Application</h1>
          <p className="mt-2 text-blue-100">Your favorite movies, just a click away!</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🚀 Application Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Frontend: React Development Server Running</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Backend: Spring Boot API (Port 8080)</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Database: H2 In-Memory Database</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">🎯 Features Available:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• User Authentication & Registration</li>
              <li>• Movie Browsing & Search</li>
              <li>• Theater & Show Management</li>
              <li>• Seat Selection & Booking</li>
              <li>• Admin Dashboard</li>
              <li>• Event & Sports Booking</li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">🔗 Access Links:</h3>
            <div className="space-y-2 text-green-700">
              <div>• Frontend: <code className="bg-white px-2 py-1 rounded">http://localhost:3000</code></div>
              <div>• Backend API: <code className="bg-white px-2 py-1 rounded">http://localhost:8080/api</code></div>
              <div>• H2 Console: <code className="bg-white px-2 py-1 rounded">http://localhost:8080/api/h2-console</code></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2025 Movie Booking App - Built with React, Spring Boot & H2 Database</p>
        </div>
      </footer>
    </div>
  );
}

export default App;