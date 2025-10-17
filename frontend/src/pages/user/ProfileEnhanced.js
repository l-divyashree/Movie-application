import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('/default-avatar.png');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: ''
  });

  const [preferences, setPreferences] = useState({
    preferredLanguages: ['English'],
    preferredGenres: ['Action', 'Drama'],
    preferredTheatres: [],
    preferredSeatTypes: ['Standard'],
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    movieReleaseAlerts: true,
    bookingReminders: true,
    offerNotifications: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: false,
    facebook: false,
    apple: false
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userService.getProfile();
      setFormData({
        name: profileData.name || user?.name || 'John Doe',
        email: profileData.email || user?.email || 'john.doe@example.com',
        phone: profileData.phone || '+1 234 567 8900',
        city: profileData.city || 'New York',
        dateOfBirth: profileData.dateOfBirth || '1990-01-15',
        gender: profileData.gender || 'Male',
        address: profileData.address || '123 Main Street, Apt 4B',
        emergencyContact: profileData.emergencyContact || '+1 234 567 8901'
      });
      
      if (profileData.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...profileData.preferences
        }));
      }
      
      if (profileData.linkedAccounts) {
        setLinkedAccounts(prev => ({
          ...prev,
          ...profileData.linkedAccounts
        }));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayPreferenceChange = (key, item) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(item) 
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateProfile({
        ...formData,
        preferences,
        linkedAccounts
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setLoading(true);
    try {
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleLinkedAccount = async (provider) => {
    try {
      const newStatus = !linkedAccounts[provider];
      
      if (newStatus) {
        await userService.linkSocialAccount(provider);
      } else {
        await userService.unlinkSocialAccount(provider);
      }
      
      setLinkedAccounts(prev => ({
        ...prev,
        [provider]: newStatus
      }));
      setMessage(`${provider} account ${newStatus ? 'connected' : 'disconnected'}!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(`Error ${linkedAccounts[provider] ? 'disconnecting' : 'connecting'} ${provider} account:`, error);
      setMessage(`Error ${linkedAccounts[provider] ? 'disconnecting' : 'connecting'} ${provider} account`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        await userService.deleteAccount();
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        setMessage('Error deleting account. Please try again.');
        setTimeout(() => setMessage(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'password', label: 'Password & Security', icon: '🔒' },
    { id: 'accounts', label: 'Linked Accounts', icon: '🔗' }
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Hindi', 'Telugu', 'Tamil'];
  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary'];
  const seatTypes = ['Standard', 'Premium', 'VIP', 'Recliner', 'IMAX', 'Dolby Atmos'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') || message.includes('do not match') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Details Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Profile Photo Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
                      <img 
                        src={photoPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg width='96' height='96' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z' fill='%236B7280'/%3E%3Cpath d='M12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z' fill='%236B7280'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
                    <p className="text-gray-600">{formData.email}</p>
                  </div>
                  <div className="ml-auto">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            loadUserProfile();
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-8">
                {/* Language Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Language Preferences</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languages.map(lang => (
                      <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.preferredLanguages.includes(lang)}
                          onChange={() => handleArrayPreferenceChange('preferredLanguages', lang)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Genre Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Favorite Genres</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {genres.map(genre => (
                      <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.preferredGenres.includes(genre)}
                          onChange={() => handleArrayPreferenceChange('preferredGenres', genre)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seat Type Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Seat Types</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {seatTypes.map(seatType => (
                      <label key={seatType} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.preferredSeatTypes.includes(seatType)}
                          onChange={() => handleArrayPreferenceChange('preferredSeatTypes', seatType)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{seatType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive booking confirmations and updates via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive booking reminders and alerts via SMS' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive real-time notifications on your device' },
                      { key: 'movieReleaseAlerts', label: 'Movie Release Alerts', desc: 'Get notified when movies in your wishlist are released' },
                      { key: 'bookingReminders', label: 'Booking Reminders', desc: 'Receive reminders about upcoming shows' },
                      { key: 'offerNotifications', label: 'Offer Notifications', desc: 'Get notified about special offers and discounts' },
                      { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails and newsletters' }
                    ].map(item => (
                      <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-900">{item.label}</label>
                          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences[item.key]}
                          onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setMessage('Preferences saved successfully!')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* Password & Security Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-yellow-600 mr-3 mt-0.5">⚠️</div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Two-Factor Authentication</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                        <button className="mt-3 text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Linked Accounts Tab */}
            {activeTab === 'accounts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h3>
                  <div className="space-y-4">
                    {[
                      { provider: 'google', name: 'Google', color: 'bg-red-500', icon: '🔴' },
                      { provider: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: '🔵' },
                      { provider: 'apple', name: 'Apple', color: 'bg-gray-800', icon: '⚫' }
                    ].map(account => (
                      <div key={account.provider} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full ${account.color} flex items-center justify-center text-white font-bold`}>
                            {account.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                            <p className="text-sm text-gray-600">
                              {linkedAccounts[account.provider] ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleLinkedAccount(account.provider)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            linkedAccounts[account.provider]
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {linkedAccounts[account.provider] ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-red-600 mr-3 mt-0.5">⚠️</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;