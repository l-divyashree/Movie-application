import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get booking data from navigation state
  const { bookingSummary } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    upiId: '',
    walletType: 'paytm',
    bankName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Redirect if no booking summary
    if (!bookingSummary) {
      navigate('/movies');
      return;
    }
  }, [bookingSummary, navigate]);
  
  const handleFormChange = (field, value) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit_card') {
      if (!paymentForm.cardNumber || paymentForm.cardNumber.length < 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!paymentForm.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      if (!paymentForm.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Please enter cardholder name';
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentForm.upiId || !paymentForm.upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    } else if (paymentMethod === 'net_banking') {
      if (!paymentForm.bankName) {
        newErrors.bankName = 'Please select a bank';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePayment = async () => {
    if (!validatePayment()) return;
    
    setProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      const paymentData = {
        bookingSummaryId: bookingSummary.id,
        paymentMethod: paymentMethod,
        amount: bookingSummary.totalAmount,
        paymentDetails: {
          ...paymentForm,
          // Don't send sensitive data in real implementation
          cardNumber: paymentMethod === 'credit_card' ? paymentForm.cardNumber.slice(-4) : null
        }
      };
      
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Save booking to localStorage for dashboard updates
        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        existingBookings.push(result);
        localStorage.setItem('userBookings', JSON.stringify(existingBookings));
        
        // Update dashboard statistics
        const stats = JSON.parse(localStorage.getItem('userDashboardStats') || '{}');
        stats.totalBookings = (stats.totalBookings || 0) + 1;
        stats.totalSpent = (stats.totalSpent || 0) + (result.totalAmount || 0);
        stats.upcomingShows = (stats.upcomingShows || 0) + 1;
        localStorage.setItem('userDashboardStats', JSON.stringify(stats));
        
        // Navigate directly to user dashboard
        navigate('/user/dashboard');
      } else {
        const error = await response.json();
        setErrors({ general: error.message || 'Payment failed. Please try again.' });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ general: 'Payment failed. Please check your connection and try again.' });
    } finally {
      setProcessing(false);
    }
  };
  
  if (!bookingSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">No booking data found</h2>
          <p className="text-gray-600 mt-2">Please select seats first</p>
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure and fast payment processing</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Movie:</span>
                  <span className="font-medium">{bookingSummary.movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium">{bookingSummary.venueName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Show Time:</span>
                  <span className="font-medium">{bookingSummary.showTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{bookingSummary.showDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{bookingSummary.seatNumbers.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="font-medium">{bookingSummary.seatNumbers.length}</span>
                </div>
                
                <hr className="my-4"/>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ticket Price:</span>
                    <span>₹{bookingSummary.ticketPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience Fee:</span>
                    <span>₹{bookingSummary.convenienceFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{bookingSummary.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">Choose Payment Method</h3>
              
              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { id: 'credit_card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'upi', label: 'UPI', icon: '📱' },
                  { id: 'wallet', label: 'Wallet', icon: '👛' },
                  { id: 'net_banking', label: 'Net Banking', icon: '🏦' }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="text-sm font-medium">{method.label}</div>
                  </button>
                ))}
              </div>
              
              {/* Payment Forms */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleFormChange('cardNumber', e.target.value.replace(/\s/g, '').slice(0, 16))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          handleFormChange('expiryDate', value);
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handleFormChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentForm.cardHolderName}
                      onChange={(e) => handleFormChange('cardHolderName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardHolderName && <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>}
                  </div>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="username@paytm"
                    value={paymentForm.upiId}
                    onChange={(e) => handleFormChange('upiId', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.upiId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                </div>
              )}
              
              {paymentMethod === 'wallet' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Wallet
                  </label>
                  <select
                    value={paymentForm.walletType}
                    onChange={(e) => handleFormChange('walletType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="paytm">Paytm Wallet</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="googlepay">Google Pay</option>
                    <option value="amazonpay">Amazon Pay</option>
                  </select>
                </div>
              )}
              
              {paymentMethod === 'net_banking' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank
                  </label>
                  <select
                    value={paymentForm.bankName}
                    onChange={(e) => handleFormChange('bankName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.bankName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                  {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                </div>
              )}
              
              {/* Error Message */}
              {errors.general && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}
              
              {/* Payment Button */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Seats
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? 'Processing...' : `Pay ₹${bookingSummary.totalAmount}`}
                </button>
              </div>
              
              {/* Security Note */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-blue-500 mr-3">🔒</div>
                  <div>
                    <p className="text-blue-800 text-sm font-medium">Secure Payment</p>
                    <p className="text-blue-600 text-xs">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;