import React, { useState, useEffect } from 'react';

const TestBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  const loadData = () => {
    console.log('TestBookings - Loading data...');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
    
    console.log('TestBookings - Current User:', currentUser);
    console.log('TestBookings - All Demo Bookings:', demoBookings);
    
    const userBookings = demoBookings.filter(booking => booking.userId === currentUser.id);
    console.log('TestBookings - User Bookings:', userBookings);
    
    setUser(currentUser);
    setBookings(userBookings);
  };

  useEffect(() => {
    loadData();
    
    const handleBookingCreated = () => {
      console.log('TestBookings - Booking created event received');
      loadData();
    };
    
    window.addEventListener('bookingCreated', handleBookingCreated);
    
    return () => {
      window.removeEventListener('bookingCreated', handleBookingCreated);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Bookings Page</h1>
      
      <button 
        onClick={loadData}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Reload Data
      </button>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Current User:</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">User Bookings ({bookings.length}):</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(bookings, null, 2)}
        </pre>
      </div>
      
      {bookings.length === 0 ? (
        <p className="text-red-500">No bookings found for current user</p>
      ) : (
        <div className="space-y-2">
          {bookings.map(booking => (
            <div key={booking.id} className="border p-4 rounded">
              <h3 className="font-semibold">{booking.movieTitle}</h3>
              <p>Venue: {booking.venueName}</p>
              <p>Total: ₹{booking.totalAmount}</p>
              <p>Date: {booking.showDate} at {booking.showTime}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestBookings;