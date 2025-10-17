import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profile, setProfile] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    preferences: {
      favoriteGenres: [],
      notifications: {
        email: true,
        sms: false,
        promotional: false
      }
    }
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Since we don't have a profile endpoint yet, use mock data
      const mockProfile = {
        email: user?.email || 'user@moviebook.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0123',
        dateOfBirth: '1990-01-01',
        address: '123 Main Street, Apt 4B',
        city: 'Bangalore',
        preferences: {
          favoriteGenres: ['Action', 'Drama', 'Comedy'],
          notifications: {
            email: true,
            sms: false,
            promotional: false
          }
        }
      };
      setProfile(mockProfile);
      setEditForm(mockProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original values
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock save operation - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setProfile(editForm);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [field]: value
        }
      }
    }));
  };

  const ProfileField = ({ label, value, field, type = 'text', editable = true }) => (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {isEditing && editable ? (
          <input
            type={type}
            value={editForm[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <span>{value || 'Not provided'}</span>
        )}
      </dd>
    </div>
  );

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </button>
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-600 mt-1">Update your personal details and contact information</p>
              </div>
              
              <div className="px-6 py-5">
                <dl className="divide-y divide-gray-200">
                  <ProfileField
                    label="Email Address"
                    value={profile.email}
                    field="email"
                    type="email"
                    editable={false}
                  />
                  <ProfileField
                    label="First Name"
                    value={profile.firstName}
                    field="firstName"
                  />
                  <ProfileField
                    label="Last Name"
                    value={profile.lastName}
                    field="lastName"
                  />
                  <ProfileField
                    label="Phone Number"
                    value={profile.phone}
                    field="phone"
                    type="tel"
                  />
                  <ProfileField
                    label="Date of Birth"
                    value={profile.dateOfBirth}
                    field="dateOfBirth"
                    type="date"
                  />
                  <ProfileField
                    label="Address"
                    value={profile.address}
                    field="address"
                  />
                  <ProfileField
                    label="City"
                    value={profile.city}
                    field="city"
                  />
                </dl>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white shadow-sm rounded-lg mt-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-600 mt-1">Choose how you want to receive notifications</p>
              </div>
              
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEditing ? editForm.preferences.notifications.email : profile.preferences.notifications.email}
                    onChange={(e) => isEditing && handleNotificationChange('email', e.target.checked)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive booking reminders and updates via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEditing ? editForm.preferences.notifications.sms : profile.preferences.notifications.sms}
                    onChange={(e) => isEditing && handleNotificationChange('sms', e.target.checked)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Promotional Emails</h4>
                    <p className="text-sm text-gray-600">Receive offers and promotional content</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEditing ? editForm.preferences.notifications.promotional : profile.preferences.notifications.promotional}
                    onChange={(e) => isEditing && handleNotificationChange('promotional', e.target.checked)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : 'User Profile'
                    }
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {profile.preferences.favoriteGenres.map(genre => (
                  <span 
                    key={genre}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={() => navigate('/download-data')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Download My Data
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;