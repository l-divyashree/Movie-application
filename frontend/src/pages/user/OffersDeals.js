import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OffersDeals = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [expiredOffers, setExpiredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      // Mock offers data
      const mockOffers = [
        {
          id: 'OFFER001',
          title: 'Weekend Special',
          description: '20% off on all weekend shows',
          discount: 20,
          type: 'percentage',
          code: 'WEEKEND20',
          validUntil: '2025-12-31T23:59:59Z',
          minBooking: 15,
          maxDiscount: 50,
          applicable: 'Weekend shows only',
          status: 'active',
          image: '🎯',
          category: 'weekend'
        },
        {
          id: 'OFFER002',
          title: 'Student Discount',
          description: 'Special pricing for students',
          discount: 15,
          type: 'percentage',
          code: 'STUDENT15',
          validUntil: '2025-12-31T23:59:59Z',
          minBooking: 10,
          maxDiscount: 25,
          applicable: 'Valid student ID required',
          status: 'active',
          image: '🎓',
          category: 'student'
        },
        {
          id: 'OFFER003',
          title: 'Family Pack',
          description: 'Buy 3 get 1 free for family bookings',
          discount: 25,
          type: 'buy_get',
          code: 'FAMILY4',
          validUntil: '2025-06-30T23:59:59Z',
          minBooking: 30,
          maxDiscount: 100,
          applicable: 'Minimum 4 tickets required',
          status: 'active',
          image: '👨‍👩‍👧‍👦',
          category: 'family'
        },
        {
          id: 'OFFER004',
          title: 'First Time User',
          description: '30% off on your first booking',
          discount: 30,
          type: 'percentage',
          code: 'FIRST30',
          validUntil: '2025-12-31T23:59:59Z',
          minBooking: 20,
          maxDiscount: 75,
          applicable: 'New users only',
          status: 'active',
          image: '🆕',
          category: 'newuser'
        },
        {
          id: 'OFFER005',
          title: 'Valentine Special',
          description: 'Couple discount for romantic movies',
          discount: 25,
          type: 'percentage',
          code: 'VALENTINE25',
          validUntil: '2025-02-14T23:59:59Z',
          minBooking: 20,
          maxDiscount: 40,
          applicable: 'Romance genre movies only',
          status: 'expired',
          image: '💝',
          category: 'seasonal'
        },
        {
          id: 'OFFER006',
          title: 'Holiday Mega Sale',
          description: 'Up to 40% off during holidays',
          discount: 40,
          type: 'percentage',
          code: 'HOLIDAY40',
          validUntil: '2024-12-31T23:59:59Z',
          minBooking: 25,
          maxDiscount: 100,
          applicable: 'Holiday period only',
          status: 'expired',
          image: '🎉',
          category: 'seasonal'
        }
      ];

      setOffers(mockOffers);
      setActiveOffers(mockOffers.filter(offer => offer.status === 'active'));
      setExpiredOffers(mockOffers.filter(offer => offer.status === 'expired'));
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
    alert(`Promo code ${code} copied to clipboard!`);
  };

  const handleUseOffer = (offer) => {
    // Navigate to movies page with the promo code pre-applied
    navigate('/movies', { state: { promoCode: offer.code } });
  };

  const isOfferExpired = (validUntil) => {
    return new Date() > new Date(validUntil);
  };

  const OfferCard = ({ offer }) => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
      offer.status === 'expired' ? 'opacity-60' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{offer.image}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
              <p className="text-gray-600 text-sm">{offer.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {offer.type === 'percentage' ? `${offer.discount}% OFF` : 'Buy 3 Get 1'}
            </div>
            {offer.maxDiscount && (
              <div className="text-xs text-gray-500">Max ${offer.maxDiscount}</div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Minimum Booking:</span>
            <span className="font-medium">${offer.minBooking}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Valid Until:</span>
            <span className="font-medium">
              {new Date(offer.validUntil).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Applicable:</span>
            <span className="font-medium text-right">{offer.applicable}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase">Promo Code</span>
              <div className="font-mono font-bold text-lg text-blue-600">{offer.code}</div>
            </div>
            <button
              onClick={() => copyPromoCode(offer.code)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Copy Code
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          {offer.status === 'active' ? (
            <>
              <button
                onClick={() => handleUseOffer(offer)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Use Offer
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                Share
              </button>
            </>
          ) : (
            <div className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium text-center">
              Expired
            </div>
          )}
        </div>
      </div>
    </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Offers & Deals</h1>
              <p className="text-gray-600 mt-2">Save money on your movie bookings with exclusive offers</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-green-600 text-xl">🎁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Offers</p>
                <p className="text-2xl font-bold text-gray-900">{activeOffers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-blue-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Max Savings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...activeOffers.map(o => o.discount))}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-purple-600 text-xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeOffers.filter(offer => {
                    const daysUntilExpiry = Math.ceil((new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 7;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Offers ({activeOffers.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'expired'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expired Offers ({expiredOffers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'active' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
                {activeOffers.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🎁</div>
                    <p className="text-gray-500 text-lg">No active offers available</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon for new deals!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'expired' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
                {expiredOffers.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">⏰</div>
                    <p className="text-gray-500 text-lg">No expired offers</p>
                    <p className="text-gray-400 text-sm mt-2">All your offers are still active!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Never Miss a Deal!</h3>
          <p className="mb-6 opacity-90">Subscribe to get exclusive offers and early access to new deals</p>
          <div className="max-w-md mx-auto flex space-x-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersDeals;