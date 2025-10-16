import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Get show and movie data from navigation state
  const { show, movie } = location.state || {};
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockingSeats, setBlockingSeats] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const loadSeats = async () => {
      try {
        setLoading(true);
        const seatsData = await bookingService.getSeatsByShow(showId);
        setSeats(seatsData);
      } catch (err) {
        console.error('Error loading seats:', err);
        setError('Failed to load seat layout');
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      loadSeats();
    }
  }, [showId, isAuthenticated, navigate, location.pathname]);

  // Auto-block selected seats when selection changes
  useEffect(() => {
    let blockingTimeout;
    
    if (selectedSeats.length > 0) {
      setBlockingSeats(true);
      
      // Block seats after 500ms delay to avoid too many API calls
      blockingTimeout = setTimeout(async () => {
        try {
          await bookingService.blockSeats(selectedSeats.map(seat => seat.id), showId);
          setBlockedSeats(prev => [...prev, ...selectedSeats.map(seat => seat.id)]);
        } catch (err) {
          console.error('Error blocking seats:', err);
        } finally {
          setBlockingSeats(false);
        }
      }, 500);
    }

    return () => {
      if (blockingTimeout) {
        clearTimeout(blockingTimeout);
      }
    };
  }, [selectedSeats, showId]);

  const handleSeatClick = (seat) => {
    // Can't select booked or blocked seats (unless blocked by current user)
    if (seat.isBooked || (seat.isBlocked && !blockedSeats.includes(seat.id))) {
      return;
    }

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        // Unselect seat
        return prev.filter(s => s.id !== seat.id);
      } else {
        // Select seat (max 10 seats)
        if (prev.length >= 10) {
          alert('You can select maximum 10 seats at a time');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const getSeatStatusClass = (seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (seat.isBooked) {
      return 'bg-red-500 cursor-not-allowed';
    }
    
    if (seat.isBlocked && !blockedSeats.includes(seat.id)) {
      return 'bg-orange-400 cursor-not-allowed';
    }
    
    if (isSelected) {
      return 'bg-green-500 text-white';
    }
    
    // Available seat - color by type
    switch (seat.seatType) {
      case 'PREMIUM':
        return 'bg-purple-200 hover:bg-purple-300 border-purple-400';
      case 'STANDARD':
        return 'bg-blue-200 hover:bg-blue-300 border-blue-400';
      case 'ECONOMY':
        return 'bg-gray-200 hover:bg-gray-300 border-gray-400';
      default:
        return 'bg-gray-200 hover:bg-gray-300 border-gray-400';
    }
  };

  const getSeatPrice = (seatType) => {
    switch (seatType) {
      case 'PREMIUM': return (show?.price || 250) + 100;
      case 'STANDARD': return show?.price || 250;
      case 'ECONOMY': return (show?.price || 250) - 50;
      default: return show?.price || 250;
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + getSeatPrice(seat.seatType);
    }, 0);
  };

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    navigate('/booking/confirm', {
      state: {
        show,
        movie,
        selectedSeats,
        totalAmount: calculateTotal(),
        from: location.pathname
      }
    });
  };

  // Group seats by row
  const groupSeatsByRow = (seats) => {
    const grouped = {};
    seats.forEach(seat => {
      const row = seat.rowNumber || seat.seatNumber?.charAt(0) || 'A';
      if (!grouped[row]) {
        grouped[row] = [];
      }
      grouped[row].push(seat);
    });
    
    // Sort seats within each row
    Object.keys(grouped).forEach(row => {
      grouped[row].sort((a, b) => {
        const aNum = parseInt(a.seatNumber?.slice(1) || a.columnNumber || 1);
        const bNum = parseInt(b.seatNumber?.slice(1) || b.columnNumber || 1);
        return aNum - bNum;
      });
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seat layout...</p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Show data not available'}</p>
          <button 
            onClick={() => navigate('/movies')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const groupedSeats = groupSeatsByRow(seats);
  const rows = Object.keys(groupedSeats).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-800 mb-2"
              >
                ← Back to Shows
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Select Seats</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center">
                  <span className="font-medium">{movie?.title}</span>
                </span>
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {show.venue?.name}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(show.showDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {show.showTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Screen */}
              <div className="text-center mb-8">
                <div className="bg-gray-800 text-white py-2 px-8 rounded-full inline-block mb-2">
                  SCREEN
                </div>
                <p className="text-sm text-gray-500">All eyes this way please!</p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center space-x-6 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span>Blocked</span>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="max-w-4xl mx-auto">
                {rows.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No seats available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rows.map(row => (
                      <div key={row} className="flex items-center justify-center space-x-1">
                        {/* Row Label */}
                        <div className="w-8 text-center font-medium text-gray-700">
                          {row}
                        </div>
                        
                        {/* Seats */}
                        <div className="flex space-x-1">
                          {groupedSeats[row].map((seat, index) => {
                            // Add gap in the middle for aisle
                            const showAisle = index === Math.floor(groupedSeats[row].length / 2);
                            
                            return (
                              <React.Fragment key={seat.id}>
                                {showAisle && <div className="w-4"></div>}
                                <button
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={seat.isBooked || (seat.isBlocked && !blockedSeats.includes(seat.id))}
                                  className={`
                                    w-8 h-8 rounded border text-xs font-medium transition-all duration-200
                                    ${getSeatStatusClass(seat)}
                                    ${seat.isBooked || (seat.isBlocked && !blockedSeats.includes(seat.id)) 
                                      ? '' : 'cursor-pointer transform hover:scale-105'
                                    }
                                  `}
                                  title={`${seat.seatNumber} - ${seat.seatType} - ₹${getSeatPrice(seat.seatType)}`}
                                >
                                  {seat.seatNumber?.slice(1) || seat.columnNumber}
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seat Type Pricing */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800">Premium</h4>
                  <p className="text-sm text-purple-600">₹{getSeatPrice('PREMIUM')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800">Standard</h4>
                  <p className="text-sm text-blue-600">₹{getSeatPrice('STANDARD')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800">Economy</h4>
                  <p className="text-sm text-gray-600">₹{getSeatPrice('ECONOMY')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedSeats.length === 0 ? (
                <div className="text-center py-6">
                  <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Select seats to continue</p>
                </div>
              ) : (
                <>
                  {/* Selected Seats */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Selected Seats ({selectedSeats.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between text-sm">
                          <span>{seat.seatNumber} ({seat.seatType})</span>
                          <span>₹{getSeatPrice(seat.seatType)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-xl font-bold text-green-600 flex items-center">
                        <CurrencyRupeeIcon className="h-5 w-5" />
                        {calculateTotal()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleProceedToBooking}
                      disabled={blockingSeats || selectedSeats.length === 0}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {blockingSeats ? 'Booking Seats...' : 'Proceed to Payment'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedSeats([]);
                        setBlockedSeats([]);
                      }}
                      className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
                    >
                      Clear Selection
                    </button>
                  </div>
                </>
              )}

              {/* Important Notes */}
              <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Selected seats are temporarily blocked for you. 
                  Complete booking within 10 minutes or seats will be released.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;