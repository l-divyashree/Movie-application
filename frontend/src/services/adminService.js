const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class AdminService {
  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // ===== MOVIE MANAGEMENT =====
  
  async createMovie(movieData) {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(movieData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create movie: ${response.statusText}`);
    }
    return response.json();
  }

  async updateMovie(id, movieData) {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(movieData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update movie: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteMovie(id) {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to delete movie: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== SHOW MANAGEMENT =====
  
  async getShows(page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/shows?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch shows: ${response.statusText}`);
    }
    return response.json();
  }

  async createShow(showData) {
    const response = await fetch(`${API_BASE_URL}/shows`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(showData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create show: ${response.statusText}`);
    }
    return response.json();
  }

  async updateShow(id, showData) {
    const response = await fetch(`${API_BASE_URL}/shows/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(showData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update show: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteShow(id) {
    const response = await fetch(`${API_BASE_URL}/shows/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to delete show: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== VENUE MANAGEMENT =====
  
  async getVenues() {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.statusText}`);
    }
    return response.json();
  }

  async createVenue(venueData) {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(venueData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create venue: ${response.statusText}`);
    }
    return response.json();
  }

  async updateVenue(id, venueData) {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(venueData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update venue: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteVenue(id) {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to delete venue: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== BOOKING MANAGEMENT =====
  
  async getAllBookings(page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/bookings/all?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }
    return response.json();
  }

  async cancelBooking(id) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== STATISTICS =====
  
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/statistics`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard statistics: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== USER MANAGEMENT =====
  
  async getAllUsers(page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.json();
  }

  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    return response.json();
  }

  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
    return response.json();
  }

  async toggleUserStatus(id, isActive) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });
    if (!response.ok) {
      throw new Error(`Failed to toggle user status: ${response.statusText}`);
    }
    return response.json();
  }

  async updateUserRole(id, roleId) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ roleId })
    });
    if (!response.ok) {
      throw new Error(`Failed to update user role: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== ROLE MANAGEMENT =====
  
  async getRoles() {
    const response = await fetch(`${API_BASE_URL}/admin/roles`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }
    return response.json();
  }

  // ===== CITY MANAGEMENT =====
  
  async getCities() {
    const response = await fetch(`${API_BASE_URL}/cities`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }
    return response.json();
  }

  async createCity(cityData) {
    const response = await fetch(`${API_BASE_URL}/cities`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cityData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create city: ${response.statusText}`);
    }
    return response.json();
  }

  async updateCity(id, cityData) {
    const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cityData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update city: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteCity(id) {
    const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to delete city: ${response.statusText}`);
    }
    return response.json();
  }
}

const adminService = new AdminService();
export default adminService;