import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';

const NotificationsCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      const notificationsData = await notificationService.getUserNotifications();
      setNotifications(notificationsData.notifications || []);

    } catch (error) {
      console.error('Error loading notifications:', error);
      // Set empty array as fallback
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settingsData = await notificationService.getNotificationSettings();
      setSettings(settingsData.settings || {});
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set default settings as fallback
      setSettings({
        push_notifications: true,
        email_notifications: true,
        sms_notifications: false,
        booking_confirmations: true,
        payment_alerts: true,
        show_reminders: true,
        movie_releases: true,
        special_offers: true,
        loyalty_updates: false,
        system_updates: true,
        marketing_emails: false,
        reminder_timing: '2_hours',
        quiet_hours_enabled: true,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00'
      });
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (activeTab === 'important') {
      filtered = filtered.filter(n => n.priority === 'high');
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await notificationService.clearAllNotifications();
        setNotifications([]);
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await notificationService.updateNotificationSettings(newSettings);
      setSettings(newSettings);
      setShowSettingsModal(false);
      alert('Notification settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking_confirmation: '🎫',
      payment_success: '💳',
      show_reminder: '⏰',
      movie_release: '🎬',
      cancellation_refund: '💰',
      loyalty_reward: '⭐',
      special_offer: '🎁',
      system_maintenance: '🔧',
      security_alert: '🔒'
    };
    return icons[type] || '📢';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      booking_confirmation: 'Booking',
      payment_success: 'Payment',
      show_reminder: 'Reminder',
      movie_release: 'New Release',
      cancellation_refund: 'Refund',
      loyalty_reward: 'Loyalty',
      special_offer: 'Offer',
      system_maintenance: 'System',
      security_alert: 'Security'
    };
    return labels[type] || 'General';
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">
                Stay updated with your bookings and latest offers
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => navigate('/user/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-4">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Mark All Read
              </button>
              <button
                onClick={clearAllNotifications}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="booking_confirmation">Booking</option>
                <option value="payment_success">Payment</option>
                <option value="show_reminder">Reminders</option>
                <option value="movie_release">New Releases</option>
                <option value="special_offer">Offers</option>
                <option value="loyalty_reward">Loyalty</option>
                <option value="system_maintenance">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: 'All Notifications', count: notifications.length },
                { id: 'unread', label: 'Unread', count: unreadCount },
                { id: 'important', label: 'Important', count: notifications.filter(n => n.priority === 'high').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Notifications List */}
          <div className="p-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 rounded-lg p-4 hover:shadow-md transition-shadow ${getPriorityColor(notification.priority)} ${
                      !notification.isRead ? 'border-r-4 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-2xl flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                                  {getTypeLabel(notification.type)}
                                </span>
                                <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                                <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
                                <span className="capitalize">{notification.priority} priority</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          {/* Additional Info Based on Type */}
                          {notification.type === 'booking_confirmation' && notification.bookingReference && (
                            <div className="bg-white rounded p-2 mb-3 text-sm text-gray-600">
                              <strong>Booking Reference:</strong> {notification.bookingReference}
                            </div>
                          )}
                          
                          {notification.type === 'payment_success' && notification.amount && (
                            <div className="bg-white rounded p-2 mb-3 text-sm text-green-700">
                              <strong>Amount Paid:</strong> ${notification.amount.toFixed(2)}
                            </div>
                          )}
                          
                          {notification.type === 'special_offer' && notification.offerCode && (
                            <div className="bg-white rounded p-2 mb-3 text-sm text-purple-700">
                              <strong>Offer Code:</strong> {notification.offerCode} • 
                              <strong> Discount:</strong> {notification.discount} • 
                              <strong> Expires:</strong> {new Date(notification.expiryDate).toLocaleDateString()}
                            </div>
                          )}
                          
                          {notification.type === 'loyalty_reward' && notification.pointsEarned && (
                            <div className="bg-white rounded p-2 mb-3 text-sm text-yellow-700">
                              <strong>Points Earned:</strong> {notification.pointsEarned} • 
                              <strong> Total Points:</strong> {notification.totalPoints}
                            </div>
                          )}

                          <div className="flex items-center space-x-3">
                            {notification.actionUrl && notification.actionText && (
                              <button
                                onClick={() => navigate(notification.actionUrl)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                              >
                                {notification.actionText}
                              </button>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Mark as Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔔</div>
                <p className="text-gray-500 text-lg mb-2">No notifications found</p>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'unread' && 'All notifications have been read'}
                  {activeTab === 'important' && 'No important notifications'}
                  {activeTab === 'all' && 'You\'re all caught up!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.push_notifications}
                        onChange={(e) => setSettings(prev => ({...prev, push_notifications: e.target.checked}))}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Push Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email_notifications}
                        onChange={(e) => setSettings(prev => ({...prev, email_notifications: e.target.checked}))}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Email Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.sms_notifications}
                        onChange={(e) => setSettings(prev => ({...prev, sms_notifications: e.target.checked}))}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">SMS Notifications</span>
                    </label>
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {key: 'booking_confirmations', label: 'Booking Confirmations'},
                      {key: 'payment_alerts', label: 'Payment Alerts'},
                      {key: 'show_reminders', label: 'Show Reminders'},
                      {key: 'movie_releases', label: 'New Movie Releases'},
                      {key: 'special_offers', label: 'Special Offers'},
                      {key: 'loyalty_updates', label: 'Loyalty Updates'},
                      {key: 'system_updates', label: 'System Updates'},
                      {key: 'marketing_emails', label: 'Marketing Emails'}
                    ].map(item => (
                      <label key={item.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={(e) => setSettings(prev => ({...prev, [item.key]: e.target.checked}))}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700 text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reminder Timing */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Show Reminder Timing</h4>
                  <select
                    value={settings.reminder_timing}
                    onChange={(e) => setSettings(prev => ({...prev, reminder_timing: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30_mins">30 minutes before</option>
                    <option value="1_hour">1 hour before</option>
                    <option value="2_hours">2 hours before</option>
                    <option value="4_hours">4 hours before</option>
                  </select>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Quiet Hours</h4>
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={settings.quiet_hours_enabled}
                      onChange={(e) => setSettings(prev => ({...prev, quiet_hours_enabled: e.target.checked}))}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Enable quiet hours (no notifications)</span>
                  </label>
                  {settings.quiet_hours_enabled && (
                    <div className="flex space-x-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">From</label>
                        <input
                          type="time"
                          value={settings.quiet_hours_start}
                          onChange={(e) => setSettings(prev => ({...prev, quiet_hours_start: e.target.value}))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">To</label>
                        <input
                          type="time"
                          value={settings.quiet_hours_end}
                          onChange={(e) => setSettings(prev => ({...prev, quiet_hours_end: e.target.value}))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => updateSettings(settings)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;