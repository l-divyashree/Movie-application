import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    method: 'all'
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, payments]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      // Mock payment data
      const mockPayments = [
        {
          id: 'PAY001',
          bookingId: 'BK001',
          amount: 25.50,
          method: 'Credit Card',
          status: 'Completed',
          date: '2025-01-15T10:30:00Z',
          movieTitle: 'Avengers: Endgame',
          venue: 'PVR Cinemas',
          transactionId: 'TXN1234567890'
        },
        {
          id: 'PAY002',
          bookingId: 'BK002',
          amount: 18.00,
          method: 'PayPal',
          status: 'Completed',
          date: '2025-01-10T15:45:00Z',
          movieTitle: 'Spider-Man: No Way Home',
          venue: 'AMC Theater',
          transactionId: 'TXN0987654321'
        },
        {
          id: 'PAY003',
          bookingId: 'BK003',
          amount: 32.75,
          method: 'Debit Card',
          status: 'Pending',
          date: '2025-01-08T20:15:00Z',
          movieTitle: 'The Batman',
          venue: 'Cineplex',
          transactionId: 'TXN1122334455'
        },
        {
          id: 'PAY004',
          bookingId: 'BK004',
          amount: 22.25,
          method: 'Credit Card',
          status: 'Failed',
          date: '2025-01-05T18:20:00Z',
          movieTitle: 'Dune',
          venue: 'IMAX Theater',
          transactionId: 'TXN5566778899'
        }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    // Date filter
    const now = new Date();
    if (filters.dateRange !== 'all') {
      const daysBack = {
        '7days': 7,
        '30days': 30,
        '90days': 90
      }[filters.dateRange];
      
      if (daysBack) {
        const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
        filtered = filtered.filter(payment => new Date(payment.date) >= cutoffDate);
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(payment => payment.status.toLowerCase() === filters.status);
    }

    // Payment method filter
    if (filters.method !== 'all') {
      filtered = filtered.filter(payment => payment.method.toLowerCase().includes(filters.method));
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => 
    payment.status === 'Completed' ? sum + payment.amount : sum, 0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600 mt-2">View all your payment transactions and receipts</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-blue-600 text-xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Successful</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={filters.method}
                onChange={(e) => setFilters({...filters, method: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Methods</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie & Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">Booking: {payment.bookingId}</div>
                        <div className="text-xs text-gray-400">TXN: {payment.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.movieTitle}</div>
                        <div className="text-sm text-gray-500">{payment.venue}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${payment.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        View Receipt
                      </button>
                      {payment.status === 'Failed' && (
                        <button className="text-green-600 hover:text-green-800">
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💳</div>
              <p className="text-gray-500 text-lg">No payment transactions found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or make your first booking</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;