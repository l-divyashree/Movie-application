import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UserIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { show, movie, selectedSeats, totalAmount } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue;
  };

  const handleCardNumberChange = (e) => {
    const formattedNumber = formatCardNumber(e.target.value);
    if (formattedNumber.replace(/\s/g, '').length <= 16) {
      handleInputChange('number', formattedNumber);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    handleInputChange('expiry', value);
  };

  const validateBookingData = () => {
    if (!show || !selectedSeats || selectedSeats.length === 0) {
      setError('Invalid booking data. Please start over.');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      const { number, expiry, cvv, name } = cardDetails;
      if (!number || !expiry || !cvv || !name) {
        setError('Please fill in all card details');
        return false;
      }
      if (number.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (cvv.length !== 3) {
        setError('Please enter a valid 3-digit CVV');
        return false;
      }
    }
    return true;
  };

  const handleBookingConfirm = async () => {
    if (!validateBookingData() || !validatePayment()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking
      const bookingRequest = {
        showId: show.id,
        seatIds: selectedSeats.map(seat => seat.id),
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        paymentStatus: 'COMPLETED'
      };

      const booking = await bookingService.createBooking(bookingRequest);
      
      setBookingData(booking);
      setBookingComplete(true);
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !selectedSeats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Invalid booking data</p>
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

  // Success Screen
  if (bookingComplete && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">Your tickets have been booked successfully</p>
            
            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Booking ID:</span>
                  <p className="text-gray-900">{bookingData.id}</p>
                </div>
                <div>
                  <span className="font-medium">Amount Paid:</span>
                  <p className="text-gray-900 flex items-center">
                    <CurrencyRupeeIcon className="h-4 w-4" />
                    {totalAmount}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Movie:</span>
                  <p className="text-gray-900">{movie?.title}</p>
                </div>
                <div>
                  <span className="font-medium">Show Date:</span>
                  <p className="text-gray-900">{new Date(show.showDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Show Time:</span>
                  <p className="text-gray-900">{show.showTime}</p>
                </div>
                <div>
                  <span className="font-medium">Cinema:</span>
                  <p className="text-gray-900">{show.venue?.name}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Seats:</span>
                  <p className="text-gray-900">
                    {selectedSeats.map(seat => seat.seatNumber).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/movies')}
                className="w-full text-gray-600 py-2 hover:text-gray-800"
              >
                Book More Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-800 mb-2"
              >
                ← Back to Seat Selection
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Confirm Booking</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TicketIcon className="h-5 w-5 mr-2" />
              Booking Summary
            </h2>

            {/* Movie Info */}
            <div className="mb-6">
              <div className="flex items-start space-x-4">
                {movie?.posterUrl && (
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-16 h-22 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{movie?.title}</h3>
                  <p className="text-sm text-gray-600">
                    {movie?.genre} • {movie?.language} • {movie?.duration} mins
                  </p>
                </div>
              </div>
            </div>

            {/* Show Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>{show.venue?.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{new Date(show.showDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>{show.showTime}</span>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">
                Selected Seats ({selectedSeats.length})
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between">
                    <span>{seat.seatNumber} ({seat.seatType})</span>
                    <span className="flex items-center">
                      <CurrencyRupeeIcon className="h-4 w-4" />
                      {seat.seatType === 'PREMIUM' ? (show?.price || 250) + 100 :
                       seat.seatType === 'ECONOMY' ? (show?.price || 250) - 50 :
                       show?.price || 250}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-green-600 flex items-center">
                  <CurrencyRupeeIcon className="h-5 w-5" />
                  {totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Payment Details
            </h2>

            {/* User Info */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Booking for
              </h3>
              <p className="text-gray-600">{user?.name || user?.email}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>UPI</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Digital Wallet</span>
                </label>
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter cardholder name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          handleInputChange('cvv', value);
                        }
                      }}
                      placeholder="123"
                      maxLength="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other Payment Methods */}
            {paymentMethod === 'upi' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-blue-800">UPI payment will be processed after confirmation</p>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg text-center">
                <p className="text-green-800">Wallet payment will be processed after confirmation</p>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleBookingConfirm}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing Payment...' : `Pay ₹${totalAmount} & Confirm Booking`}
            </button>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Your payment information is secured with SSL encryption. 
              By proceeding, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;