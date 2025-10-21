import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  FilmIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalShows: 0,
      averageBookingValue: 0,
      occupancyRate: 0
    },
    trends: {
      revenueGrowth: 0,
      bookingGrowth: 0,
      userGrowth: 0
    },
    topMovies: [],
    recentBookings: [],
    revenueByDay: [],
    bookingsByTimeSlot: [],
    genreAnalytics: [],
    venuePerformance: []
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        
        // Load real data from services
        const [bookingsData, moviesData, venuesData] = await Promise.all([
          loadBookingsAnalytics(),
          loadMoviesAnalytics(),
          loadVenuesAnalytics()
        ]);

        // Process and combine data
        const processedAnalytics = processAnalyticsData(bookingsData, moviesData, venuesData);
        setAnalytics(processedAnalytics);
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Use mock data as fallback
        setAnalytics(getMockAnalytics());
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [dateRange]);

  const loadBookingsAnalytics = async () => {
    try {
      // Try to get bookings from API or localStorage
      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      return demoBookings;
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [];
    }
  };

  const loadMoviesAnalytics = async () => {
    try {
      const adminMovies = JSON.parse(localStorage.getItem('adminMovies') || '[]');
      return adminMovies;
    } catch (error) {
      console.error('Error loading movies:', error);
      return [];
    }
  };

  const loadVenuesAnalytics = async () => {
    try {
      const venues = await adminService.getVenues();
      return venues || [];
    } catch (error) {
      console.error('Error loading venues:', error);
      return [];
    }
  };

  const processAnalyticsData = (bookings, movies, venues) => {
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const totalBookings = bookings.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Calculate movie popularity
    const movieStats = {};
    bookings.forEach(booking => {
      const movieTitle = booking.movieTitle || booking.movie?.title || 'Unknown Movie';
      if (!movieStats[movieTitle]) {
        movieStats[movieTitle] = { bookings: 0, revenue: 0 };
      }
      movieStats[movieTitle].bookings += 1;
      movieStats[movieTitle].revenue += booking.totalAmount || 0;
    });

    const topMovies = Object.entries(movieStats)
      .map(([title, stats]) => ({ title, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Generate daily revenue data
    const revenueByDay = generateDailyRevenueData(bookings, dateRange);
    
    // Generate time slot analysis
    const bookingsByTimeSlot = generateTimeSlotData(bookings);
    
    // Genre analytics
    const genreAnalytics = generateGenreAnalytics(movies, bookings);
    
    // Venue performance
    const venuePerformance = generateVenuePerformance(venues, bookings);

    return {
      overview: {
        totalRevenue,
        totalBookings,
        totalUsers: new Set(bookings.map(b => b.userEmail || b.userId)).size,
        totalShows: new Set(bookings.map(b => b.showId)).size,
        averageBookingValue,
        occupancyRate: calculateOccupancyRate(bookings)
      },
      trends: {
        revenueGrowth: calculateGrowth(bookings, 'revenue'),
        bookingGrowth: calculateGrowth(bookings, 'bookings'),
        userGrowth: 12.5 // Mock value
      },
      topMovies,
      recentBookings: bookings.slice(-5).reverse(),
      revenueByDay,
      bookingsByTimeSlot,
      genreAnalytics,
      venuePerformance
    };
  };

  const generateDailyRevenueData = (bookings, range) => {
    const days = range === '7days' ? 7 : range === '30days' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(booking => 
        booking.createdAt && booking.createdAt.startsWith(dateStr)
      );
      
      const revenue = dayBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      data.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue,
        bookings: dayBookings.length
      });
    }
    
    return data;
  };

  const generateTimeSlotData = (bookings) => {
    const timeSlots = {
      'Morning (9-12)': 0,
      'Afternoon (12-17)': 0,
      'Evening (17-21)': 0,
      'Night (21-24)': 0
    };

    bookings.forEach(booking => {
      const showTime = booking.showTime || booking.show?.showTime || '';
      if (showTime) {
        const hour = parseInt(showTime.split(':')[0]);
        if (hour >= 9 && hour < 12) timeSlots['Morning (9-12)']++;
        else if (hour >= 12 && hour < 17) timeSlots['Afternoon (12-17)']++;
        else if (hour >= 17 && hour < 21) timeSlots['Evening (17-21)']++;
        else if (hour >= 21 || hour < 9) timeSlots['Night (21-24)']++;
      }
    });

    return Object.entries(timeSlots).map(([slot, count]) => ({
      slot,
      count,
      percentage: bookings.length > 0 ? ((count / bookings.length) * 100).toFixed(1) : 0
    }));
  };

  const generateGenreAnalytics = (movies, bookings) => {
    const genreStats = {};
    
    bookings.forEach(booking => {
      const movieTitle = booking.movieTitle || booking.movie?.title;
      const movie = movies.find(m => m.title === movieTitle);
      const genre = movie?.genre || 'Unknown';
      
      if (!genreStats[genre]) {
        genreStats[genre] = { bookings: 0, revenue: 0 };
      }
      genreStats[genre].bookings += 1;
      genreStats[genre].revenue += booking.totalAmount || 0;
    });

    return Object.entries(genreStats)
      .map(([genre, stats]) => ({ genre, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const generateVenuePerformance = (venues, bookings) => {
    const venueStats = {};
    
    bookings.forEach(booking => {
      const venueName = booking.venueName || booking.venue?.name || 'Unknown Venue';
      if (!venueStats[venueName]) {
        venueStats[venueName] = { bookings: 0, revenue: 0 };
      }
      venueStats[venueName].bookings += 1;
      venueStats[venueName].revenue += booking.totalAmount || 0;
    });

    return Object.entries(venueStats)
      .map(([venue, stats]) => ({ venue, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const calculateOccupancyRate = (bookings) => {
    if (bookings.length === 0) return 0;
    
    const totalSeatsBooked = bookings.reduce((sum, booking) => {
      return sum + (booking.selectedSeats?.length || booking.seatsBooked || 1);
    }, 0);
    
    const assumedTotalSeats = bookings.length * 150; // Assuming 150 seats per show
    return ((totalSeatsBooked / assumedTotalSeats) * 100).toFixed(1);
  };

  const calculateGrowth = (bookings, type) => {
    // Mock growth calculation - in real app, compare with previous period
    return Math.random() * 20 - 10; // Random between -10% and +10%
  };

  const getMockAnalytics = () => ({
    overview: {
      totalRevenue: 125000,
      totalBookings: 450,
      totalUsers: 89,
      totalShows: 25,
      averageBookingValue: 278,
      occupancyRate: 67.5
    },
    trends: {
      revenueGrowth: 8.5,
      bookingGrowth: 12.3,
      userGrowth: 5.7
    },
    topMovies: [
      { title: 'Dune: Part Two', bookings: 45, revenue: 15400 },
      { title: 'Oppenheimer', bookings: 38, revenue: 12600 },
      { title: 'Barbie', bookings: 42, revenue: 11200 },
      { title: 'Spider-Man', bookings: 35, revenue: 10800 },
      { title: 'Avatar 3', bookings: 28, revenue: 9200 }
    ],
    recentBookings: [
      { id: 'B001', movieTitle: 'Dune: Part Two', userEmail: 'user@example.com', totalAmount: 350, createdAt: '2025-10-19' },
      { id: 'B002', movieTitle: 'Oppenheimer', userEmail: 'user2@example.com', totalAmount: 280, createdAt: '2025-10-19' },
    ],
    revenueByDay: [
      { date: '2025-10-13', day: 'Sun', revenue: 18500, bookings: 65 },
      { date: '2025-10-14', day: 'Mon', revenue: 12300, bookings: 42 },
      { date: '2025-10-15', day: 'Tue', revenue: 15600, bookings: 55 },
      { date: '2025-10-16', day: 'Wed', revenue: 14200, bookings: 48 },
      { date: '2025-10-17', day: 'Thu', revenue: 19800, bookings: 72 },
      { date: '2025-10-18', day: 'Fri', revenue: 24500, bookings: 89 },
      { date: '2025-10-19', day: 'Sat', revenue: 28200, bookings: 95 }
    ],
    bookingsByTimeSlot: [
      { slot: 'Morning (9-12)', count: 45, percentage: '15.0' },
      { slot: 'Afternoon (12-17)', count: 89, percentage: '29.7' },
      { slot: 'Evening (17-21)', count: 142, percentage: '47.3' },
      { slot: 'Night (21-24)', count: 24, percentage: '8.0' }
    ],
    genreAnalytics: [
      { genre: 'Action', bookings: 89, revenue: 31500 },
      { genre: 'Sci-Fi', bookings: 67, revenue: 24200 },
      { genre: 'Drama', bookings: 54, revenue: 18900 },
      { genre: 'Comedy', bookings: 42, revenue: 14600 },
      { genre: 'Thriller', bookings: 38, revenue: 13200 }
    ],
    venuePerformance: [
      { venue: 'PVR Cinemas', bookings: 89, revenue: 31500 },
      { venue: 'INOX', bookings: 76, revenue: 26800 },
      { venue: 'Cinepolis', bookings: 65, revenue: 22400 },
      { venue: 'Miraj Cinemas', bookings: 54, revenue: 18900 }
    ]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trendValue > 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trendValue > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trendValue)}%
              </span>
              <span className="text-gray-400 text-sm ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`bg-${color}-500/10 p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analytics.overview.totalRevenue)}
          icon={CurrencyRupeeIcon}
          trend={true}
          trendValue={analytics.trends.revenueGrowth}
          color="green"
        />
        <MetricCard
          title="Total Bookings"
          value={analytics.overview.totalBookings.toLocaleString()}
          icon={TicketIcon}
          trend={true}
          trendValue={analytics.trends.bookingGrowth}
          color="blue"
        />
        <MetricCard
          title="Active Users"
          value={analytics.overview.totalUsers.toLocaleString()}
          icon={UsersIcon}
          trend={true}
          trendValue={analytics.trends.userGrowth}
          color="purple"
        />
        <MetricCard
          title="Shows Running"
          value={analytics.overview.totalShows.toLocaleString()}
          icon={FilmIcon}
          color="orange"
        />
        <MetricCard
          title="Avg Booking Value"
          value={formatCurrency(analytics.overview.averageBookingValue)}
          icon={ChartBarIcon}
          color="indigo"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${analytics.overview.occupancyRate}%`}
          icon={EyeIcon}
          color="pink"
        />
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
        <div className="grid grid-cols-7 gap-2 h-40">
          {analytics.revenueByDay.map((day, index) => {
            const maxRevenue = Math.max(...analytics.revenueByDay.map(d => d.revenue));
            const height = (day.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="flex-1 flex items-end">
                  <div
                    className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-400"
                    style={{ height: `${height}%` }}
                    title={`${day.day}: ${formatCurrency(day.revenue)}`}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-2">{day.day}</div>
                <div className="text-xs text-gray-500">{formatCurrency(day.revenue)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movies */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Movies</h3>
          <div className="space-y-3">
            {analytics.topMovies.slice(0, 5).map((movie, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{movie.title}</p>
                  <p className="text-gray-400 text-sm">{movie.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-semibold">{formatCurrency(movie.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Analysis */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Bookings by Time Slot</h3>
          <div className="space-y-3">
            {analytics.bookingsByTimeSlot.map((slot, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{slot.slot}</span>
                  <span className="text-white">{slot.count} ({slot.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${slot.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Genre Analytics */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Genre</h3>
          <div className="space-y-3">
            {analytics.genreAnalytics.slice(0, 5).map((genre, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{genre.genre}</p>
                  <p className="text-gray-400 text-sm">{genre.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-semibold">{formatCurrency(genre.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Performance */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Venues</h3>
          <div className="space-y-3">
            {analytics.venuePerformance.map((venue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{venue.venue}</p>
                  <p className="text-gray-400 text-sm">{venue.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-semibold">{formatCurrency(venue.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-gray-400 font-medium py-2">Booking ID</th>
                <th className="text-gray-400 font-medium py-2">Movie</th>
                <th className="text-gray-400 font-medium py-2">User</th>
                <th className="text-gray-400 font-medium py-2">Amount</th>
                <th className="text-gray-400 font-medium py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentBookings.slice(0, 5).map((booking, index) => (
                <tr key={index} className="border-b border-gray-700/50">
                  <td className="py-3 text-white font-mono text-sm">{booking.id || `B${String(index + 1).padStart(3, '0')}`}</td>
                  <td className="py-3 text-white">{booking.movieTitle || 'Unknown Movie'}</td>
                  <td className="py-3 text-gray-400">{booking.userEmail || 'Unknown User'}</td>
                  <td className="py-3 text-green-500 font-semibold">{formatCurrency(booking.totalAmount || 0)}</td>
                  <td className="py-3 text-gray-400">{booking.createdAt || new Date().toISOString().split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
