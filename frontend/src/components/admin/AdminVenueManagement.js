import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';

const AdminVenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cityId: '',
    totalScreens: '',
    totalSeats: '',
    phone: '',
    email: '',
    isActive: true
  });

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [venuesData, citiesData] = await Promise.all([
        adminService.getVenues(),
        adminService.getCities()
      ]);
      
      setVenues(venuesData || []);
      setCities(citiesData || []);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const venueData = {
        ...formData,
        totalScreens: parseInt(formData.totalScreens) || 0,
        totalSeats: parseInt(formData.totalSeats) || 0,
        city: { id: formData.cityId }
      };

      if (editingVenue) {
        await adminService.updateVenue(editingVenue.id, venueData);
      } else {
        await adminService.createVenue(venueData);
      }
      
      resetForm();
      loadInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name || '',
      address: venue.address || '',
      cityId: venue.city?.id || '',
      totalScreens: venue.totalScreens?.toString() || '',
      totalSeats: venue.totalSeats?.toString() || '',
      phone: venue.phoneNumber || '',
      email: venue.email || '',
      isActive: venue.isActive !== undefined ? venue.isActive : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        await adminService.deleteVenue(id);
        loadInitialData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      cityId: '',
      totalScreens: '',
      totalSeats: '',
      phone: '',
      email: '',
      isActive: true
    });
    setEditingVenue(null);
    setShowForm(false);
    setError(null);
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || venue.city?.id === parseInt(selectedCity);
    return matchesSearch && matchesCity;
  });

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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
          <p className="text-gray-600 mt-1">Manage theaters and cinema venues</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Venue</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by venue name or address..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearchTerm(''); setSelectedCity(''); }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Venue Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                {editingVenue ? 'Edit Venue' : 'Add New Venue'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., PVR Cinemas"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Screens
                    </label>
                    <input
                      type="number"
                      name="totalScreens"
                      value={formData.totalScreens}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Active Venue</label>
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
                    {editingVenue ? 'Update Venue' : 'Create Venue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Venues Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {venue.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(venue)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(venue.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <div>{venue.address}</div>
                    <div className="font-medium text-blue-600">{venue.city?.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  <span>{venue.totalScreens || 0} Screens • {venue.totalSeats || 0} Total Seats</span>
                </div>

                {venue.phoneNumber && (
                  <div className="text-sm text-gray-600">
                    <strong>Phone:</strong> {venue.phoneNumber}
                  </div>
                )}

                {venue.email && (
                  <div className="text-sm text-gray-600">
                    <strong>Email:</strong> {venue.email}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className={`px-2 py-1 text-xs rounded ${venue.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'}`}>
                    {venue.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && !loading && (
        <div className="text-center py-8">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No venues found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCity ? 'Try adjusting your filters.' : 'Get started by adding your first venue.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminVenueManagement;