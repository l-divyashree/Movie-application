import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    console.log('MyBookingsEnhanced - Component mounted');
    loadBookings();
    
    // Reload bookings when the page gains focus
    const handleFocus = () => {
      console.log('MyBookingsEnhanced - Focus event');
      loadBookings();
    };
    
    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'userBookings') {
        console.log('MyBookingsEnhanced - Storage change detected');
        loadBookings();
      }
    };
    
    // Also reload when navigating to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('MyBookingsEnhanced - Visibility change');
        loadBookings();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadBookings = async () => {
    console.log('MyBookingsEnhanced - loadBookings called');
    try {
      setLoading(true);
      
      // Load bookings from localStorage
      const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      
      console.log('MyBookingsEnhanced - User Bookings:', userBookings);
      
      // Transform bookings to match expected format
      const transformedBookings = userBookings.map(booking => ({
        id: booking.id,
        bookingReference: `BK${booking.id}`,
        status: booking.status || 'CONFIRMED',
        bookingDate: booking.bookingDate,
        totalAmount: booking.totalAmount,
        numberOfTickets: booking.seats?.length || 1,
        paymentStatus: 'PAID',
        qrCode: `QR${booking.id}`,
        canCancel: true,
        cancellationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        refundAmount: booking.totalAmount * 0.9, // 90% refund
        show: {
          id: booking.showId || 1,
          movie: { 
            id: booking.movieId || 1, 
            title: booking.movieTitle,
            posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
              duration: 150,
              genre: 'Action',
              rating: 'PG-13'
            },
          venue: { 
            id: 1, 
            name: booking.venue || 'CinemaFlix IMAX',
            address: booking.venue || 'CinemaFlix IMAX',
            city: { name: 'Bangalore' }
          },
          showDate: booking.date,
          showTime: booking.showTime,
          screen: { id: 1, name: 'Screen 1', type: 'REGULAR' }
        },
        seats: booking.seats?.map((seatId, index) => ({
          id: index + 1,
          seatNumber: seatId,
          seatType: 'REGULAR',
          price: booking.totalAmount / booking.seats.length || 250
        })) || []
      }));
      
      console.log('MyBookingsEnhanced - Transformed Bookings:', transformedBookings);
      
      setBookings(transformedBookings);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
      // Mock data for demonstration
      setBookings([
        {
          id: 'BK001',
          bookingReference: 'MB2025001',
          status: 'CONFIRMED',
          bookingDate: '2025-01-15T10:30:00Z',
          totalAmount: 25.50,
          numberOfTickets: 2,
          paymentStatus: 'PAID',
          qrCode: 'QR123456789',
          canCancel: true,
          cancellationDeadline: '2025-01-20T16:00:00Z',
          refundAmount: 23.00,
          show: {
            id: 1,
            movie: { 
              id: 1, 
              title: 'Spider-Man: No Way Home', 
              posterUrl: '/placeholder-movie.jpg',
              genre: 'Action, Adventure',
              duration: 148
            },
            venue: { 
              name: 'PVR Cinemas Forum Mall', 
              address: '123 Forum Mall, Downtown',
              screen: 'Screen 3'
            },
            showDateTime: '2025-01-20T19:30:00Z',
            format: 'IMAX 3D'
          },
          seats: [
            { id: 1, seatNumber: 'F12', type: 'Premium' },
            { id: 2, seatNumber: 'F13', type: 'Premium' }
          ],
          concessions: [
            { item: 'Large Popcorn', quantity: 1, price: 8.50 },
            { item: 'Soft Drink', quantity: 2, price: 6.00 }
          ]
        },
        {
          id: 'BK002',
          bookingReference: 'MB2025002',
          status: 'COMPLETED',
          bookingDate: '2025-01-10T15:45:00Z',
          totalAmount: 18.00,
          numberOfTickets: 1,
          paymentStatus: 'PAID',
          qrCode: 'QR987654321',
          canCancel: false,
          rating: null,
          show: {
            id: 2,
            movie: { 
              id: 2, 
              title: 'The Batman', 
              posterUrl: '/placeholder-movie.jpg',
              genre: 'Action, Crime',
              duration: 176
            },
            venue: { 
              name: 'AMC Theater Downtown', 
              address: '456 Main Street',
              screen: 'Screen 1'
            },
            showDateTime: '2025-01-12T21:00:00Z',
            format: 'Standard'
          },
          seats: [
            { id: 3, seatNumber: 'G8', type: 'Standard' }
          ],
          concessions: []
        },
        {
          id: 'BK003',
          bookingReference: 'MB2025003',
          status: 'CANCELLED',
          bookingDate: '2025-01-08T20:15:00Z',
          totalAmount: 32.75,
          numberOfTickets: 3,
          paymentStatus: 'REFUNDED',
          refundAmount: 30.00,
          cancellationDate: '2025-01-09T10:00:00Z',
          cancellationReason: 'User requested cancellation',
          show: {
            id: 3,
            movie: { 
              id: 3, 
              title: 'Dune: Part One', 
              posterUrl: '/placeholder-movie.jpg',
              genre: 'Sci-Fi, Adventure',
              duration: 155
            },
            venue: { 
              name: 'Cineplex Central', 
              address: '789 Cinema Blvd',
              screen: 'Screen 5'
            },
            showDateTime: '2025-01-15T18:00:00Z',
            format: 'Dolby Atmos'
          },
          seats: [
            { id: 4, seatNumber: 'E5', type: 'VIP' },
            { id: 5, seatNumber: 'E6', type: 'VIP' },
            { id: 6, seatNumber: 'E7', type: 'VIP' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(booking => 
        new Date(booking.show.showDateTime) > now && booking.status === 'CONFIRMED'
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(booking => 
        new Date(booking.show.showDateTime) <= now || booking.status === 'COMPLETED'
      );
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter(booking => booking.status === 'CANCELLED');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.show.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.show.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === filterStatus);
    }

    return filtered;
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await bookingService.cancelBooking(bookingId);
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED', cancellationDate: new Date().toISOString() }
          : booking
      ));
      
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const downloadETicket = async (booking) => {
    try {
      setLoading(true);
      const eTicketData = await bookingService.getETicket(booking.id);
      
      // Create PDF-like content from the ticket data
      const pdfContent = `
        E-TICKET - ${eTicketData.bookingReference || booking.bookingReference}
        
        Movie: ${booking.show.movie.title}
        Venue: ${booking.show.venue.name}
        Date & Time: ${new Date(booking.show.showDateTime).toLocaleString()}
        Seats: ${booking.seats.map(seat => seat.seatNumber).join(', ')}
        Total Amount: $${booking.totalAmount.toFixed(2)}
        
        QR Code: ${eTicketData.qrCode || booking.qrCode}
        Barcode: ${eTicketData.barcode || 'N/A'}
      `;
      
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eticket-${booking.bookingReference}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading e-ticket:', error);
      setError('Failed to download e-ticket');
    } finally {
      setLoading(false);
    }
  };

  const shareBooking = (booking) => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${booking.show.movie.title}`,
        text: `I'm watching ${booking.show.movie.title} at ${booking.show.venue.name} on ${new Date(booking.show.showDateTime).toLocaleDateString()}`,
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      const shareText = `I'm watching ${booking.show.movie.title} at ${booking.show.venue.name} on ${new Date(booking.show.showDateTime).toLocaleDateString()}`;
      navigator.clipboard.writeText(shareText);
      alert('Booking details copied to clipboard!');
    }
  };

  const rebookMovie = (booking) => {
    navigate(`/movies/${booking.show.movie.id}/shows`);
  };

  const rateMovie = (booking) => {
    navigate('/user/reviews', { state: { movieToRate: booking.show.movie } });
  };

  const generateQRCode = (qrData) => {
    // Simple QR code representation
    return `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='white'/%3E%3Ctext x='100' y='100' font-family='monospace' font-size='12' text-anchor='middle' fill='black'%3E${qrData}%3C/text%3E%3C/svg%3E`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-600 bg-green-100';
      case 'COMPLETED': return 'text-blue-600 bg-blue-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="animate-spin rounded-full h-28 w-28 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-black/70 to-neutral-800 rounded-lg shadow-sm p-6 mb-8 border border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-red-500">My Bookings</h1>
              <p className="text-neutral-300 mt-2">Manage your movie tickets and bookings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                onClick={() => navigate('/user/dashboard')}
                className="bg-transparent hover:bg-neutral-800 border border-neutral-700 text-neutral-200 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-850/60 rounded-lg shadow-sm p-6 border border-neutral-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-black/40">
                <span className="text-red-400 text-xl">🎫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-300">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-850/60 rounded-lg shadow-sm p-6 border border-neutral-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-black/40">
                <span className="text-red-400 text-xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-300">Upcoming</p>
                <p className="text-2xl font-bold text-white">
                  {bookings.filter(b => new Date(b.show.showDateTime) > new Date() && b.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-neutral-850/60 rounded-lg shadow-sm p-6 border border-neutral-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-black/40">
                <span className="text-red-400 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-300">Total Spent</p>
                <p className="text-2xl font-bold text-white">
                  ₹{bookings.filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'all', label: 'All Bookings' },
                  { id: 'cancelled', label: 'Cancelled' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-neutral-700 bg-neutral-900/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-neutral-200"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6">
            {filteredBookings.length > 0 ? (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-neutral-800 border-neutral-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex space-x-4">
                        <div className="w-20 h-28 bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-neutral-300 text-xs">IMG</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{booking.show.movie.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-neutral-300 mb-1">{booking.show.venue.name}</p>
                          <p className="text-sm text-neutral-400 mb-2">{booking.show.venue.address}</p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-300">
                            <span>📅 {new Date(booking.show.showDateTime).toLocaleDateString()}</span>
                            <span>🕐 {new Date(booking.show.showDateTime).toLocaleTimeString()}</span>
                            <span>🎬 {booking.show.format}</span>
                            <span>💺 {booking.seats.map(seat => seat.seatNumber).join(', ')}</span>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="font-medium text-neutral-200">Booking ID: {booking.bookingReference}</span>
                            <span className="text-neutral-300">Tickets: {booking.numberOfTickets}</span>
                            <span className="font-semibold text-red-400">${booking.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      {booking.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowQRModal(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            📱 Show QR Code
                          </button>
                          <button
                            onClick={() => downloadETicket(booking)}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            📥 Download E-Ticket
                          </button>
                          <button
                            onClick={() => shareBooking(booking)}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            📤 Share
                          </button>
                          {booking.canCancel && new Date(booking.cancellationDeadline) > new Date() && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              ❌ Cancel Booking
                            </button>
                          )}
                        </>
                      )}
                      
                      {booking.status === 'COMPLETED' && (
                        <>
                          <button
                            onClick={() => rebookMovie(booking)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            🔄 Book Again
                          </button>
                          <button
                            onClick={() => rateMovie(booking)}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            ⭐ Rate Movie
                          </button>
                          <button
                            onClick={() => downloadETicket(booking)}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            📄 Download Invoice
                          </button>
                        </>
                      )}

                      {booking.status === 'CANCELLED' && booking.refundAmount && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Refund: ${booking.refundAmount.toFixed(2)}</span>
                          <span className="ml-2">• Cancelled on {new Date(booking.cancellationDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Concessions */}
                    {booking.concessions && booking.concessions.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Concessions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {booking.concessions.map((item, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {item.quantity}x {item.item} - ${item.price.toFixed(2)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-300">
                <div className="text-red-400 text-6xl mb-4">🎫</div>
                <p className="text-neutral-200 text-lg mb-2">No bookings found</p>
                <p className="text-neutral-400 text-sm mb-6">
                  {activeTab === 'upcoming' && 'No upcoming bookings'}
                  {activeTab === 'past' && 'No past bookings'}
                  {activeTab === 'cancelled' && 'No cancelled bookings'}
                  {activeTab === 'all' && 'Start by booking your first movie'}
                </p>
                <button
                  onClick={() => navigate('/movies')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Movies
                </button>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  E-Ticket QR Code
                </h3>
                <div className="mb-4">
                  <img 
                    src={generateQRCode(selectedBooking.qrCode)} 
                    alt="QR Code"
                    className="mx-auto border rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedBooking.show.movie.title}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedBooking.show.venue.name}
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Show this QR code at the theatre for entry
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => downloadETicket(selectedBooking)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Booking
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your booking for "{selectedBooking.show.movie.title}"?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Refund Amount:</strong> ${selectedBooking.refundAmount?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Refund will be processed within 5-7 business days
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;