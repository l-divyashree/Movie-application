import React, { useState, useEffect } from 'react';
import { 
  TicketIcon, 
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadAllBookings();
    
    // Reload when component gains focus
    const handleFocus = () => {
      loadAllBookings();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAllBookings();
      }
    };
    
    // Listen for new bookings
    const handleBookingCreated = () => {
      loadAllBookings();
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('bookingCreated', handleBookingCreated);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('bookingCreated', handleBookingCreated);
    };
  }, []);

  const loadAllBookings = async () => {
    try {
      setLoading(true);
      
      // Try to load from API first
      let apiBookings = [];
      try {
        const data = await bookingService.getAllBookings(); // Admin endpoint
        apiBookings = Array.isArray(data) ? data : (data.content || []);
      } catch (apiError) {
        console.log('API bookings not available, using demo data');
      }
      
      // Load ALL demo bookings from localStorage (not filtered by user)
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      
      // Convert demo bookings to match API format
      const formattedDemoBookings = demoBookings.map(booking => ({
        id: booking.id,
        bookingReference: `BK${booking.id}`,
        user: {
          id: booking.userId,
          firstName: booking.userFirstName || 'Demo',
          lastName: booking.userLastName || 'User',
          email: booking.userEmail || `user${booking.userId}@demo.com`
        },
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
        paymentStatus: 'CONFIRMED',
        source: 'DEMO'
      }));
      
      // Combine API and demo bookings
      const allBookings = [...apiBookings, ...formattedDemoBookings];
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
                         booking.show?.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // For demo bookings, update localStorage
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const updatedDemoBookings = demoBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      localStorage.setItem('demoBookings', JSON.stringify(updatedDemoBookings));
      
      // For API bookings, call the API
      // await bookingService.updateBookingStatus(bookingId, newStatus);
      
      // Reload bookings
      loadAllBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
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
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h2>
          <p className="text-gray-600">Monitor and manage all movie bookings</p>
        </div>
        <button
          onClick={loadAllBookings}
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
              placeholder="Search by movie title, booking reference, venue, or user email..."
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Demo Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.source === 'DEMO').length}
              </p>
            </div>
          </div>
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
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No bookings have been made yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie & Show
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={`${booking.source || 'API'}-${booking.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.bookingReference}
                          {booking.source === 'DEMO' && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Demo
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.bookingDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.show?.movie?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.show?.venue?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.show?.showDate)} at {formatTime(booking.show?.showTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {booking.seats?.slice(0, 3).map((seat, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                          >
                            {seat.seatNumber}
                          </span>
                        ))}
                        {booking.seats?.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{booking.seats.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="text-sm border-gray-300 rounded"
                        >
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;