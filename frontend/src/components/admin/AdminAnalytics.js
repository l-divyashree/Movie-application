import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Small helper to aggregate bookings by date and movie with filters
const aggregateBookings = (bookings, { from, to, movie, venue } = {}) => {
  const totals = { bookings: 0, revenue: 0, tickets: 0 };
  const byDate = {};
  const byMovie = {};

  const fromTs = from ? new Date(from).getTime() : null;
  const toTs = to ? new Date(to).getTime() : null;

  bookings.forEach(b => {
    const bTs = new Date(b.bookingDate || b.showDate || Date.now()).getTime();
    if ((fromTs && bTs < fromTs) || (toTs && bTs > toTs)) return;
    if (movie && b.movieTitle && !b.movieTitle.toLowerCase().includes(movie.toLowerCase())) return;
    if (venue && b.venueName && !b.venueName.toLowerCase().includes(venue.toLowerCase())) return;

    const date = (b.bookingDate || b.showDate || '').split('T')[0] || 'unknown';
    totals.bookings += 1;
    totals.revenue += Number(b.totalAmount || 0);
    const tickets = (b.seats || []).length || 0;
    totals.tickets += tickets;

    byDate[date] = (byDate[date] || 0) + tickets;
    const title = b.movieTitle || 'Unknown';
    byMovie[title] = (byMovie[title] || 0) + tickets;
  });

  return { totals, byDate, byMovie };
};

const SimpleBarChart = ({ data, color = 'rgba(220,38,38,0.9)' }) => {
  const entries = Object.entries(data).slice(0, 20);
  if (entries.length === 0) return <div className="text-sm text-gray-400">No data</div>;

  const labels = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Tickets',
        data: values,
        backgroundColor: color,
        borderRadius: 6,
        maxBarThickness: 48
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#D1D5DB' } },
      y: { grid: { color: '#0f1724' }, ticks: { color: '#D1D5DB', beginAtZero: true } }
    }
  };

  return (
    <div className="bg-gray-800 rounded p-4" style={{ height: 320 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

const AdminAnalytics = () => {
  const allBookings = useMemo(() => JSON.parse(localStorage.getItem('demoBookings') || '[]'), []);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [movieFilter, setMovieFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('');

  const { totals, byDate, byMovie } = useMemo(() => aggregateBookings(allBookings, { from, to, movie: movieFilter, venue: venueFilter }), [allBookings, from, to, movieFilter, venueFilter]);

  const topMovies = Object.entries(byMovie).sort((a,b) => b[1] - a[1]).slice(0,5);

  return (
    <div className="p-6 bg-transparent">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">Analytics</h2>
      <p className="text-gray-400 mb-6">Overview of recent activity (from local demo data)</p>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-400">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Movie</label>
            <input type="text" value={movieFilter} onChange={(e) => setMovieFilter(e.target.value)} placeholder="Filter by movie title" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Venue</label>
            <input type="text" value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)} placeholder="Filter by venue" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Bookings</div>
          <div className="text-2xl font-bold text-white">{totals.bookings}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Tickets</div>
          <div className="text-2xl font-bold text-white">{totals.tickets}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Revenue</div>
          <div className="text-2xl font-bold text-white">₹{totals.revenue}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-white mb-2">Tickets by Date</h3>
  <SimpleBarChart data={byDate} color={'rgba(220,38,38,0.9)'} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-white mb-2">Top Movies (by tickets)</h3>
        <ul className="space-y-2">
          {topMovies.length === 0 && <li className="text-sm text-gray-400">No movie data</li>}
          {topMovies.map(([title, count]) => (
            <li key={title} className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <div className="text-sm text-gray-200">{title}</div>
              <div className="text-sm font-semibold text-white">{count}</div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AdminAnalytics;
