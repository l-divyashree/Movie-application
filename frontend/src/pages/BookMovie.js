import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import seedAdminShows from '../utils/seedAdminShows';
import { 
  ClockIcon, 
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const BookMovie = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState(1); // 1: Date/Show, 2: Seats, 3: Payment

  // Mock movie data
  const mockMovies = useMemo(() => ({
    1: {
      id: 1,
      title: 'Dune: Part Two',
      genre: 'Sci-Fi, Adventure',
      language: 'English',
      rating: 8.5,
      duration: 166,
      poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      price: 350
    },
    2: {
      id: 2,
      title: 'Godzilla x Kong: The New Empire',
      genre: 'Action, Adventure',
      language: 'English',
      rating: 6.4,
      duration: 115,
      poster: 'https://image.tmdb.org/t/p/w500/gmGK92wI1dwI5F1kmrvCRzKRGAJ.jpg',
      price: 300
    },
    3: {
      id: 3,
      title: 'Deadpool & Wolverine',
      genre: 'Action, Comedy',
      language: 'English',
      rating: 7.8,
      duration: 128,
      poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      price: 400
    }
  }), []);

  // Seed admin shows for demonstration if not present
  useEffect(() => {
    const existingShows = localStorage.getItem('adminShows');
    if (!existingShows) {
      seedAdminShows();
    }
  }, []);

  // Get shows from admin-managed data or fallback to defaults
  const getShowsForMovie = useCallback((movieId, date) => {
    // Validate date parameter
    if (!date) {
      console.warn('Invalid date provided to getShowsForMovie:', date);
      return [];
    }
    
    try {
      // Try to get admin-managed shows from localStorage
      const adminShows = JSON.parse(localStorage.getItem('adminShows') || '{}');
      const dateObj = new Date(date);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date provided to getShowsForMovie:', date);
        return [];
      }
      
      const dateKey = dateObj.toISOString().split('T')[0];
    
    if (adminShows[movieId] && adminShows[movieId][dateKey]) {
      return adminShows[movieId][dateKey];
    }
    
    // Fallback to default shows with improved structure
    return [
      { 
        id: 1, 
        time: '10:00 AM', 
        venue: 'CinemaFlix IMAX', 
        screen: 'Screen 1 - IMAX',
        availableSeats: 120, 
        totalSeats: 150,
        price: 350,
        format: 'IMAX 2D'
      },
      { 
        id: 2, 
        time: '01:00 PM', 
        venue: 'CinemaFlix IMAX', 
        screen: 'Screen 1 - IMAX',
        availableSeats: 85, 
        totalSeats: 150,
        price: 350,
        format: 'IMAX 2D'
      },
      { 
        id: 3, 
        time: '04:30 PM', 
        venue: 'CinemaFlix Premium', 
        screen: 'Screen 2 - Premium',
        availableSeats: 95, 
        totalSeats: 120,
        price: 450,
        format: 'Dolby Atmos'
      },
      { 
        id: 4, 
        time: '07:30 PM', 
        venue: 'CinemaFlix IMAX', 
        screen: 'Screen 1 - IMAX',
        availableSeats: 45, 
        totalSeats: 150,
        price: 400,
        format: 'IMAX 3D'
      },
      { 
        id: 5, 
        time: '10:30 PM', 
        venue: 'CinemaFlix Premium', 
        screen: 'Screen 3 - Premium',
        availableSeats: 78, 
        totalSeats: 120,
        price: 450,
        format: 'Dolby Atmos'
      }
    ];
    } catch (error) {
      console.error('Error in getShowsForMovie:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const selectedMovie = mockMovies[movieId];
    if (selectedMovie) {
      setMovie(selectedMovie);
      // Load shows for this movie and current date
      const movieShows = getShowsForMovie(movieId, selectedDate);
      setShows(movieShows);
    }
  }, [movieId, selectedDate, getShowsForMovie, mockMovies]);

  // Update shows when date changes
  useEffect(() => {
    if (movieId && selectedDate) {
      const movieShows = getShowsForMovie(movieId, selectedDate);
      setShows(movieShows);
    }
  }, [selectedDate, movieId, getShowsForMovie]);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < 6) { // Max 6 seats
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotal = () => {
    if (!selectedShow || selectedSeats.length === 0) return 0;
    return selectedSeats.length * selectedShow.price;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    
    try {
      // Simulate booking API call
      const bookingData = {
        movieId: movie.id,
        movieTitle: movie.title,
        showId: selectedShow.id,
        showTime: selectedShow.time,
        venue: selectedShow.venue,
        date: selectedDate,
        seats: selectedSeats,
        totalAmount: calculateTotal(),
        bookingDate: new Date().toISOString()
      };

      // Save to localStorage (simulate backend)
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const newBooking = {
        id: Date.now(),
        ...bookingData,
        status: 'confirmed'
      };
      existingBookings.push(newBooking);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));

      // Update dashboard stats
      const currentStats = JSON.parse(localStorage.getItem('userDashboardStats') || '{"totalBookings": 0, "upcomingShows": 0, "totalSpent": 0}');
      currentStats.totalBookings = existingBookings.length;
      currentStats.upcomingShows += 1;
      currentStats.totalSpent += calculateTotal();
      localStorage.setItem('userDashboardStats', JSON.stringify(currentStats));

      console.log('BookMovie - Updated stats:', currentStats);
      console.log('BookMovie - Total bookings count:', existingBookings.length);

      // Trigger storage events for real-time updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userBookings',
        newValue: JSON.stringify(existingBookings)
      }));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userDashboardStats', 
        newValue: JSON.stringify(currentStats)
      }));

      console.log('BookMovie - Storage events dispatched');

      // For same-tab updates, also trigger a custom event
      window.dispatchEvent(new CustomEvent('bookingUpdate', {
        detail: { bookings: existingBookings, stats: currentStats }
      }));

      // Show success and redirect
      alert('Booking confirmed successfully!');
      navigate('/user/dashboard');
      
    } catch (error) {
      alert('Booking failed. Please try again.');
      console.error('Booking error:', error);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Loading movie details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/movies')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Movies
            </button>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${bookingStep >= 1 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? 'bg-red-500 text-white' : 'bg-gray-600'}`}>1</div>
                <span>Select Show</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className={`flex items-center space-x-2 ${bookingStep >= 2 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? 'bg-red-500 text-white' : 'bg-gray-600'}`}>2</div>
                <span>Select Seats</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className={`flex items-center space-x-2 ${bookingStep >= 3 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? 'bg-red-500 text-white' : 'bg-gray-600'}`}>3</div>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-80 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
              <p className="text-gray-400 mb-4">{movie.genre}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-300">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{movie.duration} minutes</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-4 h-4 mr-2">🌐</span>
                  <span>{movie.language}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="w-4 h-4 mr-2">⭐</span>
                  <span>{movie.rating}/10 IMDb</span>
                </div>
              </div>

              {/* Booking Summary */}
              {selectedShow && selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Show Time:</span>
                      <span className="text-white">{selectedShow.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Venue:</span>
                      <span className="text-white">{selectedShow.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seats:</span>
                      <span className="text-white">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tickets:</span>
                      <span className="text-white">{selectedSeats.length} × ₹{selectedShow.price}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total:</span>
                        <span className="text-red-500">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Booking Area */}
          <div className="lg:col-span-2">
            {bookingStep === 1 && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Select Date & Show</h2>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Choose Date</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {generateDates().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                        className={`p-3 rounded-lg text-center transition-colors ${
                          selectedDate === date.toISOString().split('T')[0]
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-xs">{formatDate(date)}</div>
                        <div className="font-semibold">{date.getDate()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Selection */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Available Shows</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {shows.map((show) => (
                        <button
                          key={show.id}
                          onClick={() => {
                            setSelectedShow(show);
                            setBookingStep(2);
                          }}
                          className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-semibold text-white">{show.time}</span>
                            <span className="text-red-500 font-semibold">₹{show.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{show.venue}</span>
                            <span className="text-green-400">{show.availableSeats} seats available</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {bookingStep === 2 && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Select Seats</h2>
                  <button
                    onClick={() => setBookingStep(1)}
                    className="text-gray-400 hover:text-white"
                  >
                    ← Change Show
                  </button>
                </div>

                {/* Screen */}
                <div className="mb-8">
                  <div className="bg-gray-600 h-2 rounded-full mb-2"></div>
                  <p className="text-center text-gray-400 text-sm">SCREEN</p>
                </div>

                {/* Seat Legend */}
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
                    <span className="text-gray-400 text-sm">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-400 text-sm">Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-800 rounded mr-2"></div>
                    <span className="text-gray-400 text-sm">Booked</span>
                  </div>
                </div>

                {/* Seat Map */}
                <div className="mb-8">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                    <div key={row} className="flex justify-center items-center mb-2">
                      <span className="w-8 text-gray-400 text-sm font-semibold">{row}</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 12 }, (_, i) => {
                          const seatId = `${row}${i + 1}`;
                          const isBooked = Math.random() < 0.3;
                          const isSelected = selectedSeats.includes(seatId);
                          
                          return (
                            <button
                              key={seatId}
                              onClick={() => !isBooked && toggleSeat(seatId)}
                              disabled={isBooked}
                              className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                                isBooked
                                  ? 'bg-red-800 text-red-200 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                              }`}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Button */}
                {selectedSeats.length > 0 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setBookingStep(3)}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Continue to Payment (₹{calculateTotal()})
                    </button>
                  </div>
                )}
              </div>
            )}

            {bookingStep === 3 && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Payment</h2>
                  <button
                    onClick={() => setBookingStep(2)}
                    className="text-gray-400 hover:text-white"
                  >
                    ← Change Seats
                  </button>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Movie Tickets ({selectedSeats.length})</span>
                        <span className="text-white">₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Convenience Fee</span>
                        <span className="text-white">₹{Math.round(calculateTotal() * 0.02)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-3">
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">Total Amount</span>
                          <span className="text-red-500">₹{calculateTotal() + Math.round(calculateTotal() * 0.02)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
                  >
                    <CurrencyRupeeIcon className="h-6 w-6 mr-2" />
                    Pay ₹{calculateTotal() + Math.round(calculateTotal() * 0.02)}
                  </button>

                  <p className="text-gray-400 text-sm text-center mt-4">
                    By proceeding, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookMovie;