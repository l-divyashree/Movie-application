import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Reviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchReviews();
    fetchPendingReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Mock user reviews
      const mockReviews = [
        {
          id: 'REV001',
          movieId: 'MOV001',
          movieTitle: 'Spider-Man: No Way Home',
          moviePoster: '/placeholder-movie.jpg',
          rating: 4.5,
          comment: 'Amazing movie! The multiverse concept was executed perfectly. Tom Holland, Tobey Maguire, and Andrew Garfield together was a dream come true.',
          date: '2025-01-15T10:30:00Z',
          helpful: 12,
          reported: false,
          verified: true
        },
        {
          id: 'REV002',
          movieId: 'MOV002',
          movieTitle: 'The Batman',
          moviePoster: '/placeholder-movie.jpg',
          rating: 4.0,
          comment: 'Robert Pattinson brings a darker, more detective-focused Batman. Great cinematography and atmosphere.',
          date: '2025-01-10T15:45:00Z',
          helpful: 8,
          reported: false,
          verified: true
        },
        {
          id: 'REV003',
          movieId: 'MOV003',
          movieTitle: 'Dune: Part One',
          moviePoster: '/placeholder-movie.jpg',
          rating: 5.0,
          comment: 'Visually stunning masterpiece. Denis Villeneuve has created something truly spectacular. Cannot wait for Part Two!',
          date: '2025-01-08T20:15:00Z',
          helpful: 25,
          reported: false,
          verified: true
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      // Mock pending reviews (movies watched but not reviewed)
      const mockPending = [
        {
          id: 'PEND001',
          movieId: 'MOV004',
          movieTitle: 'Avengers: Endgame',
          moviePoster: '/placeholder-movie.jpg',
          watchedDate: '2025-01-05T18:20:00Z',
          venue: 'PVR Cinemas'
        },
        {
          id: 'PEND002',
          movieId: 'MOV005',
          movieTitle: 'Inception',
          moviePoster: '/placeholder-movie.jpg',
          watchedDate: '2025-01-03T14:30:00Z',
          venue: 'AMC Theater'
        }
      ];
      setPendingReviews(mockPending);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!selectedMovie || newReview.rating === 0) return;

    try {
      const review = {
        id: 'REV' + String(Date.now()).slice(-3),
        movieId: selectedMovie.movieId,
        movieTitle: selectedMovie.movieTitle,
        moviePoster: selectedMovie.moviePoster,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
        helpful: 0,
        reported: false,
        verified: true
      };

      setReviews(prev => [review, ...prev]);
      setPendingReviews(prev => prev.filter(p => p.id !== selectedMovie.id));
      setSelectedMovie(null);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const StarRating = ({ rating, onRatingChange, readOnly = true }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            } ${!readOnly ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-24 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 text-xs">IMG</span>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{review.movieTitle}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-600">
                  {review.rating}/5 stars
                </span>
                {review.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteReview(review.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3">{review.comment}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Reviewed on {new Date(review.date).toLocaleDateString()}</span>
            <div className="flex items-center space-x-4">
              <span>{review.helpful} people found this helpful</span>
              <button className="text-blue-600 hover:text-blue-800">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PendingReviewCard = ({ pending }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-24 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 text-xs">IMG</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{pending.movieTitle}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Watched at {pending.venue} on {new Date(pending.watchedDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Share your experience with other movie lovers!
          </p>
          <button
            onClick={() => setSelectedMovie(pending)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Write Review
          </button>
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
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-2">Share your movie experiences and read what others think</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-blue-600 text-xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-yellow-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-green-600 text-xl">👍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Helpful Votes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.reduce((sum, review) => sum + review.helpful, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-orange-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReviews.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('my-reviews')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'my-reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Reviews ({pendingReviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my-reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">⭐</div>
                    <p className="text-gray-500 text-lg">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-2">Watch some movies and share your thoughts!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-6">
                {pendingReviews.length > 0 ? (
                  pendingReviews.map((pending) => (
                    <PendingReviewCard key={pending.id} pending={pending} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">✅</div>
                    <p className="text-gray-500 text-lg">All caught up!</p>
                    <p className="text-gray-400 text-sm mt-2">You've reviewed all your watched movies</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review "{selectedMovie.movieTitle}"
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating 
                  rating={newReview.rating} 
                  onRatingChange={(rating) => setNewReview({...newReview, rating})}
                  readOnly={false}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Share your thoughts about this movie..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={newReview.rating === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;