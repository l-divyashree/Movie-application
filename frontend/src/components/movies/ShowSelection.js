import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';

const ShowSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [venues, setVenues] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  
  // Get next 7 days for date selection
  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const formatDisplayDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load movie details (using existing movieService)
        const movieResponse = await fetch(`http://localhost:8080/api/movies/${movieId}`);
        if (movieResponse.ok) {
          const movieData = await movieResponse.json();
          setMovie(movieData);
        }
        
        // Load cities and venues
        const [citiesData, venuesData] = await Promise.all([
          bookingService.getCities().catch(() => []),
          bookingService.getVenues().catch(() => [])
        ]);
        
        setCities(citiesData);
        setVenues(venuesData);
        
        // Set default date to today
        setSelectedDate(formatDate(new Date()));
        
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load movie data');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadInitialData();
    }
  }, [movieId]);

  useEffect(() => {
    const loadShows = async () => {
      if (!movieId) return;
      
      try {
        let showsData;
        
        if (selectedCity && selectedDate) {
          showsData = await bookingService.getShowsByDateAndCity(selectedDate, selectedCity);
        } else if (selectedCity) {
          showsData = await bookingService.getShowsByMovieAndCity(movieId, selectedCity);
        } else {
          showsData = await bookingService.getShowsByMovie(movieId);
        }
        
        // Filter shows if needed
        let filteredShows = showsData.content || showsData;
        
        if (selectedVenue) {
          filteredShows = filteredShows.filter(show => show.venue?.id === parseInt(selectedVenue));
        }
        
        if (selectedDate && !selectedCity) {
          filteredShows = filteredShows.filter(show => show.showDate === selectedDate);
        }
        
        setShows(filteredShows);
      } catch (err) {
        console.error('Error loading shows:', err);
        setShows([]);
      }
    };

    loadShows();
  }, [movieId, selectedCity, selectedDate, selectedVenue]);

  const handleShowSelect = (show) => {
    // Navigate to seat selection page
    navigate(`/booking/seats/${show.id}`, { 
      state: { 
        show, 
        movie,
        from: `/movies/${movieId}/shows`
      }
    });
  };

  const groupShowsByVenueAndDate = (shows) => {
    const grouped = {};
    
    shows.forEach(show => {
      const venueKey = show.venue?.name || 'Unknown Venue';
      const dateKey = show.showDate || 'Unknown Date';
      
      if (!grouped[venueKey]) {
        grouped[venueKey] = {};
      }
      
      if (!grouped[venueKey][dateKey]) {
        grouped[venueKey][dateKey] = [];
      }
      
      grouped[venueKey][dateKey].push(show);
    });
    
    return grouped;
  };

  const filteredVenues = selectedCity 
    ? venues.filter(venue => venue.city?.id === parseInt(selectedCity))
    : venues;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
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

  const groupedShows = groupShowsByVenueAndDate(shows);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/movies')}
                className="text-blue-600 hover:text-blue-800 mb-2"
              >
                ← Back to Movies
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {movie?.title || 'Select Show Times'}
              </h1>
              {movie && (
                <p className="text-gray-600 mt-1">
                  {movie.genre} • {movie.language} • {movie.duration} mins
                </p>
              )}
            </div>
            {movie?.posterUrl && (
              <div className="hidden md:block">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="grid grid-cols-2 gap-2">
                {getNext7Days().slice(0, 4).map((date) => (
                  <button
                    key={formatDate(date)}
                    onClick={() => setSelectedDate(formatDate(date))}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedDate === formatDate(date)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {formatDisplayDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedVenue(''); // Reset venue when city changes
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cinema
              </label>
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCity}
              >
                <option value="">All Cinemas</option>
                {filteredVenues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCity('');
                  setSelectedVenue('');
                  setSelectedDate(formatDate(new Date()));
                }}
                className="w-full p-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Shows Listing */}
        {shows.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shows Available</h3>
            <p className="text-gray-600">
              No shows found for the selected filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedShows).map(([venueName, dateGroups]) => (
              <div key={venueName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                    {venueName}
                  </h3>
                </div>
                
                <div className="p-6">
                  {Object.entries(dateGroups).map(([date, dateShows]) => (
                    <div key={date} className="mb-6 last:mb-0">
                      <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {dateShows.map((show) => (
                          <button
                            key={show.id}
                            onClick={() => handleShowSelect(show)}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center text-sm font-medium text-gray-900">
                                <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                                {show.showTime || 'TBD'}
                              </div>
                              <div className="flex items-center text-sm text-green-600">
                                <CurrencyRupeeIcon className="h-4 w-4" />
                                {show.price || '250'}
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600">
                              Screen: {show.screenName || 'Screen 1'}
                            </div>
                            
                            <div className="text-xs text-gray-500 mt-1">
                              {show.availableSeats || 150} seats available
                            </div>
                            
                            <div className="mt-2 text-xs text-blue-600 group-hover:text-blue-700">
                              Select Seats →
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSelection;