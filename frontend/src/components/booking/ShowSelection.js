import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  CurrencyRupeeIcon,
  ChevronLeftIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import bookingService from '../../services/bookingService';
import movieService from '../../services/movieService';

const ShowSelection = () => {
  const { id, movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [venues, setVenues] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the actual movie ID (handle both URL patterns)
  const actualMovieId = movieId || id;

  // Generate next 7 days for date selection
  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return days;
  };

  const availableDates = getNextSevenDays();

  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0].date);
    }
  }, []);

  useEffect(() => {
    loadMovieAndShows();
  }, [actualMovieId]);

  useEffect(() => {
    if (selectedCity || selectedDate || selectedVenue) {
      loadFilteredShows();
    }
  }, [selectedCity, selectedDate, selectedVenue]);

  const loadMovieAndShows = async () => {
    try {
      setLoading(true);
      
      // Load movie details from API
      const movieData = await movieService.getMovieById(actualMovieId);
      setMovie(movieData);

      // Load shows, venues, and cities
      const [showsResponse, venuesData] = await Promise.all([
        bookingService.getShows(actualMovieId),
        bookingService.getVenues()
      ]);

      // Extract shows from paginated response
      setShows(showsResponse.content || []);
      setVenues(venuesData);

      // Extract unique cities from venues - handle city objects properly
      const uniqueCities = [...new Set(venuesData.map(venue => 
        venue.city && typeof venue.city === 'object' ? venue.city.name : venue.city
      ))].filter(city => city); // Remove any null/undefined values
      setCities(uniqueCities);
      
      if (uniqueCities.length > 0) {
        setSelectedCity(uniqueCities[0]);
      }

    } catch (err) {
      console.error('Error loading movie and shows:', err);
      setError('Failed to load show information');
      
      // Mock data as fallback
      setMovie({
        id: actualMovieId,
        title: 'The Avengers: Endgame',
        genre: 'Action, Adventure, Sci-Fi',
        duration: '3h 1min',
        rating: 'PG-13',
        posterUrl: '/placeholder-movie.jpg',
        description: 'The culmination of 22 interconnected films, the fourth installment of the Avengers saga.'
      });

      const mockShows = [
        {
          id: 1,
          movieId: actualMovieId,
          venue: { id: 1, name: 'PVR Cinemas Forum Mall', city: 'Bangalore', address: 'Forum Mall, Koramangala' },
          showDate: availableDates[0].date,
          showTime: '10:00',
          price: 200,
          availableSeats: 120
        },
        {
          id: 2,
          movieId: actualMovieId,
          venue: { id: 1, name: 'PVR Cinemas Forum Mall', city: 'Bangalore', address: 'Forum Mall, Koramangala' },
          showDate: availableDates[0].date,
          showTime: '14:30',
          price: 250,
          availableSeats: 85
        },
        {
          id: 3,
          movieId: actualMovieId,
          venue: { id: 2, name: 'INOX Garuda Mall', city: 'Bangalore', address: 'Garuda Mall, Magrath Road' },
          showDate: availableDates[0].date,
          showTime: '18:00',
          price: 300,
          availableSeats: 95
        }
      ];

      setShows(mockShows);
      setCities(['Bangalore', 'Mumbai', 'Delhi']);
      setSelectedCity('Bangalore');
      setVenues([
        { id: 1, name: 'PVR Cinemas Forum Mall', city: 'Bangalore', address: 'Forum Mall, Koramangala' },
        { id: 2, name: 'INOX Garuda Mall', city: 'Bangalore', address: 'Garuda Mall, Magrath Road' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredShows = async () => {
    try {
      const filteredShowsResponse = await bookingService.getShows(actualMovieId, {
        city: selectedCity,
        date: selectedDate,
        venueId: selectedVenue
      });
      // Extract shows from paginated response
      setShows(filteredShowsResponse.content || []);
    } catch (err) {
      console.error('Error loading filtered shows:', err);
      // Keep existing shows as fallback
    }
  };

  const handleShowSelect = (show) => {
    navigate(`/booking/seats/${show.id}`, {
      state: {
        show,
        movie
      }
    });
  };

  const groupShowsByVenue = () => {
    const filteredShows = shows.filter(show => {
      const venueCityName = show.venue?.city && typeof show.venue.city === 'object' 
        ? show.venue.city.name 
        : show.venue?.city;
      
      return (!selectedCity || venueCityName === selectedCity) &&
             (!selectedDate || show.showDate === selectedDate) &&
             (!selectedVenue || show.venue?.id === parseInt(selectedVenue));
    });

    const grouped = {};
    filteredShows.forEach(show => {
      const venueKey = show.venue?.name || 'Unknown Venue';
      if (!grouped[venueKey]) {
        grouped[venueKey] = {
          venue: show.venue,
          shows: []
        };
      }
      grouped[venueKey].shows.push(show);
    });

    return grouped;
  };

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
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/movies')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const groupedShows = groupShowsByVenue();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/movies')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              {movie?.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-16 h-22 object-cover rounded-lg"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{movie?.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{movie?.genre}</span>
                  <span>•</span>
                  <span>{movie?.duration}</span>
                  <span>•</span>
                  <span>{movie?.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Show Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableDates.map(day => (
                  <option key={day.date} value={day.date}>{day.displayDate}</option>
                ))}
              </select>
            </div>

            {/* Venue Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Venues</option>
                {venues
                  .filter(venue => {
                    const venueCityName = venue.city && typeof venue.city === 'object' 
                      ? venue.city.name 
                      : venue.city;
                    return !selectedCity || venueCityName === selectedCity;
                  })
                  .map(venue => (
                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shows by Venue */}
        <div className="space-y-6">
          {Object.keys(groupedShows).length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shows Available</h3>
              <p className="text-gray-600">
                No shows found for the selected filters. Please try different options.
              </p>
            </div>
          ) : (
            Object.entries(groupedShows).map(([venueName, { venue, shows: venueShows }]) => (
              <div key={venueName} className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">{venueName}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{venue?.address}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {venueShows.map(show => (
                      <button
                        key={show.id}
                        onClick={() => handleShowSelect(show)}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <div className="flex items-center mb-2">
                          <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="font-medium text-gray-900">{show.showTime}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <CurrencyRupeeIcon className="h-3 w-3 mr-1" />
                          <span>₹{show.price}</span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {show.availableSeats} seats available
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowSelection;