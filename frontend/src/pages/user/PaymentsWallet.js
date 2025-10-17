import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import paymentService from '../../services/paymentService';

const PaymentsWallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wallet');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Load wallet data using service
      const [walletData, transactionData, paymentMethodData, giftCardData, refundData] = await Promise.all([
        paymentService.getWalletBalance(),
        paymentService.getTransactionHistory(),
        paymentService.getPaymentMethods(),
        paymentService.getGiftCards(),
        paymentService.getRefundHistory()
      ]);
      
      setWalletBalance(walletData.balance || 0);
      setTransactions(transactionData.transactions || []);
      setPaymentMethods(paymentMethodData.paymentMethods || []);
      setGiftCards(giftCardData.giftCards || []);
      setRefunds(refundData.refunds || []);

    } catch (error) {
      console.error('Error loading wallet data:', error);
      
      // Fallback to mock data if service fails
      setWalletBalance(125.75);
      setTransactions([]);
      setPaymentMethods([]);
      setGiftCards([]);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || !selectedPaymentMethod) return;

    try {
      setLoading(true);
      
      const topUpData = await paymentService.topUpWallet({
        amount: parseFloat(topUpAmount),
        paymentMethodId: selectedPaymentMethod
      });
      
      // Update local state with new transaction and balance
      setTransactions(prev => [topUpData.transaction, ...prev]);
      setWalletBalance(topUpData.newBalance || (walletBalance + parseFloat(topUpAmount)));
      setShowTopUpModal(false);
      setTopUpAmount('');
      setSelectedPaymentMethod('');
    } catch (error) {
      console.error('Error topping up wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (paymentData) => {
    try {
      setLoading(true);
      const newPaymentMethod = await paymentService.addPaymentMethod(paymentData);
      
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      setShowAddPaymentModal(false);
    } catch (error) {
      console.error('Error adding payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemGiftCard = async (giftCardCode) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find existing gift card or create new one
      const existingCard = giftCards.find(gc => gc.code === giftCardCode);
      
      if (existingCard && existingCard.balance > 0) {
        const redeemAmount = existingCard.balance;
        
        const newTransaction = {
          id: `TXN${Date.now()}`,
          type: 'credit',
          amount: redeemAmount,
          description: `Gift card redemption - ${giftCardCode}`,
          date: new Date().toISOString(),
          status: 'completed'
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setWalletBalance(prev => prev + redeemAmount);
        
        setGiftCards(prev => prev.map(gc => 
          gc.code === giftCardCode 
            ? { ...gc, balance: 0, status: 'used' }
            : gc
        ));
      }
      
      setShowGiftCardModal(false);
    } catch (error) {
      console.error('Error redeeming gift card:', error);
    }
  };

  const getTransactionIcon = (type, status) => {
    if (status === 'pending') return '⏳';
    return type === 'credit' ? '💰' : '💸';
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'credit_card': return '💳';
      case 'debit_card': return '💳';
      case 'upi': return '📱';
      case 'net_banking': return '🏦';
      case 'wallet': return '💰';
      default: return '💳';
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Payments & Wallet</h1>
              <p className="text-gray-600 mt-2">Manage your wallet, payments, and transactions</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90">Wallet Balance</h2>
              <p className="text-4xl font-bold mt-2">${walletBalance.toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-2">Available for bookings</p>
            </div>
            <div className="text-right">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all mb-3"
              >
                💰 Top Up Wallet
              </button>
              <div className="text-sm opacity-80">
                <p>Last transaction:</p>
                <p>{transactions[0] ? new Date(transactions[0].date).toLocaleDateString() : 'No transactions'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'wallet', label: 'Wallet Transactions', icon: '💰' },
                { id: 'payments', label: 'Payment Methods', icon: '💳' },
                { id: 'giftcards', label: 'Gift Cards', icon: '🎁' },
                { id: 'refunds', label: 'Refunds', icon: '↩️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Wallet Transactions Tab */}
            {activeTab === 'wallet' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Transaction History</h3>
                  <div className="flex space-x-3">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Transactions</option>
                      <option value="credit">Credits Only</option>
                      <option value="debit">Debits Only</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="30">Last 30 Days</option>
                      <option value="90">Last 3 Months</option>
                      <option value="365">Last Year</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getTransactionIcon(transaction.type, transaction.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            {transaction.bookingReference && (
                              <span>Booking: {transaction.bookingReference}</span>
                            )}
                            {transaction.paymentMethod && (
                              <span>Via: {transaction.paymentMethod}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Payment Methods</h3>
                  <button
                    onClick={() => setShowAddPaymentModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    + Add Payment Method
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getPaymentMethodIcon(method.type)}</span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {method.nickname || `${method.brand} ${method.type.replace('_', ' ')}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {method.type === 'upi' ? method.identifier : 
                               method.type === 'net_banking' ? `${method.bankName} ${method.accountNumber}` :
                               `****${method.last4}`}
                            </p>
                            {method.expiryMonth && method.expiryYear && (
                              <p className="text-xs text-gray-400">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {method.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit
                        </button>
                        {!method.isDefault && (
                          <>
                            <span className="text-gray-300">•</span>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                              Set as Default
                            </button>
                          </>
                        )}
                        <span className="text-gray-300">•</span>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gift Cards Tab */}
            {activeTab === 'giftcards' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Gift Cards & Vouchers</h3>
                  <button
                    onClick={() => setShowGiftCardModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🎁 Redeem Gift Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {giftCards.map((card) => (
                    <div key={card.id} className={`border rounded-lg p-6 ${card.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-gray-900">{card.code}</p>
                          <p className="text-sm text-gray-600">{card.source}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          card.status === 'active' ? 'bg-green-100 text-green-800' :
                          card.status === 'used' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {card.status}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Balance:</span>
                          <span className="font-semibold">${card.balance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Original Amount:</span>
                          <span>${card.originalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expires:</span>
                          <span>{new Date(card.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {card.status === 'active' && card.balance > 0 && (
                        <button
                          onClick={() => handleRedeemGiftCard(card.code)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Add to Wallet
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refunds Tab */}
            {activeTab === 'refunds' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Refund History</h3>

                <div className="space-y-4">
                  {refunds.map((refund) => (
                    <div key={refund.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-gray-900">{refund.movieTitle}</p>
                          <p className="text-sm text-gray-600">Booking: {refund.bookingReference}</p>
                          <p className="text-sm text-gray-500 mt-1">{refund.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${refund.amount.toFixed(2)}</p>
                          <p className={`text-sm px-2 py-1 rounded-full ${
                            refund.status === 'completed' ? 'bg-green-100 text-green-800' :
                            refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {refund.status}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Requested:</span> {new Date(refund.requestDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Processed:</span> {refund.processedDate ? new Date(refund.processedDate).toLocaleDateString() : 'Pending'}
                        </div>
                        <div>
                          <span className="font-medium">Method:</span> {refund.refundMethod === 'wallet' ? 'Wallet' : 'Original Payment Method'}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> <span className="capitalize">{refund.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Up Wallet</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.nickname || `${method.brand} ****${method.last4}`}>
                      {method.nickname || `${method.brand} ****${method.last4}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || !selectedPaymentMethod}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gift Card Redemption Modal */}
        {showGiftCardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Redeem Gift Card</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gift Card Code</label>
                <input
                  type="text"
                  placeholder="Enter gift card code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGiftCardModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRedeemGiftCard('SAMPLE-CODE')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsWallet;