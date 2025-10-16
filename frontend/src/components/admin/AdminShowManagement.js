import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import movieService from '../../services/movieService';

const AdminShowManagement = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

  const [formData, setFormData] = useState({
    movieId: '',
    venueId: '',
    showTime: '',
    showDate: '',
    price: '',
    screenName: '',
    totalSeats: 150,
    availableSeats: 150,
    isActive: true
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [showsData, moviesData, venuesData] = await Promise.all([
        adminService.getShows(),
        movieService.getMovies({}),
        adminService.getVenues()
      ]);
      
      setShows(showsData.content || []);
      setMovies(moviesData.content || []);
      setVenues(venuesData || []);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const showData = {
        movie: { id: formData.movieId },
        venue: { id: formData.venueId },
        showDate: formData.showDate,
        showTime: formData.showTime,
        price: parseFloat(formData.price),
        screenName: formData.screenName,
        totalSeats: parseInt(formData.totalSeats),
        availableSeats: parseInt(formData.availableSeats),
        isActive: formData.isActive
      };

      if (editingShow) {
        await adminService.updateShow(editingShow.id, showData);
      } else {
        await adminService.createShow(showData);
      }
      
      resetForm();
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movieId: show.movie?.id || '',
      venueId: show.venue?.id || '',
      showTime: show.showTime || '',
      showDate: show.showDate || '',
      price: show.price || '',
      screenName: show.screenName || '',
      totalSeats: show.totalSeats || 150,
      availableSeats: show.availableSeats || 150,
      isActive: show.isActive !== undefined ? show.isActive : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await adminService.deleteShow(id);
        loadInitialData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      movieId: '',
      venueId: '',
      showTime: '',
      showDate: '',
      price: '',
      screenName: '',
      totalSeats: 150,
      availableSeats: 150,
      isActive: true
    });
    setEditingShow(null);
    setShowForm(false);
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'Not set';
    return `${date} at ${time}`;
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Show Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Show</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Show Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                {editingShow ? 'Edit Show' : 'Add New Show'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Movie
                  </label>
                  <select
                    name="movieId"
                    value={formData.movieId}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Movie</option>
                    {movies.map(movie => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <select
                    name="venueId"
                    value={formData.venueId}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} - {venue.city?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="showDate"
                      value={formData.showDate}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="showTime"
                      value={formData.showTime}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Screen Name
                    </label>
                    <input
                      type="text"
                      name="screenName"
                      value={formData.screenName}
                      onChange={handleInputChange}
                      placeholder="Screen 1, IMAX, etc."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available
                    </label>
                    <input
                      type="number"
                      name="availableSeats"
                      value={formData.availableSeats}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingShow ? 'Update Show' : 'Create Show'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Shows List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shows.map((show) => (
          <div key={show.id} className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {show.movie?.title || 'Unknown Movie'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(show)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(show.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  <span>{show.venue?.name || 'Unknown Venue'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{formatDateTime(show.showDate, show.showTime)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    ₹{show.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {show.availableSeats}/{show.totalSeats} seats
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  {show.screenName && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {show.screenName}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${show.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'}`}>
                    {show.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shows.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No shows found. Create your first show!</p>
        </div>
      )}
    </div>
  );
};

export default AdminShowManagement;