import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get booking data from navigation state
  const { booking, paymentMethod } = location.state || {};
  
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">No booking data found</h2>
          <p className="text-gray-600 mt-2">Please complete a booking first</p>
          <button 
            onClick={() => navigate('/movies')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }
  
  const generateQRCode = (bookingId) => {
    // In a real app, this would generate an actual QR code
    // For demo purposes, we'll use a placeholder QR code image
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking-${bookingId}`;
  };
  
  const downloadTicket = () => {
    // In a real app, this would generate a PDF ticket
    alert('Ticket download feature would be implemented here');
  };
  
  const shareBooking = () => {
    // In a real app, this would use Web Share API or social sharing
    const shareText = `I just booked tickets for ${booking.movieTitle} at ${booking.venueName}! 🎬`;
    if (navigator.share) {
      navigator.share({
        title: 'Movie Booking Confirmation',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('Booking details copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Your tickets have been successfully booked</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* E-Ticket */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{booking.movieTitle}</h2>
                    <p className="text-purple-100">{booking.venueName}</p>
                    <p className="text-purple-100">{booking.venueAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-100">Booking ID</p>
                    <p className="font-mono text-lg">{booking.bookingId}</p>
                  </div>
                </div>
              </div>
              
              {/* Ticket Body */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Show Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Show Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{booking.showDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{booking.showTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Screen:</span>
                        <span className="font-medium">{booking.screenName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-medium text-blue-600">{booking.seatNumbers.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tickets:</span>
                        <span className="font-medium">{booking.totalTickets}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ticket Price:</span>
                        <span>₹{booking.ticketPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Convenience Fee:</span>
                        <span>₹{booking.convenienceFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes:</span>
                        <span>₹{booking.taxes}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total Paid:</span>
                        <span className="text-green-600">₹{booking.totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="capitalize">{paymentMethod?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">{booking.transactionId}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customer Details */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{booking.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{booking.customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{booking.customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="ml-2 font-medium">{booking.bookingDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ticket Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={downloadTicket}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Download Ticket
                  </button>
                  
                  <button
                    onClick={shareBooking}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                    Share
                  </button>
                  
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    View All Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* QR Code & Actions */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Entry QR Code</h3>
              <div className="flex justify-center mb-4">
                <img 
                  src={generateQRCode(booking.bookingId)} 
                  alt="Booking QR Code"
                  className="border rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600">
                Show this QR code at the cinema entrance
              </p>
            </div>
            
            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 30 minutes before show time</li>
                <li>• Carry a valid ID for verification</li>
                <li>• No outside food or beverages allowed</li>
                <li>• Mobile phones must be on silent mode</li>
                <li>• Entry may be denied after show starts</li>
              </ul>
            </div>
            
            {/* Customer Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p>Contact Customer Support:</p>
                <p className="font-medium">📞 1800-123-4567</p>
                <p className="font-medium">✉️ support@moviebooking.com</p>
                <p className="text-xs mt-2">Available 24/7 for assistance</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/movies')}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Book Another Movie
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;