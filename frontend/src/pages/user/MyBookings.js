import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  TicketIcon, 
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    console.log('MyBookings - Component mounted, setting up event listeners');
    loadBookings();
    
    // Reload bookings when the page gains focus
    const handleFocus = () => {
      loadBookings();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Also reload when navigating to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadBookings();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for new bookings
    const handleBookingCreated = () => {
      console.log('MyBookings - bookingCreated event received');
      loadBookings();
    };
    
    window.addEventListener('bookingCreated', handleBookingCreated);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('bookingCreated', handleBookingCreated);
    };
  }, []);

  const loadBookings = async () => {
    console.log('MyBookings - loadBookings function called');
    try {
      setLoading(true);
      
      // Try to load from API first
      let apiBookings = [];
      try {
        const data = await bookingService.getUserBookings();
        apiBookings = Array.isArray(data) ? data : (data.content || []);
      } catch (apiError) {
        console.log('API bookings not available, using demo data');
      }
      
      // Load demo bookings from localStorage
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Debug logging
      console.log('MyBookings - Current User:', currentUser);
      console.log('MyBookings - All Demo Bookings:', demoBookings);
      console.log('MyBookings - User ID for filtering:', currentUser.id);
      
      // Filter demo bookings for current user
      const userDemoBookings = demoBookings
        .filter(booking => {
          console.log('Booking userId:', booking.userId, 'Current userId:', currentUser.id, 'Match:', booking.userId === currentUser.id);
          return booking.userId === currentUser.id;
        })
        .map(booking => ({
          id: booking.id,
          bookingReference: `BK${booking.id}`,
          show: {
            movie: { 
              title: booking.movieTitle,
              posterUrl: '/placeholder-movie.jpg' 
            },
            venue: { 
              name: booking.venueName,
              address: booking.venueName 
            },
            showDate: booking.showDate,
            showTime: booking.showTime
          },
          seats: booking.seats.map(seat => ({
            seatNumber: seat.seatNumber,
            seatType: seat.type,
            price: seat.price
          })),
          totalAmount: booking.totalAmount,
          bookingDate: booking.bookingDate,
          status: booking.status || 'CONFIRMED',
          paymentStatus: 'CONFIRMED'
        }));
      
      console.log('MyBookings - Filtered User Bookings:', userDemoBookings);
      
      // Combine API and demo bookings
      const allBookings = [...apiBookings, ...userDemoBookings];
      console.log('MyBookings - All Bookings to display:', allBookings);
      setBookings(allBookings);
      
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.show?.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.show?.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <TicketIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and track your movie bookings</p>
          </div>
          <button
            onClick={loadBookings}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by movie title, booking reference, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t made any bookings yet'}
            </p>
            <button
              onClick={() => navigate('/movies')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Your First Movie
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 lg:mb-0">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span>{booking.status}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Booking ID: {booking.bookingReference}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Booked on {formatDate(booking.bookingDate)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Movie Info */}
                    <div className="md:col-span-2">
                      <div className="flex space-x-4">
                        <img
                          src={booking.show?.movie?.posterUrl || '/placeholder-movie.jpg'}
                          alt={booking.show?.movie?.title}
                          className="w-20 h-28 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/placeholder-movie.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {booking.show?.movie?.title}
                          </h3>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{booking.show?.venue?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(booking.show?.showDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-4 h-4" />
                              <span>{formatTime(booking.show?.showTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Seats</h4>
                        <div className="flex flex-wrap gap-2">
                          {booking.seats?.map((seat, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                            >
                              {seat.seatNumber}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Total Amount</span>
                        <div className="flex items-center text-xl font-bold text-gray-900">
                          <CurrencyRupeeIcon className="w-5 h-5" />
                          <span>{booking.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Payment Status: 
                      <span className={`ml-1 font-medium ${
                        booking.paymentStatus === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      {booking.status === 'CONFIRMED' && (
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Download Ticket
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;