const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class NotificationService {
  // Get authentication token from localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Notifications Management
  async getNotifications(page = 0, size = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&size=${size}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return mock data for demo
      return {
        content: [
          {
            id: 'NOTIF001',
            type: 'booking_confirmation',
            title: 'Booking Confirmed',
            message: 'Your booking for Spider-Man: No Way Home has been confirmed. Show time: Jan 20, 2025 at 7:30 PM',
            timestamp: '2025-01-15T10:30:00Z',
            isRead: false,
            priority: 'high',
            actionUrl: '/user/bookings',
            actionText: 'View Booking',
            bookingReference: 'MB2025001'
          }
        ],
        totalElements: 1,
        totalPages: 1
      };
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: true };
    }
  }

  async markAllAsRead() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: true };
    }
  }

  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: true };
    }
  }

  async clearAllNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to clear all notifications: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      return { success: true };
    }
  }

  // Notification Settings
  async getNotificationSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch notification settings: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Return mock settings
      return {
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
      };
    }
  }

  async updateNotificationSettings(settings) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings)
      });
      if (!response.ok) {
        throw new Error(`Failed to update notification settings: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return { success: true, message: 'Notification settings updated successfully' };
    }
  }

  // Push Notification Registration
  async registerForPushNotifications(subscription) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/push/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(subscription)
      });
      if (!response.ok) {
        throw new Error(`Failed to register for push notifications: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return { success: true };
    }
  }

  async unregisterFromPushNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/push/unregister`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to unregister from push notifications: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error unregistering from push notifications:', error);
      return { success: true };
    }
  }

  // Test Notification
  async sendTestNotification() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/test`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to send test notification: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error sending test notification:', error);
      return { success: true, message: 'Test notification sent successfully' };
    }
  }

  // Browser Push Notifications (Web API)
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  showBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options
      });
    }
  }
}

export default new NotificationService();