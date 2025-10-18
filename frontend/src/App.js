import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import BookMovie from './pages/BookMovie';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import MyBookingsEnhanced from './pages/user/MyBookingsEnhanced';
import ProfileEnhanced from './pages/user/ProfileEnhanced';
import PaymentsWallet from './pages/user/PaymentsWallet';
import InvoicesTickets from './pages/user/InvoicesTickets';
import NotificationsCenter from './pages/user/NotificationsCenter';
import OffersDeals from './pages/user/OffersDeals';
import Wishlist from './pages/user/Wishlist';
import Reviews from './pages/user/Reviews';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Booking Components
import ShowSelection from './components/booking/ShowSelection';
import SeatSelection from './components/booking/SeatSelection';
import BookingConfirmation from './components/booking/BookingConfirmation';
import Payment from './components/booking/Payment';

const Events = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Events</h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600">Events listing page coming soon...</p>
    </div>
  </div>
);

const Sports = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Sports</h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600">Sports events page coming soon...</p>
    </div>
  </div>
);

// Placeholder components for additional user dashboard modules
const Notifications = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
        <p className="text-gray-600">Notifications page coming soon...</p>
      </div>
    </div>
  </div>
);

const LocationSettings = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Location Settings</h1>
        <p className="text-gray-600">Location preferences page coming soon...</p>
      </div>
    </div>
  </div>
);

const AccountSettings = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Settings</h1>
        <p className="text-gray-600">Account settings page coming soon...</p>
      </div>
    </div>
  </div>
);

const Support = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Support</h1>
        <p className="text-gray-600">Support page coming soon...</p>
      </div>
    </div>
  </div>
);

const ActivityLog = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Activity Log</h1>
        <p className="text-gray-600">Activity log page coming soon...</p>
      </div>
    </div>
  </div>
);



function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Booking Flow Routes */}
              <Route path="/book/:movieId" element={
                <ProtectedRoute>
                  <BookMovie />
                </ProtectedRoute>
              } />
              <Route path="/movies/:id/shows" element={
                <ProtectedRoute>
                  <ShowSelection />
                </ProtectedRoute>
              } />
              <Route path="/booking/seats/:showId" element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="/booking-confirmation" element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/booking/confirm" element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } />
              
              {/* Protected User Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/bookings" element={
                <ProtectedRoute>
                  <MyBookingsEnhanced />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBookingsEnhanced />
                </ProtectedRoute>
              } />
              <Route path="/user/profile" element={
                <ProtectedRoute>
                  <ProfileEnhanced />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfileEnhanced />
                </ProtectedRoute>
              } />
              <Route path="/user/payments" element={
                <ProtectedRoute>
                  <PaymentsWallet />
                </ProtectedRoute>
              } />
              <Route path="/user/invoices" element={
                <ProtectedRoute>
                  <InvoicesTickets />
                </ProtectedRoute>
              } />
              <Route path="/user/offers" element={
                <ProtectedRoute>
                  <OffersDeals />
                </ProtectedRoute>
              } />
              <Route path="/user/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/user/reviews" element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              } />
              <Route path="/user/notifications" element={
                <ProtectedRoute>
                  <NotificationsCenter />
                </ProtectedRoute>
              } />
              <Route path="/user/locations" element={
                <ProtectedRoute>
                  <LocationSettings />
                </ProtectedRoute>
              } />
              <Route path="/user/settings" element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              } />
              <Route path="/user/support" element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } />
              <Route path="/user/activity" element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={
                <div className="container mx-auto px-4 py-8 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="text-blue-600 hover:text-blue-800">Return to Home</a>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;