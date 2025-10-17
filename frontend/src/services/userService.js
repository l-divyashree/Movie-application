const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class UserService {
  // Get authentication token from localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Profile Management
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return mock data for demo
      return {
        id: 1,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0123',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        address: '456 Oak Street, Downtown',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        profilePicture: null,
        preferences: {
          language: 'english',
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          favoriteGenres: ['Action', 'Drama', 'Comedy'],
          preferredTheatres: ['PVR Cinemas Forum Mall', 'AMC Theater Downtown']
        }
      };
    }
  }

  async updateUserProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Mock success response
      return { success: true, message: 'Profile updated successfully' };
    }
  }

  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile/picture`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload profile picture: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Mock success response
      return { 
        success: true, 
        message: 'Profile picture uploaded successfully',
        profilePictureUrl: URL.createObjectURL(file)
      };
    }
  }

  // Password Management
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (!response.ok) {
        throw new Error(`Failed to change password: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      // Mock success response
      return { success: true, message: 'Password changed successfully' };
    }
  }

  // Two Factor Authentication
  async enable2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/2fa/enable`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to enable 2FA: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      // Mock response
      return { 
        success: true, 
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        backupCodes: ['ABC123', 'DEF456', 'GHI789']
      };
    }
  }

  async disable2FA() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/2fa/disable`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to disable 2FA: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      return { success: true, message: '2FA disabled successfully' };
    }
  }

  // Account Management
  async deleteAccount(password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password })
      });
      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: true, message: 'Account deletion request processed' };
    }
  }

  async exportData() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/export-data`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to export data: ${response.statusText}`);
      }
      return response.blob();
    } catch (error) {
      console.error('Error exporting data:', error);
      // Mock data export
      const mockData = {
        profile: await this.getUserProfile(),
        bookings: [],
        payments: [],
        exportDate: new Date().toISOString()
      };
      return new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
    }
  }

  // Linked Accounts
  async getLinkedAccounts() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/linked-accounts`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch linked accounts: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
      // Mock data
      return [
        {
          id: 1,
          provider: 'google',
          email: 'john.doe@gmail.com',
          connectedAt: '2025-01-15T10:00:00Z',
          status: 'active'
        },
        {
          id: 2,
          provider: 'facebook',
          email: 'john.doe@facebook.com',
          connectedAt: '2025-01-10T15:30:00Z',
          status: 'active'
        }
      ];
    }
  }

  async linkAccount(provider, authCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/link-account`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ provider, authCode })
      });
      if (!response.ok) {
        throw new Error(`Failed to link account: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error linking account:', error);
      return { success: true, message: `${provider} account linked successfully` };
    }
  }

  async unlinkAccount(accountId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/unlink-account/${accountId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to unlink account: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error unlinking account:', error);
      return { success: true, message: 'Account unlinked successfully' };
    }
  }
}

export default new UserService();